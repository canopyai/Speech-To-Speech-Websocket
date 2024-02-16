export const getHeadMovementVectors = ({
    decoratorResponse,
    process,
    visemesData
}) => {

    for (const visemeObject of visemesData) {
        if (!visemeObject.word.includes("<") && process.isFirstChunk) {
            visemeObject.stress = true;
            visemeObject.stressProbability = 0.2;
            visemeObject.eyebrowStress = 0.3;
            visemeObject.firstSyllable = true;
            break;
        }
    }

    const taggedWords = []; // Initialize an array to keep track of tagged words

    for (const stressObject of process.semanticStresses) {
        const { token, probabilities } = stressObject;
        const stressProbability = probabilities.class_1;

        if (stressProbability > 0.1 && token.length > 1) {
            if (!taggedWords.includes(token)) {
                for (const visemeObject of visemesData) {
                    if (visemeObject.word === token) {
                        visemeObject.stress = true;
                        visemeObject.semanticStress = true;
                        visemeObject.stressProbability = stressProbability;
                        visemeObject.eyebrowStress = stressProbability;
                        taggedWords.push(token);
                    }
                }
            }
        }
    }


    visemesData.forEach((visemeObject, index) => {
        const { word } = visemeObject;
        if (!taggedWords.includes(word)) {
            if (Math.random() < 0.5) {
                visemeObject.stress = true;
                visemeObject.stressProbability = 0.2;
            }

            taggedWords.push(word);
        }
    })




    return { visemesData }

}