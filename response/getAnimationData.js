import { generateRandomHex } from "../utils/generateHexCode.js";

export const getAnimationData = async ({
    TTSSentence,
    globals,
    currentConversationIndex, 
    isFirstChunk
}) => {
    try {
        const remoteUrl = "http://34.32.228.101:8080/generate_animation";
        const url = new URL(remoteUrl);

        const modifiedTTSSentence = TTSSentence.replace(/[^\w\s]/g, '');
        url.searchParams.append('text', modifiedTTSSentence);


        // console.log("modifiedTTSSentence", modifiedTTSSentence)


        if (TTSSentence.length === 0) {
            console.log("No text to process");
            return;
        }
        const startTime = Date.now()
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.text(); // or response.json() if your server responds with JSON

            const { b64string: audioData, visemes, segments_latency:segmentsLatency, tts_latency:TTSLatency } = JSON.parse(data);
            const { hexCode } = generateRandomHex({ length: 13 });

            if(isFirstChunk){
                globals.frontendSocket.ws.send(JSON.stringify({
                    messageType: "animationLatency",
                    segmentsLatency,
                    TTSLatency,
    
                }));
            }
            



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