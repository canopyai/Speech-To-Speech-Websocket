const OpenAI = require("openai");
const { openaiAPIKey } = require("../config");
const { decoratePhonemes } = require("../decorator/decoratePhonemes");

const openai = new OpenAI({
    apiKey: openaiAPIKey
});

exports.retrieveOpenAIAudio = async ({
    voice,
    TTSSentence, 
    process, 
    globals, 
    ws, 

}) => {
    
    if(globals.currentProcessId !== process.parentProcessId) return;


    if (TTSSentence.trim()) {
        try {
            const response = await openai.audio.speech.create({
                model: "tts-1",
                voice: voice || "alloy",
                input: TTSSentence
            });

            const audioContent = await response.arrayBuffer();
            const base64String = Buffer.from(audioContent, 'binary').toString('base64');
            decoratePhonemes({
                audioData: base64String,
                globals, 
                ws, 
                process
            });
            process.base64String = base64String;

            console.log("tts engine response",process.id, Date.now())
    

            
        } catch (err) {
            console.error("Error in OpenAI Text-to-Speech:", err);
            // throw err;
        }
    } else {

    }
};
