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


        console.log("modifiedTTSSentence", modifiedTTSSentence)


        if(TTSSentence.length === 0) {
            console.log("No text to process");
            return;
        }
        const startTime = Date.now()
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.text(); // or response.json() if your server responds with JSON
            console.log(`Received animation data in ${Date.now() - startTime}ms`);
            console.log("data keys", data);
            const { b64string, targets, duration} = data

            // {
            //     type: "morphTarget",
            //     duration: 0.1,
            //     targets: [Math.random(), Math.random()],
            //     audioData: "hellothereareyouokay".toString('base64')
            // }

            const targetObject = {  
                type: "morphTarget",
                duration: duration/1000,
                targets: targets,
                audioData: b64string
            }

            console.log("targetObject", targetObject)

            let duplicateTargetObject = {...targetObject};

            // duplicateTargetObject.audioData = duplicateTargetObject.audioData.substring(0, 10) + "..." + duplicateTargetObject.audioData.substring(duplicateTargetObject.audioData.length - 10, duplicateTargetObject.audioData.length)

            console.log("targetObject", duplicateTargetObject)


            globals.forwardSocket.ws.send(JSON.stringify(targetObject));
            globals.isProcessingResponse = false;
        } catch (error) {
            console.error("An error occurred:", error);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
};