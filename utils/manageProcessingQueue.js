
export const manageProcessingQueue = ({
    processingQueue,
    globals,
    ws
}) => {

    console.log(globals.emotions.semantics)
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

        const { TTSSentence } = forwardData

        console.log("sending off", TTSSentence)




        if (forwardData) {

            globals.forwardSocket.ws.send(JSON.stringify(forwardData));

            globals.frontendSocket.ws.send(JSON.stringify(forwardData));


            processingQueue.shift();
        }
    }
}
