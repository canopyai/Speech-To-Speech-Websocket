const io = require('socket.io-client');
// const serverUrl = 'https://phonemizer-mlzdnrxolq-ew.a.run.app';
const serverUrl = 'http://127.0.0.1:8081';
// const { decoratorListeners } = require('./decoratorListeners');

exports.initialiseDecorator = ({
    globals,
    processingQueue,
    ws
}) => {
    decoratorSocket = io(serverUrl);
    decoratorSocket.on('connect', () => {
        console.log('Connected to phonemizer server');

    })
    decoratorSocket.on('phonemize_response', (data) => {
        const {phonemes, processId} = JSON.parse(data);
        console.log("phonemize_response", processId, Date.now())

    });

    decoratorSocket.on('graphemize_response', (data) => {
        const {graphemes, processId} = JSON.parse(data);
        let isGraphemesAdded = false;
       processingQueue.forEach((processingObject, index) => {
            if (processingObject.id === processId) {
                processingObject.graphemes = graphemes;
                isGraphemesAdded = true;
            } 
        })
        if (!isGraphemesAdded) {
           ws.send( 
           JSON.stringify({
            data:{
                graphemes, 
                processId
            }, 
            messageType:"graphemizeResponse"
         
        }))
        }
        console.log("graphemize_response", processId, Date.now())

    });
    globals.decoratorSocket = decoratorSocket;

}