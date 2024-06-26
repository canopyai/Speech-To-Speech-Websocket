function scaleDominantEmotion(emotionMap) {
    let maxEmotion = null;
    let maxValue = 0;
    for (const [emotion, value] of Object.entries(emotionMap)) {
        if (emotion !== 'neutral' && value > maxValue) {
            maxEmotion = emotion;
            maxValue = value;
        }
    }

    if (maxEmotion === null) {
        return null;  // No non-neutral emotions found
    }


    const minSignificantValue = 0.01;
    const scaledValue = 0.3 + (0.7 * (maxValue - minSignificantValue) / (1 - minSignificantValue));

    return {
        emotion: maxEmotion,
        scaledValue: Math.min(Math.max(scaledValue, 0.3), 1) // Ensure the value is clamped between 0.3 and 1
    };
}


function getEmotionList(dominantEmotion) {


    const startingVector = [0, 0, 0, 0, 0, 0, 0, 0];

    const indices = {
        angry: 0,
        concern: 1,
        disgust: 2,
        excitement: 3,
        fear:4,
        happy: 6,
        neutral: 5,
        sad: 7
    };
    const magnitudes =[1,1,1,1,1,0.3,1,1]

    const dominantEmotionLabel = dominantEmotion.emotion;
    const dominantEmotionValue = dominantEmotion.scaledValue;
    const dominantEmotionIndex = indices[dominantEmotionLabel];

    const emotionList = startingVector.map((_, index) => {
        return index === dominantEmotionIndex ? dominantEmotionValue * magnitudes[index] : 0;
    }  );

    return emotionList;
}


export async function getSemantics({ last3Messages, globals }) {
    const url = "http://34.91.168.188:8080/classify"; // Replace with the appropriate URL
    const startSem = Date.now();

    const lastMessages = cleanAndCloneContent(last3Messages)

    if(!globals.lastGlobalEmotionTimestamp){
        globals.lastGlobalEmotionTimestamp = Date.now() - 2001
    }

    if(Date.now()-globals.lastGlobalEmotionTimestamp < 2000) return


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: lastMessages })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.text();
        data = JSON.parse(data);


        globals.frontendSocket.ws.send(JSON.stringify({
            messageType: "empathy",
            latency: Date.now() - startSem,
        }))




        if (!globals.emotions.semantics) {
            globals.emotions.semantics = data.emotion_prob_map;
            const scaled = scaleDominantEmotion(data.emotion_prob_map);
            let emotionList = getEmotionList(scaled);
            globals.dominantEmotion = scaled;

            const emotionAnimationData = {
                messageType: "emotions",
                visemes: [{
                    targets: emotionList,
                    duration: 300
                }],
            };


        globals.forwardSocket.ws.send(JSON.stringify(emotionAnimationData));
            


        }

        if (scaleDominantEmotion(data.emotion_prob_map).emotion !== scaleDominantEmotion(globals.emotions.semantics).emotion) {
            globals.emotions.semantics = data.emotion_prob_map;
            const scaled = scaleDominantEmotion(data.emotion_prob_map);
            globals.dominantEmotion = scaled;
            let emotionList = getEmotionList(scaled);
            const emotionAnimationData = {
                messageType: "emotions",
                visemes: [{
                    targets: emotionList,
                    duration: 200
                }],
            };


                console.log("sending emotion animation data")
                 globals.forwardSocket.ws.send(JSON.stringify(emotionAnimationData));
            

        }

        const scaled = scaleDominantEmotion(data.emotion_prob_map);
    






        return data
    } catch (error) {
        console.error(`Error posting messages: ${error}`);
    }
}






function cleanAndCloneContent(messages) {
    return messages.map(message => ({
        ...message,
        content: message.content.replace(/<.*?>/g, '')
    }));
}