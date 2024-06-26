import textToSpeech from '@google-cloud/text-to-speech';
import { decoratePhonemes } from '../decorator/decoratePhonemes.js';


// Creates a client
const client = new textToSpeech.TextToSpeechClient();

export const retrieveGCPTTSAudio = async ({
    voice,
    TTSSentence,
    process,
    globals,
    ws,
}) => {

    if (globals.currentProcessId !== process.parentProcessId) return;

    if (TTSSentence.trim()) {
        try {
            
            const initialTime = Date.now();

            // Construct the request for GCP Text-to-Speech
            console.log(TTSSentence)
            const request = {
                input: { ssml: TTSSentence },
                voice: { 
                    languageCode:globals.voice.voiceId.slice(0,5),
                    name:"en-GB-News-M", 
                    ssmlGender:"MALE"
             },
                audioConfig: { 
                    audioEncoding: 'MP3', 
                    speakingRate:0.9
                 },
            };

            // Performs the text-to-speech request
            const [response] = await client.synthesizeSpeech(request);
            const finalTime = Date.now();
            const timeTaken = finalTime - initialTime;

            const audioContent = response.audioContent;
            const base64String = Buffer.from(audioContent).toString('base64');

            // Use your decoratePhonemes function or similar logic here
            if(globals.visual){
            decoratePhonemes({
                    audioData: base64String,
                    globals,
                    ws,
                    process
                });
            }
   

            process.base64String = base64String;
            console.log('GCP TTS response time:', process.id, timeTaken);

        } catch (err) {
            console.error('Error in GCP Text-to-Speech:', err);
            // Handle the error
        }
    }
};

