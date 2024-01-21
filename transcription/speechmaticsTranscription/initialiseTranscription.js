import { speechmaticsAPIKey } from '../../config.js';

import speechmatics from 'speechmatics';
const { RealtimeSession } = speechmatics;

import { handlePartial } from './handlePartial.js';
import { detectResponse } from '../../response/detectResponse.js';

export const initialiseSpeechmaticsTranscription = async ({
    session,
    ws,
    processingQueue,
    globals
}) => {




    session = new RealtimeSession({ apiKey: speechmaticsAPIKey });

    session.addListener('Error', (error) => {
        console.log('session error', error);
    });

    session.addListener('AddPartialTranscript', (message) => {

        handlePartial({
            message,
            globals
        });

        detectResponse({
            globals,
            processingQueue
        });

    });

    session.addListener('EndOfTranscript', () => {
        process.stdout.write('\n');
    });


    session.addListener('RecognitionStarted', () => {
        console.log('Recognition Started');
        globals.startTime = Date.now();
    });


    await session.start({
        transcription_config: {
            language: 'en',
            operating_point: 'standard',
            enable_partials: true,
            max_delay: 2,

        },
        audio_format: { type: 'raw', encoding: 'pcm_s16le', sample_rate: 16000 }
    })
    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
    
        if (parsedMessage.messageType === "audio") {
            const buffer = Buffer.from(parsedMessage.data, 'base64');
            session.sendAudio(buffer);
        }
    });
    
    

    ws.on('close', () => {
        console.log('Client disconnected');
        session.stop();
    });


}