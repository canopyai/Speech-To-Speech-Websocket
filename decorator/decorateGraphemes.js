exports.decorateGraphemes = async ({
    text,
    globals,
    ws,
    process
}) => {

    const { decoratorSocket } = globals;
    const { id } = process;

    const decoratorObject = {
        text,
        processId:id
    }

    decoratorSocket.emit('graphemize', decoratorObject);


}