import { initialiseVAD } from './vad/initialiseVAD.js';
import { initialiseDeepgramTranscription } from './transcription/deepgramTranscription/initialiseTranscription.js';
import {initialiseShallowgramTranscription} from './transcription/shallowgramTranscription/initialiseTranscription.js';

export const initialiseConnection = async ({
    session,
    ws,
    globals,
    processingQueue
}) => {



    initialiseShallowgramTranscription({
        ws,
        processingQueue,
        globals
    });

    initialiseVAD({
        ws,
        globals,
        processingQueue
    });
}
