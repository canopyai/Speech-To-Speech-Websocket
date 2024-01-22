import vad from "@sentiment_technologies/vad-node";
import { int16ToFloat32 } from './processFrame.js';

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


    let frame = [];

    const myvad = await vad.RealTimeVAD.new(sampleRate, {
        onFrameProcessed: (probabilities) => {
            let time_delta = Date.now() - globals.startTime;
            if (probabilities.isSpeech > VAD_THRESHOLD && isSpeech === false) {
                isSpeech = true;
                globals.lastVADSpeechStarted = Date.now();

                globals.isProcessingResponse = false;
                processingQueue = [];
                ws.send(JSON.stringify({
                    messageType: 'vadStart',
                    timestamp: Date.now()
                }));

            } else if (probabilities.isSpeech < VAD_THRESHOLD && isSpeech === true) {
                isSpeech = false;
                globals.lastVADSpeechEnded = Date.now();
                ws.send(JSON.stringify({
                    messageType: 'vadStop',
                    timestamp: Date.now()
                }));

            }
        },
        onVADMisfire: () => {
            console.log("VAD misfire");
        },
    });

    ws.on('message', async function (message) {
        const { messageType, data } = JSON.parse(message);

        if (messageType !== "vadAudio") return;

        const buffer = Buffer.from(data, 'base64');

        const uint8Array = new Uint8Array(buffer);

        frame.push(...Array.from(uint8Array));
        while (frame.length >= frameSize) {
            const newBuffer = int16ToFloat32(new Uint8Array(frame.slice(0, frameSize)));

            await myvad.processAudio(newBuffer);
            frame = frame.slice(frameSize);
        }
    });


    ws.on('error', function (error) {
        console.log('Stream error: ', error);
    });
}
