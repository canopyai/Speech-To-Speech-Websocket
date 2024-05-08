
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


        const { emotionSequences } = forwardData;




        if (forwardData) {

            globals.forwardSocket.ws.send(JSON.stringify(forwardData));

            if (globals.isEmotionCycleSet) {
                setTimeout(() => {
                    globals.isEmotionCycleSet = false;
                }, 500)


                // globals.forwardSocket.ws.send(JSON.stringify({
                //     messageType: "emotionsNonSpeaking",
                //     visemes: [{
                //         targets: [0, 0, 0, 0, 0, 0, 0, 0],
                //         duration: 300
                //     }]
                // }));
            }










            globals.frontendSocket.ws.send(JSON.stringify(forwardData));




            processingQueue.shift();
        }
    }
}
