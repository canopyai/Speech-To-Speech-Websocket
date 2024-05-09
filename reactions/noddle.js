export function noddle({
    globals
}) {
    const nodPercentage = 0.5;
    
    // if (Math.random() > nodPercentage) return;

    if(!globals.forwardSocket) return

    if (!globals.lastNodTime) {
        globals.lastNodTime = Date.now()
    }

    const minNodInterval = 5500

    // if (Date.now() - globals.lastNodTime < minNodInterval) return;

    globals.lastNodTime = Date.now()




    let strength = 1
    const numberOfNods = Math.floor(Math.random() * 4) + 4;
    // const numberOfNods = 8



    const nodVisemes = [];

    const decayFactor = -((1 / 4) ** (1 / numberOfNods))

    let duration = strength * 500


    let emotion = "happy"
    if (globals.dominantEmotion) {
        emotion = globals.dominantEmotion.emotion
        getScaleMultiplier(emotion)
        strength = strength * getScaleMultiplier(emotion)[0]
        duration = duration * getScaleMultiplier(emotion)[1]
        return;
    }

   

    const numberOfTicks = duration / 15

    const initialSegment = computeSegments(0, strength, numberOfTicks)


    for(let is of initialSegment){
        nodVisemes.push({
            targets: [is],
            duration: 15,
        });
    }



    let lastSegment = initialSegment[initialSegment.length - 1]
    for (let i = 0; i < numberOfNods; i++) {
        strength = strength * decayFactor

        const targets = computeSegments(lastSegment, strength, numberOfTicks)
        lastSegment = targets[targets.length - 1]

        for(let target of targets){
            nodVisemes.push({
                targets:[target],
                duration: 15,
            });
        }
  

    }

    const endSegment = computeSegments(lastSegment, 0, numberOfTicks)
    console.log("endSegment", endSegment)

    for(let es of endSegment){
        nodVisemes.push({
            targets: [es],
            duration: 15,
        });
    }



    // return nodVisemes
    globals.forwardSocket.ws.send(JSON.stringify({
        messageType: "nods",
        visemes: nodVisemes
    }));


}


function computeSegments(startValue, stopValue, numberOfSegments) {
    let segments = [];
    const range = stopValue - startValue;

    for (let i = 0; i < numberOfSegments; i++) {
        const angle = Math.PI * i / (numberOfSegments - 1);

        const sineValue = (1 - Math.cos(angle)) / 2;

        const value = startValue + sineValue * range;

        segments.push(value);
    }

    return segments;
}

const nod = noddle({
    globals: {}
})


function getScaleMultiplier(emotion) {

    console.log(emotion)
    switch (emotion) {
        case "happy":
            return [1, 1]
        case "sad":
            return [0.5, 1.5]
        case "angry":
            return [1, 0.8]
        case "concern":
            return [0.75, 1.4]
        case "neutral":
            return [0.8, 1]
        case "excited":
            return [1.2, 1]
        case "fear":
            return [0.5, 1.5]
        case "disgust":
            return [0.5, 1.5]
    }

}