import { modifyTranscript } from '../../transcript/modifyTranscript.js';
import { generateResponse } from '../../response/generateResponse.js';


export const initialiseShallowgramTranscription = async ({
    ws,
    processingQueue,
    globals
}) => {
    // return


    ws.on("message", function (message) {

        const { messageType, data } = JSON.parse(message);
        if (messageType !== "transcription") return;

        const { transcription, emotion_data, isEmpty } = data;

        console.log("transcription: ", transcription, "index",globals.conversationIndex)

        if(!isEmpty){
            globals.emotions.audioIntonation = emotion_data;




            const { success, error } = modifyTranscript({
                globals,
                role: "user",
                content: transcription,
    
            });
        }
        
   
        generateResponse({
            globals,
            processingQueue,
            createdAt: Date.now(),
            ws
        });
    })






}

