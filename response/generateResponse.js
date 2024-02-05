import { generateRandomHex } from '../utils/generateHexCode.js';
import { modifyThread } from './modifyThread.js';
import OpenAI from 'openai';
import { parsePart } from './parsePart.js';
import { shouldProcessContent } from './shouldProcessContent.js';
import { retrieveElevenLabsAudio } from './retrieveElevenLabsAudio.js';
import { reformatTextForTTS } from './reformatTextForTTS.js';
import { retrieveOpenAIAudio } from './retrieveOpenAIAudio.js';
import { elevenlabsApiKey } from "../config.js"
import { initialiseElevenLabsConnection } from "./initialiseElevenLabsConnection.js"
import { retrieveGCPTTSAudio } from "./retrieveGCPAudio.js"
import { Readable } from 'node:stream';
import PlayHT from "playht";


PlayHT.init({
    apiKey: 'f4655478df684e76ae96facd8dc8df22',
    userId: 'fTCoF67G60giwPCkLYSFk2pKACi2',
});

const pIdLength = 13;

import { openaiAPIKey } from '../config.js';
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

    if (globals.visual && globals.voice.provider === "eleven_labs") {
        initialiseElevenLabsConnection({
            globals, 
            processId, 
            createdAt
        })
    }


    if (globals.isProcessingResponse) return;





    

    globals.currentProcessId = processId;
    globals.isProcessingResponse = true;

    const sentence = { sentence: "", previousContent: "" }


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

    for await (const part of stream) {
        try {


            if (globals.visual && globals.voice.provider === "eleven_labs") {
                const text = part.choices[0].delta.content
                const finishReason = part.choices[0].finish_reason


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


            if (shouldProcessContent({ sentence, part })) {




                const processingObject = {
                    id: Math.random().toString().substring(7),
                    timestamp: Date.now(),
                    sentence,
                    createdAt,
                    dialogue: sentence.sentence,
                    parentProcessId: processId,

                };



                processingQueue.push(processingObject);


                let TTSSentence = reformatTextForTTS({ sentence });
                sentence.sentence = "";



                switch (globals.voice.provider) {
                    case "eleven_labs":
                        retrieveElevenLabsAudio({
                            TTSSentence: TTSSentence,
                            process: processingObject,
                            sentence,
                            globals,
                            ws

                        })

                        break;

                    case "openai":
                        retrieveOpenAIAudio({
                            TTSSentence: TTSSentence,
                            process: processingObject,
                            sentence,
                            globals,
                            ws
                        })
                        break;

                    case "google":
                        retrieveGCPTTSAudio({
                            TTSSentence: TTSSentence,
                            process: processingObject,
                            sentence,
                            globals,
                            ws
                        })

                        break;


                }

                


            }

        } catch (error) {
            console.log("there is error", error);
        }

    }




}