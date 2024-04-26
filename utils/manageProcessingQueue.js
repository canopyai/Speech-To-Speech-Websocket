
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


    if (processingQueue.length) {

        processingQueue.sort((a, b) => {
            return a.timestamp - b.timestamp;
        });

        const { forwardData, frontendData } = processingQueue[0];

        console.log(forwardData)

        

        if (forwardData ) {

            globals.forwardSocket.ws.send(JSON.stringify(forwardData));

            globals.frontendSocket.ws.send(JSON.stringify(frontendData));


            processingQueue.shift();
        }
    }
}
