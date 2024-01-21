const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const { initialiseConnection } = require('./initialiseConnection');
const { manageProcessingQueue } = require('./utils/manageProcessingQueue');
const { handleTranscript } = require('./transcript/handleTranscript');
const { handleAuthenticate } = require('./authenticate/handleAuthenticate');
const { initialiseDecorator } = require('./decorator/initialiseDecorator');


wss.on('connection', (ws) => {

    console.log('Client connected');

    let session = null;
    let globals = {};

    globals.mainThread = [];
    globals.processingQueue = [];
    globals.finalTranscript = '';
    globals.lastTranscriptionTimeProcessed = 0;
    globals.wordBuffer = [];
    processingQueue = [];
    globals.decoratorSocket = null

    initialiseConnection({ 
        ws, 
        session, 
        globals, 
        processingQueue
    });

    handleTranscript({ 
        ws, 
        globals 
    });

    handleAuthenticate({
        ws,
        globals
    });


    setInterval(() => {
        manageProcessingQueue({
            processingQueue,
            ws,
            globals
        })
    }, 100);


    initialiseDecorator({globals, ws, processingQueue})



});

console.log('WebSocket server started on port 8080');
