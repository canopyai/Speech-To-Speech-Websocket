export const handleMessageThreadLength = async ({
    ws,
    globals
}) => {

    const messageThread = globals.mainThread;

    if (messageThread) {

        ws.send(JSON.stringify({
            messageType: "messageThreadLengthResponse",
            success: true,
            data: {
                timestamp: Date.now(),
                messageThreadLength: messageThread.length
            }
        }));

    } else {

        ws.send(JSON.stringify({
            messageType: "messageThreadLengthResponse",
            success: false,
            data: {
                error: "No message thread found"
            }
        }));
    }

    return;
}