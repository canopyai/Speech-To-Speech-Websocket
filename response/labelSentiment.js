import { trinaryClassify } from "./trinaryClassification.js";

export const labelSentiment = async ({
    TTSSentence,
    processingObject,
    previousSentence
}) => {

    try {
        const { score } = await trinaryClassify({
            text: previousSentence? previousSentence + " " + TTSSentence  : TTSSentence
        });
        processingObject.sentiment = score;

    } catch (err) {
        console.log("Error:", err);
    }

}