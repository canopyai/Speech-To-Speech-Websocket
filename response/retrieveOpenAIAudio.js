import OpenAI from "openai";
import { openaiAPIKey } from "../config.js";
import { decoratePhonemes } from "../decorator/decoratePhonemes.js";

const openai = new OpenAI({
    apiKey: openaiAPIKey
});

export const retrieveOpenAIAudio = async ({
    TTSSentence, 
    process, 
    globals, 
    finishReason,
    ws, 

}) => {
    
    if(globals.currentProcessId !== process.parentProcessId) return;

    // TTSSentence = `Hello, can you hear me?`


    if (TTSSentence.trim()) {
        try {

            const initialTime = Date.now();
            const response = await openai.audio.speech.create({
                model: "tts-1",
                voice: globals.voice.voiceId || "onyx",
                input: TTSSentence, 
                speed: 1,
            });
            // console.log("OpenAI TTS response time:",process.id, Date.now() - initialTime);
           

            const audioContent = await response.arrayBuffer();
            const base64String = Buffer.from(audioContent, 'binary').toString('base64');
             decoratePhonemes({
                audioData: base64String,
                globals, 
                ws, 
                process, 
                sampleRate: 24000,
                finishReason
            });
            process.base64String = base64String;

            // console.log("bufferise",process.id, Date.now() - interimTime);
    

            
        } catch (err) {
            console.error("Error in OpenAI Text-to-Speech:", err);
            // throw err;
        }
    } else {

    }
};
