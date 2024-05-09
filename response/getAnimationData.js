import { generateRandomHex } from "../utils/generateHexCode.js";
import fs from 'fs';
export const getAnimationData = async ({
    TTSSentence,
    globals,
    currentConversationIndex,
    isFirstChunk,
    processingObject,
}) => {
    try {
        const remoteUrl = "http://34.91.82.222:8080/generate_animation";

        if (TTSSentence.length === 0) {
            return;
        }

        const startTime = Date.now();

        if (globals.conversationIndex > currentConversationIndex) return
        try {
            const response = await fetch(remoteUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: TTSSentence,
                    isFirstChunk: isFirstChunk ? true : false,
                    add_post_padding: false
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Assuming the server responds with JSON

            const {
                b64string: audioData,
                visemes, 
                segments_latency: segmentsLatency, 
                tts_latency: TTSLatency, 
            } = data;


            const { hexCode } = generateRandomHex({ length: 13 });

            if (globals.conversationIndex > currentConversationIndex) return

            if (isFirstChunk) {
                globals.frontendSocket.ws.send(JSON.stringify({
                    messageType: "animationLatency",
                    segmentsLatency,
                    TTSLatency,
                    // audioData,
                    conversationIndex: currentConversationIndex,
                }));
            }

            processingObject.forwardData = {
                messageType: "animationData",
                audioData,
                visemes,
                conversationIndex: currentConversationIndex,
                uuid: hexCode,
                TTSSentence, 
                isFirstChunk
            }



            const animationSentData = {
                conversationIndex: currentConversationIndex,
                visemesLength: visemes.length,
                text: TTSSentence,
                uuid: hexCode,
            }



            globals.animationsSent.push(animationSentData);

        } catch (error) {
            console.error("An error occurred:", error);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
};
