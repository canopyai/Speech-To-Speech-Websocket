import { initialiseSpeechmaticsTranscription } from './transcription/speechmaticsTranscription/initialiseTranscription.js';
import { initialiseVAD } from './vad/initialiseVAD.js';
import { initialiseDeepgramTranscription } from './transcription/deepgramTranscription/initialiseTranscription.js';

export const initialiseConnection = async ({
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
