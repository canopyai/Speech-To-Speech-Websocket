
export const extractAgentFromTranscript = (content) => {
    // Regular expression to find content within <>
    let regex = /<([^>]+)>\s*({[\s\S]*?})\s*<\/\1>/;
    let match = content.match(regex);

    if (match) {
        let tagName = match[1]; // action bot
        let jsonString = match[2]; // JSON obj

        try {
            let jsonObject = JSON.parse(jsonString);

            return {
                tagName,
                jsonObject
            };

        } catch (e) {
            console.error("Invalid JSON string:", jsonString);
        }
    } else {
        console.error("No matching tags found");
    }

    return {
        tagName: null,
        jsonObject: null
    };

}