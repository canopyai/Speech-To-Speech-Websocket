
export const manageProcessingQueue = ({
    processingQueue,
    globals,
    ws
}) => {


    const maxAge = 5000;

    let i = 0;
    while (i < processingQueue.length) {
        if (Date.now() - processingQueue[i].timestamp >= maxAge) {
            processingQueue.splice(i, 1);
        } else {
            i++;
        }
    }

    if (processingQueue.length && processingQueue[0].forwardData) {


        processingQueue.sort((a, b) => {
            return a.timestamp - b.timestamp;
        });

        const { forwardData } = processingQueue[0];


        const { emotionSequences, isFirstChunk, headVisemes, headBrowVisemes } = forwardData;
        // const { emotionSequences } = forwardData;


        console.log("headVisemes",headVisemes)

        // console.log("headVisemes",headVisemes[0].targets.length)
        


        if (forwardData) {

            console.log("there is forward data")

            if(isFirstChunk){
                console.log("sending clear queue message")
                globals.forwardSocket.ws.send(JSON.stringify({
                    messageType: "clearQueue",
                    conversationIndex: globals.conversationIndex
                }));
            } 

            setTimeout(()=>{
                globals.forwardSocket.ws.send(JSON.stringify(forwardData));

            }, 20)

            if(!globals.lastNonSpeakingTimestamp){
                globals.lastNonSpeakingTimestamp = Date.now()
            }

            if(Date.now()>globals.lastNonSpeakingTimestamp){
                console.log("resetting last nonSpeaking TS")
                globals.lastNonSpeakingTimestamp = Date.now()
            }

            if (globals.isEmotionCycleSet) {
                setTimeout(() => {
                    //check if user is still speaking 
                    globals.isEmotionCycleSet = false;
                    // globals.forwardSocket.ws.send(JSON.stringify({
                    //     messageType: "emotionsNonSpeaking",
                    //     visemes: [{
                    //         targets: [0, 0, 0, 0, 0, 0, 0, 0],
                    //         duration: 100
                    //     }]
                    // }));
                }, 500)

            
            }










            globals.frontendSocket.ws.send(JSON.stringify(forwardData));




            processingQueue.shift();
        }
    }
}
