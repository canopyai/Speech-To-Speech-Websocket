import {createNonSpeakingEmotion } from '../reactions/createNonSpeakingEmotion.js';
import { noddle } from '../reactions/noddle.js';
export const initialiseVAD = async ({
    ws,
    globals,
}) => {
    ws.on('message', async function (message) {

        const { messageType, data } = JSON.parse(message);

        if (messageType !== "vad") return;

        const { vad_type } = data

        if (vad_type === "start") {
            globals.isEmotionCycleSet = true;






            
            globals.conversationIndex++;


            globals.forwardSocket.ws.send(JSON.stringify({
                messageType: "clearQueue",
                conversationIndex: globals.conversationIndex
            }));

            globals.frontendSocket.ws.send(JSON.stringify({
                messageType: "clearQueue",
                conversationIndex: globals.conversationIndex
            }));
            
            globals.forwardSocket.ws.send(JSON.stringify({
                messageType: "animationData",
                visemes: [{
                    targets:[0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0], 
                    duration:200
                }],
                audioData:"",
                uuid: "shutmouth",
            }));


            createNonSpeakingEmotion({
                globals,
            });
            noddle({
                globals,
            });
        }
    });


    ws.on('error', function (error) {
        console.log('Stream error: ', error);
    });
}
