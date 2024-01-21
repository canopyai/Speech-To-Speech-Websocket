exports.decoratePhonemes = async ({
    audioData,
    globals,
    ws,
    process
}) => {

    const { decoratorSocket } = globals;
    const { id } = process;

    const decoratorObject = {
        audioData,
        processId:id
    }

    decoratorSocket.emit('phonemize', decoratorObject);


}