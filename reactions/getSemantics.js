function checkEmotionChange(prevEmotion, currEmotion) {
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

export async function getSemantics({last3Messages, globals}) {
    const url = "http://34.91.168.188:8080/classify"; // Replace with the appropriate URL
    const startSem = Date.now();
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({messages:last3Messages})
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


    
  

        if(checkEmotionChange(globals.emotions.semantics, data.emotion_prob_map).change){
            globals.emotions.semantics = data.emotion_prob_map;
            // globals.frontendSocket.ws.send(JSON.stringify({
            //     messageType: "empathy",
            //     emotion: checkEmotionChange(globals.emotions.semantics, data.emotion_prob_map).newMap,
            // }))
            console.log("changing semantics", data)
        } else {
            console.log("not changing semantics")
        }


        

        

        return data
    } catch (error) {
        console.error(`Error posting messages: ${error}`);
    }
}





