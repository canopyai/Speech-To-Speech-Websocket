import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

import { initialiseConnection } from './initialiseConnection.js';
import { manageProcessingQueue } from './utils/manageProcessingQueue.js';
import { handleTranscript } from './transcript/handleTranscript.js';
import { handleAuthenticate } from './authenticate/handleAuthenticate.js';
import { initialiseDecorator } from './decorator/initialiseDecorator.js';

import { writeSessionCloseToFirebase } from './firebase/firestore.js';


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
    globals.sessionId = null;

    globals.baseAgentUrl = null;


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
                
                if (data.initialSystemMessage) {
                    globals.mainThread.push({ role: "system", content: data.initialSystemMessage });
                    globals.baseAgentUrl = data.baseAgentUrl;
                }


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


    initialiseDecorator({ globals, ws, processingQueue });

    ws.onclose = function(event) {

        let eventData = {

        }

        if (event.reason == "Authentication failed") {
            return;
        }

        if (event.wasClean) {
            console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
            console.log('Connection died');
        }

        writeSessionCloseToFirebase(globals.projectId, globals.sessionId)
    };
    


});

console.log('WebSocket server started on port 8080');
