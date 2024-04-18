import { modifyTranscript } from '../../transcript/modifyTranscript.js';
import { generateResponse } from '../../response/generateResponse.js';
import { listeningReactions } from "../../reactions/listeningReactions.js";

import websocket from 'ws';


export const initialiseShallowgramTranscription = async ({
    ws,
    processingQueue,
    globals
}) => {
    // return


    ws.on("message", function (message) {

        const { messageType, data } = JSON.parse(message);
        if (messageType !== "transcription") return;

        const { transcription, emotion_data } = data;

        globals.emotions.audioIntonation = emotion_data;


        const { success, error } = modifyTranscript({
            globals,
            role: "user",
            content: transcription,

        });
        // return
        // ws.send(JSON.stringify({
        //     messageType: "transcript",
        //     content: transcription,
        //     timestamp: Date.now()

        // }))
        generateResponse({
            globals,
            processingQueue,
            createdAt: Date.now(),
            ws
        });
    })






}

