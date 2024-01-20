const { initialiseSpeechmaticsTranscription } = require('./transcription/speechmaticsTranscription/initialiseTranscription');
const { initialiseVAD } = require('./vad/initialiseVAD');
const {initialiseDeepgramTranscription} = require('./transcription/deepgramTranscription/initialiseTranscription');
exports.initialiseConnection = async ({
    session,
    ws,
    globals,
    processingQueue
}) => {


    initialiseDeepgramTranscription({
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
