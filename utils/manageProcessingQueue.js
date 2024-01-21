
exports.manageProcessingQueue = ({
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

        const { base64String, phonemesVector } = processingQueue[0];


        // if (base64String && phonemesVector) {
        if (base64String ) {


            ws.send(
                JSON.stringify((
                    {
                        ...processingQueue[0],
                        messageType: "audio"
                    }
                )));

            processingQueue.shift();
        }
    }
}
