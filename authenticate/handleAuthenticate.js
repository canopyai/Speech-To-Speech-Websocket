import { authenticate } from './authenticate.js';
import { initialiseFirebaseSessionRecord } from '../firebase/firestore.js';

export const handleAuthenticate = async ({
    ws,
    globals,
    data
}) => {

    const { authToken } = data;

    const { success, projectId, error } = await authenticate(authToken);

    const sessionId = await initialiseFirebaseSessionRecord(projectId);

    console.log("session id: ", sessionId);

    globals.authenticated = true;
    globals.projectId = projectId;
    globals.sessionId = sessionId;

    ws.send(JSON.stringify({
        messageType: "authenticate",
        message: "You are now authenticated.",
        success: "true"
    }));

    return;

}
// if (globals.isProcessingResponse) return;