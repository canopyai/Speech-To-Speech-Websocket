import { writeTranscriptToFirebase } from "../firebase/firestore.js";

export const modifyThread = ({
    globals
}) => {

    if (globals.mainThread.length === 0) {
        globals.mainThread.push({
            role: "user",
            content: globals.finalTranscript
        });

        writeTranscriptToFirebase(globals.projectId, globals.sessionId, {
            role: "user",
            content: globals.finalTranscript
        });

        console.log("writing to firebase")

        return;
    }
    const lastMessage = globals.mainThread[globals.mainThread.length - 1];

    if (lastMessage.role === "user") {
        lastMessage.content = globals.finalTranscript;

    } else {
        globals.mainThread.push({
            role: "user",
            content: globals.finalTranscript
        });

        writeTranscriptToFirebase(globals.projectId, globals.sessionId, {
            role: "user",
            content: globals.finalTranscript
        });

        console.log("writing to firebase")

    }

    globals.finalTranscript = "";






}