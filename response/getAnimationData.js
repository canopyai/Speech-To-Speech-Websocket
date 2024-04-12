export const getAnimationData = async ({
    TTSSentence, 
    globals
}) => {
    console.log("getAnimationData", TTSSentence)
    try {
        const remoteUrl = "http://34.32.228.101:8080/generate_animation";
        const url = new URL(remoteUrl);

        const modifiedTTSSentence = TTSSentence.replace(/[^\w\s]/g, '');
        url.searchParams.append('text', modifiedTTSSentence);

        console.log("url", url)

        if(TTSSentence.length === 0) {
            console.log("No text to process");
            return;
        }
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log("response was okay")
            return response.text(); // or response.json() if your server responds with JSON
        })
        .then(data => {
            console.log(data);
            globals.forwardSocket.ws.send(JSON.stringify({  
                messageType: "animationData",
                data: {
                    animationData: data
                }
            }));

            globals.isProcessingResponse = false;
        })
    } catch (error) {
        console.error("An error occurred:", error);
    }
};