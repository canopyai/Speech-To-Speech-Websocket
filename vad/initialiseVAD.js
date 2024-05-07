
export const initialiseVAD = async ({
    ws,
    globals,
}) => {
    ws.on('message', async function (message) {

        const { messageType, data } = JSON.parse(message);

        if (messageType !== "vad") return;

        const { vad_type } = data

        if (vad_type === "start") {

            console.log("*** user has started speaking  ***")

            
            globals.conversationIndex++;


            globals.forwardSocket.ws.send(JSON.stringify({
                messageType: "clearQueue",
                conversationIndex: globals.conversationIndex
            }));

            globals.frontendSocket.ws.send(JSON.stringify({
                messageType: "clearQueue",
                conversationIndex: globals.conversationIndex
            }));
        }
    });


    ws.on('error', function (error) {
        console.log('Stream error: ', error);
    });
}
