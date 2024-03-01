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
        model: globals.LLM,
        messages: globals.mainThread,
        stream: true,
        temperature: 0,
        max_tokens: 150,

    });

    // let previousSentence = null;
    // const textStream = new Readable({
    //     async read() {
    //       for await (const part of stream) {
    //         this.push(part.choices[0]?.delta?.content || '');
    //       }
    //       // End the stream
    //       this.push(null);
    //     },
    //   });

    // const audioStream = await PlayHT.stream(textStream);

    // console.log(audioStream);

    // return;
    for await (const part of stream) {


     


        try {

            let finishReason = part.choices[0].finish_reason
            const text = part.choices[0].delta.content

            if (globals.visual && globals.voice.provider === "eleven_labs") {
                
                if (text) {
                    globals.elevenLabsWs.send(
                        JSON.stringify({
                            text: part.choices[0].delta.content,
                            xi_api_key: elevenlabsApiKey,
                            "optimize_streaming_latency": 4,
                            try_trigger_generation: true

                        }))

                }

                if (finishReason === "stop") {
                    globals.elevenLabsWs.send(
                        JSON.stringify({
                            text: "",
                            xi_api_key: elevenlabsApiKey,
                            "optimize_streaming_latency": 4,
                            // flush:true
                        }))
                }



                continue
            }

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

                retrieveAudio({
                    TTSSentence,
                    processingObject,
                    sentence,
                    globals,
                    finishReason,
                    ws
                })

                semantifySentence({
                    TTSSentence,
                    processingObject,
                    sentence,
                    globals,
                    finishReason,
                    ws
                })

                labelSentiment({
                    TTSSentence,
                    processingObject,
                    sentence,
                    globals,
                    finishReason,
                    ws,
                    previousSentence
                })

                previousSentence += TTSSentence;

            }

        } catch (error) {
            console.log("there is error", error);
        }

    }




}