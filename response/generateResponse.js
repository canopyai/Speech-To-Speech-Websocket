const { generateRandomHex } = require('../utils/generateHexCode');
const { modifyThread } = require('./modifyThread');
const OpenAI = require('openai');
const { parsePart } = require('./parsePart');
const { shouldProcessContent } = require('./shouldProcessContent');
const { retrieveElevenLabsAudio } = require('./retrieveElevenLabsAudio');
const { reformatTextForTTS } = require('./reformatTextForTTS');
const { retrieveOpenAIAudio } = require('./retrieveOpenAIAudio');

const pIdLength = 13;

const { openaiAPIKey } = require('../config');
const openai = new OpenAI({
    apiKey: openaiAPIKey
});


exports.generateResponse = async ({
    globals, 
    processingQueue, 
    createdAt
}) => {
    let processId = generateRandomHex(pIdLength);
    
    globals.currentProcessId = processId;
    globals.isProcessingResponse = true;

    const sentence = { sentence: "", previousContent: "" }
    

    const processingObject = {
        processId,
        timestamp: Date.now(),
    }

    globals.processingQueue.push(processingObject);

    modifyThread({
        globals,
    });




    const stream = await openai.chat.completions.create({
        model: "gpt-4",
        messages: globals.mainThread,
        stream: true,
        temperature: 0,

    });

    for await (const part of stream) {
        try {

            if (globals.currentProcessId !== processId) {
                stream.controller.abort()
     
                break;
            }

            parsePart({
                part,
                sentence
            });

            if (shouldProcessContent({ sentence, part })) {

                const processingObject = { 
                    id: Math.random().toString().substring(7), 
                    timestamp: Date.now(), 
                    sentence, 
                    createdAt, 
                    dialogue: sentence.sentence
                    
                 };

                processingQueue.push(processingObject);
         

                let TTSSentence = reformatTextForTTS({ sentence });
                sentence.sentence = "";
                retrieveOpenAIAudio({
                    TTSSentence: TTSSentence,
                    process: processingObject,
                    sentence
                })
            }

        } catch (error) {
            console.log(error);
        }

    }




}