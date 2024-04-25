import { generateRandomHex } from '../utils/generateHexCode.js';
import { parsePart } from './parsePart.js';
import { shouldProcessContent } from './shouldProcessContent.js';
import { reformatTextForTTS } from './reformatTextForTTS.js';
import { groqKey } from '../config.js';
import { getAnimationData } from './getAnimationData.js';
import { getSemantics } from '../reactions/getSemantics.js';
import { generateEmotionVector } from '../emotions/generateEmotionVector.js';
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



    const currentConversationIndex = globals.conversationIndex;
    console.log("Beginning to generate response with conversation index", currentConversationIndex)

    const last3Messages = globals.mainThread.slice(-3);
    const startSem = Date.now();
    const semantics = await getSemantics(last3Messages);
    const endSem = Date.now();

    console.log("Successfully got semantics", currentConversationIndex)


    globals.frontendSocket.ws.send(JSON.stringify({
        messageType: "empathy",
        latency: endSem - startSem,
    }))


    console.log("sending empathy for conversation index", currentConversationIndex)


    globals.emotions.semantics = semantics;

    console.log("setting semantics for conversation index", currentConversationIndex)


    let { hexCode } = generateRandomHex(pIdLength);
    let processId = hexCode;


    globals.currentProcessId = processId;


    const sentence = { sentence: "", previousContent: "" }
    let isFirstChunk = true;


    const processingObject = {
        processId,
        timestamp: Date.now(),
    }

    globals.processingQueue.push(processingObject);


    globals.wordBuffer = []



    const initialTimePreFirstChunk = Date.now();
    let isFirstElement = true;
    let isSecondElement = true;
    let isThirdElement = true;

    console.log("starting stream for conversation index", currentConversationIndex)
    console.log("main thread", globals.mainThread)
    let stream;
    try {


        stream = await groq.chat.completions.create({
            // model: "gpt-4-turbo",
            model: globals.LLM ? globals.LLM : "llama3-8b-8192",
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


            if (isFirstElement) {
                isFirstElement = false;
                // console.log("First element hit", Date.now() - initialTimePreFirstChunk)
                // console.log(part.choices[0].delta.content)
            } else if (isSecondElement) {
                isSecondElement = false;
                // console.log("Second element hit", Date.now() - initialTimePreFirstChunk)
                // console.log(part.choices[0].delta.content)

            } else if (isThirdElement) {
                isThirdElement = false;
                // console.log("Third element hit", Date.now() - initialTimePreFirstChunk)
                // console.log(part.choices[0].delta.content)

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

                console.log("decided to parse content for conversation index", currentConversationIndex)


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