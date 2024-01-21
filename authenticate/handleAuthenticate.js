import { authenticate } from './authenticate.js';

export const handleAuthenticate = async ({
    ws, 
    globals
}) => {
    ws.on('message', async function (message) {
        const { data, messageType } = JSON.parse(message);
        const { authToken } = data;

        if(messageType !== "authenticate") return;

        const {success, error} = await authenticate({
            authToken
        });
        if(!success) {
            
            ws.send(JSON.stringify({
                messageType: "authenticate",
                success:"false",
                error
            }));
        }
        globals.authenticated = true;
        ws.send(JSON.stringify({
            messageType: "authenticate", 
            message:"You are now authenticated.",
            success: "true"
        }));
    })

    
}
// if (globals.isProcessingResponse) return;