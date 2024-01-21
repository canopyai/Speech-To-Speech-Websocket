import { modifyTranscript } from "./modifyTranscript.js";

export const handleTranscript = ({
    ws,
    globals
}) => {
    ws.on('message', async function (message) {
        const { messageType, data } = JSON.parse(message);

        if (messageType !== "transcript") return;

        const { role, content } = data;

       const {success, error} = modifyTranscript({
            globals,
            role,
            content
        });

        if (!success) {
            ws.send(JSON.stringify({
                messageType: "error",
                data: error
            }));
        }

      
    })
};
