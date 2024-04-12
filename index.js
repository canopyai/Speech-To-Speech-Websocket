import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ host: '0.0.0.0', port: 8080 });

import { initialiseConnection } from './initialiseConnection.js';
import { manageProcessingQueue } from './utils/manageProcessingQueue.js';
import { handleTranscript } from './transcript/handleTranscript.js';
import { handleAuthenticate } from './authenticate/handleAuthenticate.js';

import { writeSessionCloseToFirebase } from './firebase/firestore.js';
import { generateActionAgentsSystemPrompt } from './action_agents/generate_actions_prompt.js';

import { handleReadDialogue } from './canopy_methods/handleReadDialogue.js';
import { handleUpdateDialogue } from './canopy_methods/handleUpdateDialogue.js';
import { handleMessageThreadLength } from './canopy_methods/handleMessageThreadLength.js';
import { generateResponse } from './response/generateResponse.js';
import { initialiseElevenLabsConnection } from './response/initialiseElevenLabsConnection.js';
import { handleConfig } from "./authenticate/handle_config/handleConfig.js"

const permittedRoles = ["user", "assistant", "system"];

wss.on('connection', (ws, req) => {

    console.log('Client connected');
    const ip = req.socket.remoteAddress;

    console.log('Client IP Address:', ip);

    let session = null;
    let globals = {};

    globals.mainThread = [];
    globals.messageThreadLength = 0;
    globals.processingQueue = [];
    globals.finalTranscript = '';
    globals.lastTranscriptionTimeProcessed = 0;
    globals.wordBuffer = [];
    let processingQueue = [];
    globals.decoratorSocket = null;
    globals.projectId = null;
    globals.sessionId = null;
    globals.ws = ws



    globals.actionAgents = null;


    ws.on('message', async function (message) {

        console.log(JSON.parse(message))
        let parsedMessage;

        // Attempt to parse the message as JSON
        try {
            parsedMessage = JSON.parse(message);
        } catch (e) {
            return; // Exit the function if the message cannot be parsed
        }

        const { messageType, data } = JSON.parse(message);

        switch (messageType) {
            case "transcript":
                // console.log("project id: ", globals.projectId);
                handleTranscript({
                    ws,
                    globals,
                    data
                });
                break;

            case "authenticate":
                console.log("authenticate hit", data)
                const { actionAgents } = data;
                if (actionAgents) {

                    globals.actionAgents = actionAgents;
                    globals.mainThread.push({ role: "system", content: generateActionAgentsSystemPrompt(data.actionAgents) });


                }


                handleAuthenticate({
                    ws,
                    globals,
                    data
                });

                handleConfig({
                    globals,
                    data
                })
                break;

            case "getResponse":
                generateResponse({
                    globals,
                    processingQueue,
                    createdAt: Date.now(),
                    ws
                });

                return;

            case "appendDialogue":
                const { role, content } = data;
                console.log("recieved appendDialogue: ", data);

                if (permittedRoles.includes(role)) {

                    if (content) {


                        globals.mainThread.push({ role: role, content: content });
                        return
                        ws.send(JSON.stringify({
                            messageType: "appendDialogueResponse",
                            success: true,
                            data: {
                                timestamp: Date.now(),
                                messageThread: globals.mainThread
                            }
                        }));
                    } else {
                        return
                        ws.send(JSON.stringify({
                            messageType: "appendDialogueResponse",
                            success: false,
                            error: "No content provided"
                        }));
                    }

                    return;

                } else {
                    return
                    ws.send(JSON.stringify({
                        messageType: "appendDialogueResponse",
                        success: false,
                        error: "Invalid role, role must be one of: " + permittedRoles.join(", ") + " but was: " + role
                    }));
                }
                break;

            case "readDialogue":

                handleReadDialogue({
                    ws,
                    globals
                });
                break;

            case "updateDialogue":

                handleUpdateDialogue({
                    ws,
                    globals,
                    data
                });
                break;

            case "messageThreadLength":

                handleMessageThreadLength({
                    ws,
                    globals
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



    ws.onclose = function (event) {

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
