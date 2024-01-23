import { generateRandomHex } from '../utils/generateHexCode.js';
import { modifyThread } from './modifyThread.js';
import OpenAI from 'openai';
import { parsePart } from './parsePart.js';
import { shouldProcessContent } from './shouldProcessContent.js';
import { retrieveElevenLabsAudio } from './retrieveElevenLabsAudio.js';
import { reformatTextForTTS } from './reformatTextForTTS.js';
import { retrieveOpenAIAudio } from './retrieveOpenAIAudio.js';
import { decorateGraphemes } from '../decorator/decorateGraphemes.js';

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

    // if (globals.isProcessingResponse) return;


    console.log("generateResponse")

    let { hexCode } = generateRandomHex(pIdLength);

    let processId = hexCode;

    globals.currentProcessId = processId;
    globals.isProcessingResponse = true;

    const sentence = { sentence: "", previousContent: "" }


    const processingObject = {
        processId,
        timestamp: Date.now(),
    }

    globals.processingQueue.push(processingObject);





    globals.wordBuffer = []

    console.log(globals.mainThread)



    const stream = await openai.chat.completions.create({
        // model: "gpt-3.5-turbo",
        model: "gpt-4",
        messages: globals.mainThread,
        stream: true,
        temperature: 0,
        max_tokens: 150,

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
                    dialogue: sentence.sentence,
                    parentProcessId: processId,

                };

                processingQueue.push(processingObject);


                let TTSSentence = reformatTextForTTS({ sentence });
                sentence.sentence = "";

                decorateGraphemes({
                    text:TTSSentence,
                    process: processingObject,
                    globals
                })

                retrieveOpenAIAudio({
                    TTSSentence: TTSSentence,
                    process: processingObject,
                    sentence,
                    globals,
                    ws
                })

                // retrieveElevenLabsAudio({
                //     TTSSentence: TTSSentence,
                //     process: processingObject,
                //     sentence,
                //     globals,
                //     ws

                // })
            }

        } catch (error) {
            console.log(error);
        }

    }




}