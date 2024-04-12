export const handleUpdateDialogue = async ({
    ws,
    globals,
    data
}) => {

    // given dialogueIndex, update the dialogue with new role and content found in data

    const { dialogueIndex, role, content } = data;

    const permittedRoles = ["user", "assistant", "system"];

    try {
        if (role === null || permittedRoles.includes(role)) {

            const messageThread = globals.mainThread;


            // if role or content is null, dont update that field
            if (role) {
                messageThread[dialogueIndex].role = role;
            }

            if (content) {
                messageThread[dialogueIndex].content = content;
            }
            return
            ws.send(JSON.stringify({
                messageType: "updateDialogueResponse",
                success: true,
                data: {
                    timestamp: Date.now(),
                    messageThread: messageThread
                }
            }));

            return;


        } else {
            return
            ws.send(JSON.stringify({
                messageType: "updateDialogueResponse",
                success: false,
                error: "Invalid role, role must be one of: " + permittedRoles.join(", ") + " but was: " + role
            }));
        }
    } catch (error) {
        return
        ws.send(JSON.stringify({
            messageType: "updateDialogueResponse",
            success: false,
            error: error.message
        }));
    }

    return;
}