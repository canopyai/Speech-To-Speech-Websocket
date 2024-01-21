import { generateResponse } from './generateResponse.js';

export const detectResponse = ({
    globals,
    processingQueue,

}) => {


    let currentDate = Date.now();

    if (globals.isProcessingResponse) {
        return;
    }

    if (globals.lastVADSpeechStarted > globals.lastVADSpeechEnded) {
        return;
    }

    if (globals.finalTranscript.trim().length === 0) {
        return;
    }

    let timeSinceLastVAD = currentDate - globals.lastVADSpeechEnded;

  


  

    generateResponse({
        globals,
        processingQueue,
    });

    //300 ms since last vad was speaking
    //isnt already in the queue
}