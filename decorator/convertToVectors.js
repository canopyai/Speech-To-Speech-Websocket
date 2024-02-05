import { graphemesToVector } from './graphemesToVector.js';

export const convertToVectors = ({
    decoratorResponse
}) => {

    const visemesData = [];

    for (const word of decoratorResponse) {
        
        let bannedWords = ["</s>", "<s>"]

        if (bannedWords.includes(word.word)) {
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
