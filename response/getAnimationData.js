import { generateRandomHex } from "../utils/generateHexCode.js";
export const getAnimationData = async ({
    TTSSentence,
    globals,
    currentConversationIndex,
    isFirstChunk,
    processingObject,
    semanticsList
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
                    isFirstChunk:
                        isFirstChunk ? true : false,
                    emotion_vector: semanticsList,
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
                emotion_sequences: emotionSequences 
            } = data;


            const { hexCode } = generateRandomHex({ length: 13 });
            const {hexCode:secondaryHexCode} = generateRandomHex({length: 13});

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
                animationType: "facial"
            }

            processingObject.forwardData = {
                messageType: "animationData",
                visemes:emotionSequences,
                conversationIndex: currentConversationIndex,
                uuid: secondaryHexCode,
                TTSSentence, 
                animationType: "emotions"
            }



            const animationSentData = {
                conversationIndex: currentConversationIndex,
                visemesLength: visemes.length,
                text: TTSSentence,
                uuid: hexCode,
            }

            const secondaryAnimationSentData = {
                conversationIndex: currentConversationIndex,
                visemesLength: emotionSequences.length,
                text: TTSSentence,
                uuid: secondaryHexCode,
            }




            globals.animationsSent.push(animationSentData);
            globals.animationsSent.push(secondaryAnimationSentData);

        } catch (error) {
            console.error("An error occurred:", error);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
};
