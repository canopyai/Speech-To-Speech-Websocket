const OpenAI = require("openai");
const { openaiAPIKey } = require("../config");

const openai = new OpenAI({
    apiKey: openaiAPIKey
});

exports.retrieveOpenAIAudio = async ({
    voice,
    TTSSentence, 
    process
}) => {
    if (TTSSentence.trim()) {
        try {
            const response = await openai.audio.speech.create({
                model: "tts-1",
                voice: voice || "alloy",
                input: TTSSentence
            });

            const audioContent = await response.arrayBuffer();
            const base64String = Buffer.from(audioContent, 'binary').toString('base64');
            process.base64String = base64String;
            console.log("Received response from OpenAI");

            
        } catch (err) {
            console.error("Error in OpenAI Text-to-Speech:", err);
            throw err;
        }
    } else {

    }
};
