import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

import { initialiseConnection } from './initialiseConnection.js';
import { manageProcessingQueue } from './utils/manageProcessingQueue.js';
import { handleTranscript } from './transcript/handleTranscript.js';
import { handleAuthenticate } from './authenticate/handleAuthenticate.js';

import { writeSessionCloseToFirebase } from './firebase/firestore.js';
import { generateActionAgentsSystemPrompt } from './action_agents/generate_actions_prompt.js';

import { handleReadDialogue } from './canopy_methods/handleReadDialogue.js';
import { handleUpdateDialogue } from './canopy_methods/handleUpdateDialogue.js';
import { handleMessageThreadLength } from './canopy_methods/handleMessageThreadLength.js';
import  { generateResponse } from './response/generateResponse.js';

const permittedRoles = ["user", "assistant", "system"];

wss.on('connection', (ws) => {

    console.log('Client connected');

    let session = null;
    let globals = {};

    globals.mainThread = [{
        role: "system",
        content: `You are a talking AI Avatar made by the Canopy team. 
Your name is Marcus. You are going to have a chat with me (Amu) about why AI Avatars are important.
First we will talk about interactive experiences in education. Leverage the fact that you can call APIs and are fully flexible for interactive experiences. Then we will talk about meetings and sales calls and 
how AI Avatars can help. Finally we will talk about how AI Avatars can help with mental health.

Give short 1 sentence answers aiming for a fast paced discussion atmosphere - where I will follow up if I want more information.

`
    }];
    globals.messageThreadLength = 0;
    globals.processingQueue = [];
    globals.finalTranscript = '';
    globals.lastTranscriptionTimeProcessed = 0;
    globals.wordBuffer = [];
    let processingQueue = [];
    globals.decoratorSocket = null;
    globals.projectId = null;
    globals.sessionId = null;


    globals.actionAgents = null;


    ws.on('message', async function (message) {
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
                const { actionAgents, initialSystemMessage} = data;
                if (actionAgents) {

                    globals.actionAgents = actionAgents;
                    globals.mainThread.push({ role: "system", content: generateActionAgentsSystemPrompt(data.actionAgents) });
                    

                }
                if (initialSystemMessage) {
                    globals.mainThread.push({ role: "system", content: initialSystemMessage });
                }

                handleAuthenticate({
                    ws,
                    globals,
                    data
                });
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

                        ws.send(JSON.stringify({
                            messageType: "appendDialogueResponse",
                            success: true,
                            data: {
                                timestamp: Date.now(),
                                messageThread: globals.mainThread
                            }
                        }));
                    } else {

                        ws.send(JSON.stringify({
                            messageType: "appendDialogueResponse",
                            success: false,
                            error: "No content provided"
                        }));
                    }

                    return;

                } else {

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
