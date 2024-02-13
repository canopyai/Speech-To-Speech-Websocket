export const getHeadMovementVectorsFromList = ({
    wordList
}) => {
    let lastStressTime = 0


    const finalTime = wordList[wordList.length - 1].end

    wordList.forEach((word, wordIndex) => {
        const { stress, start, end } = word;

        if (wordIndex === 0) {
            word.stressMarker = "first word";
            lastStressTime = start;


        } else if (stress > 0.1 && end - lastStressTime > 500) {
            word.stressMarker = "main";
            lastStressTime = start;
        }
    })

    // console.log("wordList", wordList)

    let stressors = wordList.filter(word => (word.stressMarker === "main" || word.stressMarker === "first word"))

    stressors.forEach((stressor, index) => {
        const nextStressor = stressors[index + 1]
        const previousStressor = stressors[index - 1]

        if(nextStressor){
            stressor.length = nextStressor.start - stressor.start
        } else {
            stressor.length = finalTime - stressor.start
        }

    })

    console.log(stressors)

    let vectorsObjects = []

    stressors.forEach((stressor)=>{
        let stressorMagnitude = 1
        let vector = [stressorMagnitude * (1-(2*Math.random())), stressorMagnitude * (1-(2*Math.random())), stressorMagnitude * (1-(2*Math.random()))]
        
        vectorsObjects.push({
            vector,
            duration: 200
        })
        
        const decay = (0.5 * Math.random() +0.25) * stressor.length;
        const sustain = stressor.length  - decay - 200;

        vectorsObjects.push({
            vector: vector,
            duration: sustain
        })

        vectorsObjects.push({
            vector: [0,0,0],
            duration: decay
        })





    })

    return { headMovementVectors: vectorsObjects }


}