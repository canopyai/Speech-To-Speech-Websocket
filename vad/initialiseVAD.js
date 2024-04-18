import vad from "@sentiment_technologies/vad-node";
import { int16ToFloat32 } from './processFrame.js';
import { addToTranscriptBuffer } from '../transcription/sileroTranscription/transcribe.js';
import { postAudioBuffer } from '../transcription/sileroTranscription/postAudio.js';

const VAD_THRESHOLD = 0.6;
let isSpeech = false;
const sampleRate = 16000;
const frameDuration = 200;
const frameSize = (sampleRate / 1000) * frameDuration;

export const initialiseVAD = async ({
    ws,
    globals,
    processingQueue
}) => {
    ws.on('message', async function (message) {

        const { messageType, data } = JSON.parse(message);

        if (messageType !== "vad") return;

        console.log("vad data: ", data)


        const { vad_type } = data

        console.log("vad type: ", vad_type)


        // if (vad_type === "end") {

        //     ws.send(JSON.stringify({
        //         messageType: "vadStop",
        //         timestamp:Date.now()
        //     }))
        // } 
        // else 
        if (vad_type === "start") {
            console.log("vad start detected")
            globals.conversationIndex++;
            globals.forwardSocket.ws.send(JSON.stringify({
                messageType: "clearQueue",
                conversationIndex: globals.conversationIndex
            }));
            // globals.isProcessingResponse = false;
            // ws.send(JSON.stringify({
            //     messageType: "vadStart",
            //     timestamp:Date.now()
            // }))
        }
    });


    ws.on('error', function (error) {
        console.log('Stream error: ', error);
    });
}
