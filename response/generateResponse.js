import { generateRandomHex } from '../utils/generateHexCode.js';
import { parsePart } from './parsePart.js';
import { shouldProcessContent } from './shouldProcessContent.js';
import { reformatTextForTTS } from './reformatTextForTTS.js';
import { groqKey } from '../config.js';
import { getAnimationData } from './getAnimationData.js';
import { getSemantics } from '../reactions/getSemantics.js';
import { generateEmotionVector } from '../emotions/generateEmotionVector.js';
import {getAudioIntonationString } from '../reactions/getAudioIntonationString.js';
import Groq from "groq-sdk"


const pIdLength = 13;

const groq = new Groq({
    apiKey: groqKey
});


export const generateResponse = async ({
    globals,
    processingQueue,
    createdAt,
    ws
}) => {


    console.log(globals.mainThread)


    const currentConversationIndex = globals.conversationIndex;

    const last3Messages = globals.mainThread.slice(-3);
    const startSem = Date.now();
    const semantics = await getSemantics(last3Messages);
    const endSem = Date.now();


    globals.frontendSocket.ws.send(JSON.stringify({
        messageType: "empathy",
        latency: endSem - startSem,
    }))


    globals.emotions.semantics = semantics;


    const audioIntonationString = getAudioIntonationString(globals.emotions.audioIntonation);

    console.log("audio intonation string", audioIntonationString)




    let { hexCode } = generateRandomHex(pIdLength);
    let processId = hexCode;


    globals.currentProcessId = processId;


    const sentence = { sentence: "", previousContent: "" }
    let isFirstChunk = true;


    globals.wordBuffer = []



    const initialTimePreFirstChunk = Date.now();

    let stream;
    try {




        stream = await groq.chat.completions.create({
            // model: "gpt-4-turbo",
            model: globals.LLM ? globals.LLM : "llama3-70b-8192",
            messages: globals.mainThread,
            stream: true,
            temperature: 0,
            max_tokens: 150,

        });
    } catch (error) {
        console.log("error in stream", error)
    }





    let previousSentence = null;


    for await (const part of stream) {
        try {


            if(globals.conversationIndex>currentConversationIndex){
                stream.controller.abort();
                break;
            }


           



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

                if (isFirstChunk) {
                    const timePreFirstChunk = Date.now() - initialTimePreFirstChunk;
                    globals.frontendSocket.ws.send(JSON.stringify({
                        messageType: "LLMLatency",
                        latency: timePreFirstChunk
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