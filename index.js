import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

import { initialiseConnection } from './initialiseConnection.js';
import { manageProcessingQueue } from './utils/manageProcessingQueue.js';
import { handleTranscript } from './transcript/handleTranscript.js';
import { handleAuthenticate } from './authenticate/handleAuthenticate.js';
import { initialiseDecorator } from './decorator/initialiseDecorator.js';


wss.on('connection', (ws) => {

    console.log('Client connected');

    let session = null;
    let globals = {};

    globals.mainThread = [];
    globals.processingQueue = [];
    globals.finalTranscript = '';
    globals.lastTranscriptionTimeProcessed = 0;
    globals.wordBuffer = [];
    let processingQueue = [];
    globals.decoratorSocket = null;
    globals.projectId = null;


    ws.on('message', async function (message) {
        const { messageType, data } = JSON.parse(message);

        switch (messageType) {
            case "transcript":
                console.log("project id: ", globals.projectId);
                handleTranscript({
                    ws,
                    globals,
                    data
                });
                break;
            case "authenticate":
                handleAuthenticate({
                    ws,
                    globals,
                    data
                });
                break;
        }
    });


    initialiseConnection({
        ws,
        session,
        globals,
        processingQueue
    });


    setInterval(() => {
        manageProcessingQueue({
            processingQueue,
            ws,
            globals
        })
    }, 100);


    initialiseDecorator({ globals, ws, processingQueue })



});

console.log('WebSocket server started on port 8080');
