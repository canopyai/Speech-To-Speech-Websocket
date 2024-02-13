import { getHeadMovementVectorsFromList } from "./getHeadMovementVectorsFromList.js"
export const getHeadMovementVectors = ({
    decoratorResponse,
    process
}) => {


    let mag = 1
    let isFirstWord = true
    let previousVector = null;


    let wordList = []


    for (const word of decoratorResponse) {

        let bannedWords = ["</s>", "<s>", "<sil>", "</sil>", "<SIL>", "</SIL>"]

        if (bannedWords.includes(word.word)) {
            continue;
        }

        let stress = 0;
        process.semanticStresses.forEach((el) => {
            if (word.word.toLowerCase() === el.token.toLowerCase()) {
                stress = el.probabilities.class_1
            }
        })

        wordList.push({
            word: word.word,
            start: word.start,
            end: word.end,
            stress
        })

    }


    const { headMovementVectors } = getHeadMovementVectorsFromList({
        wordList
    })

    console.log("headMovementVectors", headMovementVectors)



    return { headMovementVectors }

}