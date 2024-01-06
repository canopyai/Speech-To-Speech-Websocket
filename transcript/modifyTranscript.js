const permittedRoles = ["user", "assistant", "system"];

exports.modifyTranscript = ({
    ws,
    globals
}) => {
    ws.on('message', async function (message) {
        const { messageType, data } = JSON.parse(message);

        if (messageType !== "transcript") return;

        const { role, content } = data;

        if (permittedRoles.includes(role)) {
            globals.mainThread.push({ role, content });
        } else {
            ws.send(JSON.stringify({
                messageType: "error",
                data: "Invalid role, role must be one of: " + permittedRoles.join(", ")
            }));
        }


    })
};
