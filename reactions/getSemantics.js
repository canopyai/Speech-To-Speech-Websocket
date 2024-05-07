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

    // Calculate scale factor based on the minimum significant emotion value and 1
    // Assuming the lowest significant value starts from 0.01
    const minSignificantValue = 0.01;
    const scaledValue = 0.3 + (0.7 * (maxValue - minSignificantValue) / (1 - minSignificantValue));

    return {
        emotion: maxEmotion,
        scaledValue: Math.min(Math.max(scaledValue, 0.3), 1) // Ensure the value is clamped between 0.3 and 1
    };
}


function getEmotionList({
    dominantEmotion
}) {
    const startingVector = [0, 0, 0, 0, 0, 0, 0, 0];

    const indices = {
        neutral: 5,
        anger: 1,
        contempt: 2,
        disgust: 3,
        fear: 4,
        happiness: 0,
        sadness: 6,
        surprise: 7
    };

    const dominantEmotionLabel = dominantEmotion.emotion;
    const dominantEmotionValue = dominantEmotion.scaledValue;
    const dominantEmotionIndex = indices[dominantEmotionLabel];

    const emotionList = startingVector.map((_, index) => {
        return index === dominantEmotionIndex ? dominantEmotionValue : 0;
    }
}

function checkEmotionChange(prevEmotion, currEmotion) {
    if (!prevEmotion || !currEmotion) return { change: false };
    const dominantEmotion = (emotionObj) => {
        let maxEmotion = 'neutral';
        let maxValue = emotionObj.neutral;
        for (const [key, value] of Object.entries(emotionObj)) {
            if (value > maxValue) {
                maxEmotion = key;
                maxValue = value;
            }
        }
        return { emotion: maxEmotion, value: maxValue };
    };

    const prevDominant = dominantEmotion(prevEmotion);
    const currDominant = dominantEmotion(currEmotion);

    // If dominant emotions are not neutral and different
    if (prevDominant.emotion !== 'neutral' && currDominant.emotion !== 'neutral' && prevDominant.emotion !== currDominant.emotion) {
        return { change: true, newMap: currEmotion };
    }

    // If previous dominant emotion was neutral and second highest is above 0.1 and different from current dominant
    if (prevDominant.emotion === 'neutral') {
        let secondHighestValue = 0;
        let secondHighestEmotion = 'neutral';
        for (const [key, value] of Object.entries(prevEmotion)) {
            if (value > secondHighestValue && key !== prevDominant.emotion) {
                secondHighestValue = value;
                secondHighestEmotion = key;
            }
        }
        if (secondHighestValue > 0.1 && secondHighestEmotion !== currDominant.emotion) {
            return { change: true, newMap: currEmotion };
        }
    }

    return { change: false };
}

export async function getSemantics({ last3Messages, globals }) {
    const url = "http://34.91.168.188:8080/classify"; // Replace with the appropriate URL
    const startSem = Date.now();
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: last3Messages })
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

            const emotionSequences = [{
                targets: [1, 0, 0, 0, 1, 0, 0, 0],
                duration: 5000
            }]
            const emotionAnimationData = {
                messageType: "emotions",
                visemes: emotionSequences,
            };

            globals.forwardSocket.ws.send(JSON.stringify(emotionAnimationData));


        }
        if (scaleDominantEmotion(data.emotion_prob_map).emotion !== scaleDominantEmotion(globals.emotions.semantics).emotion) {
            globals.emotions.semantics = data.emotion_prob_map;

            console.log("changing semantics", data)

            const emotionSequences = [{
                targets: [1, 0, 0, 0, 1, 0, 0, 0],
                duration: 5000
            }]
            const emotionAnimationData = {
                messageType: "emotions",
                visemes: emotionSequences,
            };

            globals.forwardSocket.ws.send(JSON.stringify(emotionAnimationData));
        } else {
            console.log("not changing semantics")
        }

        const scaled = scaleDominantEmotion(data.emotion_prob_map);
        console.log("scaled", scaled)






        return data
    } catch (error) {
        console.error(`Error posting messages: ${error}`);
    }
}





