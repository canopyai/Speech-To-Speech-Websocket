import { generateRandomHex } from "../utils/generateHexCode.js";

export const getAnimationData = async ({
    TTSSentence,
    globals,
    currentConversationIndex
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

            const { b64string: audioData, visemes } = JSON.parse(data);
            const { hexCode } = generateRandomHex({ length: 13 });


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

            console.log("adding data to animations sent")
            globals.animationsSent.push(animationSentData);

            console.log("animationsSe push nt", globals.animationsSent)

            globals.isProcessingResponse = false;
        } catch (error) {
            console.error("An error occurred:", error);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
};