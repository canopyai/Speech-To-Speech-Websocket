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

        const { vad_type } = data

        if (vad_type === "end") {
            ws.send(JSON.stringify({
                messageType: "vadStop",
                timestamp:Date.now()
            }))
        } else if (vad_type === "start") {
            globals.isProcessingResponse = false;
            ws.send(JSON.stringify({
                messageType: "vadStart",
                timestamp:Date.now()
            }))
        }
    });


    ws.on('error', function (error) {
        console.log('Stream error: ', error);
    });
}
