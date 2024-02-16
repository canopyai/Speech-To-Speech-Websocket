import { trinaryClassify } from "./trinaryClassification.js";

export const labelSentiment = async ({
    TTSSentence,
    processingObject,
}) => {

    try {
        const { score } = await trinaryClassify({
            text: TTSSentence
        });
        processingObject.sentiment = score;

    } catch (err) {
        console.log("Error:", err);
    }

}