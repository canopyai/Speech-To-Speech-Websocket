import { generateRandomHex } from '../utils/generateHexCode.js';
import OpenAI from 'openai';
import { parsePart } from './parsePart.js';
import { shouldProcessContent } from './shouldProcessContent.js';
import { reformatTextForTTS } from './reformatTextForTTS.js';
import { openaiAPIKey } from '../config.js';
import { getAnimationData } from './getAnimationData.js';
import { getSemantics } from '../reactions/getSemantics.js';
import { generateEmotionVector } from '../emotions/generateEmotionVector.js';


const pIdLength = 13;

const openai = new OpenAI({
    apiKey: openaiAPIKey
});


export const generateResponse = async ({
    globals,
    processingQueue,
    createdAt,
    ws
}) => {

    const currentConversationIndex = globals.conversationIndex;
    console.log("globals.mainThread", globals.mainThread)

    const last3Messages = globals.mainThread.slice(-3);
    const startSem = Date.now();
    const semantics = await getSemantics(last3Messages);
    const endSem = Date.now();

    globals.frontendSocket.ws.send(JSON.stringify({
        messageType: "empathy",
        latency: endSem - startSem,
    }))

        


    globals.emotions.semantics = semantics;
    

    let { hexCode } = generateRandomHex(pIdLength);
    let processId = hexCode;

    if (globals.isProcessingResponse) return;

    globals.currentProcessId = processId;
    globals.isProcessingResponse = true;

    const sentence = { sentence: "", previousContent: "" }
    let isFirstChunk = true;


    const processingObject = {
        processId,
        timestamp: Date.now(),
    }

    globals.processingQueue.push(processingObject);


    globals.wordBuffer = []



    const initialTimePreFirstChunk = Date.now();

    const stream = await openai.chat.completions.create({
        // model: "gpt-4-turbo",
        model: globals.LLM ? globals.LLM : "gpt-3.5-turbo",
        messages: globals.mainThread,
        stream: true,
        temperature: 0,
        max_tokens: 150,

    });






    let previousSentence = null;


    for await (const part of stream) {
        try {

            let finishReason = part.choices[0].finish_reason
            const text = part.choices[0].delta.content


            if (globals.currentProcessId !== processId) {
                stream.controller.abort()

                break;
            }

            parsePart({
                part,
                sentence
            });


            if (shouldProcessContent({ sentence, part }) || finishReason === "stop") {

                
                if(isFirstChunk){
                    const timePreFirstChunk = Date.now() - initialTimePreFirstChunk;
                    globals.frontendSocket.ws.send(JSON.stringify({
                        messageType: "LLMLatency",
                        latency:timePreFirstChunk
                    }));

                }
          

                if (finishReason === "stop") {

                }

                const processingObject = {
                    id: Math.random().toString().substring(7),
                    timestamp: Date.now(),
                    sentence,
                    createdAt,
                    dialogue: sentence.sentence,
                    parentProcessId: processId,
                    isFirstChunk,
                    finishReason,

                };



                

                processingQueue.push(processingObject);
                let TTSSentence = reformatTextForTTS({ sentence });
                sentence.sentence = "";

                getAnimationData({
                    TTSSentence,
                    processingObject,
                    sentence,
                    globals,
                    finishReason,
                    ws, 
                    currentConversationIndex, 
                    isFirstChunk
                })
                isFirstChunk = false;
                previousSentence += TTSSentence;

            }

        } catch (error) {
            console.log("there is error", error);
        }

    }




}