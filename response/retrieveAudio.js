import { retrieveOpenAIAudio } from './retrieveOpenAIAudio.js';
import { retrieveElevenLabsAudio } from './retrieveElevenLabsAudio.js';
import { retrieveGCPTTSAudio } from "./retrieveGCPAudio.js"

export function retrieveAudio ({
    TTSSentence,
    processingObject,
    sentence,
    globals,
    finishReason,
    ws
}) {

    switch (globals.voice.provider || "eleven_labs") {
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
                finishReason,
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