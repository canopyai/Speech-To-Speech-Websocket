import { generateRandomHex } from '../utils/generateHexCode.js';
import { modifyThread } from './modifyThread.js';
import OpenAI from 'openai';
import { parsePart } from './parsePart.js';
import { shouldProcessContent } from './shouldProcessContent.js';
import { reformatTextForTTS } from './reformatTextForTTS.js';

import { elevenlabsApiKey } from "../config.js"
import { initialiseElevenLabsConnection } from "./initialiseElevenLabsConnection.js"
import PlayHT from "playht";
import { openaiAPIKey, playHTApiKey, playHTUserId } from '../config.js';
import { retrieveAudio } from './retrieveAudio.js';
import { semantifySentence } from './semantifySentence.js';
import { labelSentiment } from './labelSentiment.js';
import { Readable } from 'node:stream';
import { createWriteStream } from 'node:fs';
import { getAnimationData } from './getAnimationData.js';

PlayHT.init({
    apiKey: playHTApiKey,
    userId: playHTUserId
});

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

    console.log("generating response", globals.mainThread)
    let { hexCode } = generateRandomHex(pIdLength);
    let processId = hexCode;



    console.log(globals.isProcessingResponse)
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

        console.log("part", part.choices[0].finish_reason, part.choices[0].delta.content)





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



                isFirstChunk = false;

                processingQueue.push(processingObject);
                let TTSSentence = reformatTextForTTS({ sentence });
                sentence.sentence = "";

                getAnimationData({
                    TTSSentence,
                    processingObject,
                    sentence,
                    globals,
                    finishReason,
                    ws
                })

                // retrieveAudio({
                //     TTSSentence,
                //     processingObject,
                //     sentence,
                //     globals,
                //     finishReason,
                //     ws
                // })





                previousSentence += TTSSentence;

            }

        } catch (error) {
            console.log("there is error", error);
        }

    }




}