export const handleReadDialogue = async ({
    ws,
    globals
}) => {

    const messageThread = globals.mainThread;

    if (messageThread) {
        return
        ws.send(JSON.stringify({
            messageType: "readDialogueResponse",
            success: true,
            data: {
                timestamp: Date.now(),
                messageThread: messageThread
            }
        }));

    } else {
        return
        ws.send(JSON.stringify({
            messageType: "readDialogueResponse",
            success: false,
            data: {
                error: "No message thread found"
            }
        }));
    }

    return;
}