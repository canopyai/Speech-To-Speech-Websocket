const { initialiseTranscription } = require('./transcription/initialiseTranscription');
const { initialiseVAD } = require('./vad/initialiseVAD');

exports.initialiseConnection = async ({
    session,
    ws,
    globals,
    processingQueue
}) => {

    initialiseTranscription({
        session,
        ws,
        globals,
        processingQueue
    });
    initialiseVAD({
        ws,
        globals,
        processingQueue
    });
}