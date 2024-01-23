import { writeTranscriptToFirebase } from "../firebase/firestore.js";
import { extractAgentFromTranscript } from "../action_agents/extract_action.js";
import { callActionAgent } from "../action_agents/call_action.js";

const permittedRoles = ["user", "assistant", "system"];

export const modifyTranscript = ({
    globals,
    role,
    content
}) => {

    if (permittedRoles.includes(role)) {
        if (globals.mainThread.length === 0 || globals.mainThread[globals.mainThread.length - 1].role !== role) {

            globals.mainThread.push({ role, content });

            writeTranscriptToFirebase(globals.projectId, globals.sessionId, {
                role: role,
                content: content
            });

            return { success: true };
        } else {
            globals.mainThread[globals.mainThread.length - 1].content += " " + content;

            const { tagName, jsonObject } = extractAgentFromTranscript(globals.mainThread[globals.mainThread.length - 1].content);

            if (tagName) {
                callActionAgent(tagName, jsonObject, globals.baseAgentUrl);
            }


            return { success: true };
        }
    } else {

        return {
            error: "Invalid role, role must be one of: " + permittedRoles.join(", ") + " but was: " + role,
            success: false
        };

    }
};
