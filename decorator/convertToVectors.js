import { graphemesToVector, graphemeGroups } from './graphemesToVector.js';

export const convertToVectors = ({
    decoratorResponse
}) => {

    const visemesData = [];


    for (const word of decoratorResponse) {

        let bannedWords = ["</s>", "<s>", "<sil>", "</sil>", "<SIL>", "</SIL>"]

        if (bannedWords.includes(word.word)) {
            const { start, end } = word;

            const aggregateGraphemeObjects = [{
                vector: Array(Object.keys(graphemeGroups).length).fill(0),
                startTime: start,
                endTime: end,
                word: word.word,
                grapheme: word.word
            }]

            visemesData.push(...aggregateGraphemeObjects);

            continue;

        }




        const { graphemes, start, end } = word;

        const { aggregateGraphemeObjects } = graphemesToVector({
            graphemes,
            start,
            end,
            word
        });

        visemesData.push(...aggregateGraphemeObjects);
    }

    return { visemesData };
}
