const endpoint = "https://user-reaction-classification-mlzdnrxolq-ue.a.run.app/classify";
import rp from "request-promise";
export const listeningReactions = async ({
    globals,
    partialTranscript
}) => {

    if (partialTranscript.length < 5) return;


    try {
        const result = await rp.post(endpoint, {
            json: { text: partialTranscript }
        })

        const reactionVector = extractScoresInOrder(result)
     
        return
        globals.ws.send(JSON.stringify({
            messageType: "reaction",
            reactionData: reactionVector
        }));


    } catch (err) {
        console.error("Error in listeningReactions", err);
    }

}

function extractScoresInOrder(result) {
    const order = ["nothing", "nod", "smile"];

    const scoreMap = result.reduce((map, item) => {
        map[item.label] = item.score;
        return map;
    }, {});

    return order.map(label => scoreMap[label]);
}
