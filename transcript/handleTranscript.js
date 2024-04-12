import { modifyTranscript } from "./modifyTranscript.js";

export const handleTranscript = ({
    ws,
    globals,
    data
}) => {

    const { role, content } = data;

    const { success, error } = modifyTranscript({
        globals,
        role,
        content,
        ws
    });

    if (!success) {
        return
        ws.send(JSON.stringify({
            messageType: "error",
            data: error
        }));
    }


};
