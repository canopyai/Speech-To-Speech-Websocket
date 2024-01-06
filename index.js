const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const { initialiseConnection } = require('./initialiseConnection');
const { manageProcessingQueue } = require('./utils/manageProcessingQueue');
const { modifyTranscript } = require('./transcript/modifyTranscript');


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

    initialiseConnection({ 
        ws, 
        session, 
        globals, 
        processingQueue
    });

    modifyTranscript({ 
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






});

console.log('WebSocket server started on port 8080');
