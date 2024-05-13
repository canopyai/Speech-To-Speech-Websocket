import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ host: '0.0.0.0', port: 8080 });

import { initialiseConnection } from './initialiseConnection.js';
import { manageProcessingQueue } from './utils/manageProcessingQueue.js';
import { handleTranscript } from './transcript/handleTranscript.js';
import { handleAuthenticate } from './authenticate/handleAuthenticate.js';

import { writeSessionCloseToFirebase } from './firebase/firestore.js';
import { generateActionAgentsSystemPrompt } from './action_agents/generate_actions_prompt.js';
import { initialiseForwardSocket } from './forwardSocket/initialiseForwardSocket.js';
import { handleReadDialogue } from './canopy_methods/handleReadDialogue.js';
import { handleUpdateDialogue } from './canopy_methods/handleUpdateDialogue.js';
import { handleMessageThreadLength } from './canopy_methods/handleMessageThreadLength.js';
import { handleConfig } from "./authenticate/handle_config/handleConfig.js"
import { manageAmbientMovements } from "./reactions/manageAmbientMovements.js"

const permittedRoles = ["user", "assistant", "system"];

const forwardSocket = {}
const frontendSocket = {}
const animationsSent = []
const mainThread = [{
    role: "system",
    content: "You are a friendly AI therapist that can speak, hear, and has a physical form. You should ignore the tone of voice unless asked about it. Do not use special characters."
}]
wss.on('connection', (ws, req) => {

    console.log('Client connected');
    const ip = req.socket.remoteAddress;

    console.log('Client IP Address:', ip);

    let session = null;
    let globals = {};


    globals.mainThread = mainThread;
    globals.forwardSocket = forwardSocket;
    globals.frontendSocket = frontendSocket;
    globals.messageThreadLength = 0;
    globals.finalTranscript = '';
    globals.lastTranscriptionTimeProcessed = 0;
    globals.wordBuffer = [];
    let processingQueue = [];
    globals.decoratorSocket = null;
    globals.projectId = null;
    globals.sessionId = null;
    globals.emotions = {}
    globals.ws = ws
    globals.conversationIndex = 0;
    globals.isAudioEmpathy = false
    globals.animationsSent = animationsSent;


    console.log("my ip address", ip)
 

    if (ip == "94.252.122.131" ||ip == "35.204.82.115"||ip == "35.204.158.8") {
        console.log("forward socket connected", ip)
     
        forwardSocket.ws = ws;
        ({
            globals,
            forwardSocket
        });

        setTimeout(()=>{
            manageAmbientMovements({
                globals
            })
        }, 5000)



        initialiseForwardSocket({
            globals,
            forwardSocket
        })
    } else if (ip.startsWith("192.76") || ip.startsWith("209.2")) {
        console.log("frontend socket connected")
        frontendSocket.ws = ws;
        while (globals.mainThread.length > 1) {
            globals.mainThread.pop();
        }
    }



    globals.actionAgents = null;


    ws.on('message', async function (message) {

        const parsedMessageAB = JSON.parse(message);
        if (frontendSocket.ws) {
            frontendSocket.ws.send(JSON.stringify(parsedMessageAB));
        }

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


            case "appendDialogue":
                const { role, content } = data;
                console.log("recieved appendDialogue: ", data);

                if (permittedRoles.includes(role)) {

                    if (content) {

                        return
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
                        return
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

            case "audioEmpathy":

                const { isAudioEmpathy } = data;

                globals.isAudioEmpathy = isAudioEmpathy




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
    }, 10);



    ws.onclose = function (event) {



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
