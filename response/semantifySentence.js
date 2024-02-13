import rp from "request-promise";

export async function semantifySentence({
    TTSSentence,
    processingObject,

}) {
    try {
        // Make the POST request and directly get the response body
        const response = await rp.post({
            url: "http://127.0.0.1:8082/classify",
            headers: {
                "Content-Type": "application/json",
            },
            body: {
                text: TTSSentence
            },
            json: true // This ensures the response is parsed as JSON
        });

        // Log the parsed response body
        processingObject.semanticStresses = response

    } catch (err) {
        // console.log("Error:", err);
    }
}
