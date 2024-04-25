import { generateRandomHex } from "../utils/generateHexCode.js";

export const getAnimationData = async ({
    TTSSentence,
    globals,
    currentConversationIndex, 
    isFirstChunk
}) => {
    try {
        const remoteUrl = "http://34.32.228.101:8080/generate_animation";

        console.log("Original TTSSentence", TTSSentence);

        if (TTSSentence.length === 0) {
            console.log("No text to process");
            return;
        }

        const startTime = Date.now();
        try {
            const response = await fetch(remoteUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: TTSSentence })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Assuming the server responds with JSON

            const { b64string: audioData, visemes, segments_latency: segmentsLatency, tts_latency: TTSLatency } = data;
            const { hexCode } = generateRandomHex({ length: 13 });

            if(isFirstChunk){
                globals.frontendSocket.ws.send(JSON.stringify({
                    messageType: "animationLatency",
                    segmentsLatency,
                    TTSLatency,
                    audioData,
                    conversationIndex: currentConversationIndex,
                }));
            }

            globals.frontendSocket.ws.send(JSON.stringify({
                audioData, 
                messageType: "audioData"
            }));

            globals.forwardSocket.ws.send(JSON.stringify({
                messageType: "animationData",
                audioData,
                visemes,
                conversationIndex: currentConversationIndex,
                uuid: hexCode,
            }));

            const animationSentData = {
                conversationIndex: currentConversationIndex,
                visemesLength: visemes.length,
                text: TTSSentence,
                uuid: hexCode,
            }

            globals.animationsSent.push(animationSentData);

            globals.isProcessingResponse = false;
        } catch (error) {
            console.error("An error occurred:", error);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
};
