import rp from "request-promise";

export const trinaryClassify = async ({
    text
}) => {
    const uri = "http://127.0.0.1:8083/classify";
    if(!text) return 
    const response = await rp.post({
        uri,
        headers: {
            "Content-Type": "application/json",
        },
        body: {
            text
        },
        json: true // This ensures the response is parsed as JSON
    });
    console.log("Sentiment:", response);

    if(response[0].label ==="neutral") return {score :0}
    if(response[0].label ==="positive") return {score :response[0].score}
    if(response[0].label ==="negative") return {score :-response[0].score}
    // return { sentiment };
}