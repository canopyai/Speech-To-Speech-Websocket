import { generateRandomHex } from "../utils/generateHexCode.js";

export const getAnimationData = async ({
    TTSSentence,
    globals,
    currentConversationIndex, 
    isFirstChunk, 
    processingObject
}) => {
    try {

        console.log("Sending sentence", TTSSentence)
        const remoteUrl = "http://34.32.228.101:8080/generate_animation";

        if (TTSSentence.length === 0) {
            return;
        }

        const startTime = Date.now();

        if(globals.conversationIndex>currentConversationIndex) return
        try {
            const response = await fetch(remoteUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: TTSSentence, isFirstChunk: isFirstChunk?true:false})
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Assuming the server responds with JSON

            const { b64string: audioData, visemes, segments_latency: segmentsLatency, tts_latency: TTSLatency } = data;

        
            const { hexCode } = generateRandomHex({ length: 13 });

            if(globals.conversationIndex>currentConversationIndex) return

            if(isFirstChunk){
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
