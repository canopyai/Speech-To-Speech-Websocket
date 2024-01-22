import { authenticate } from './authenticate.js';

export const handleAuthenticate = async ({
    ws,
    globals,
    data
}) => {
    
    const { authToken } = data;

    const { success, projectId, error } = await authenticate(authToken);

    if (!success) {

        ws.send(JSON.stringify({
            messageType: "authenticate",
            success: "false",
            error
        }));

        ws.close(4000, "Authentication failed");

        return;
    }

    globals.authenticated = true;
    globals.projectId = projectId;

    ws.send(JSON.stringify({
        messageType: "authenticate",
        message: "You are now authenticated.",
        success: "true"
    }));

    return;

}
// if (globals.isProcessingResponse) return;