const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
const {deepgramApiKey} = require('../../config');
const deepgramClient = createClient(deepgramApiKey);
const { modifyTranscript } = require('../../transcript/modifyTranscript');
const { generateResponse } = require('../../response/generateResponse');
const ignoreWords = ["hi", "good", "hey", "yeah"]
exports.initialiseDeepgramTranscription = async ({
    session,
    ws,
    processingQueue,
    globals
}) => {

    let keepAlive;
    const setupDeepgram = (ws) => {
        const deepgram = deepgramClient.listen.live({
            language: "en",
            punctuate: false,
            smart_format: false,
            model: "nova-2",
        });

        if (keepAlive) clearInterval(keepAlive);
        keepAlive = setInterval(() => {
            deepgram.keepAlive();
        }, 10 * 1000);

        deepgram.addListener(LiveTranscriptionEvents.Open, async () => {


            deepgram.addListener(LiveTranscriptionEvents.Transcript, (data) => {


                const finalTranscript = data.channel.alternatives[0].transcript;
            
                if(!finalTranscript.trim()) return;
                if(finalTranscript.trim().length < 3) return;
                
                let shouldReturn = false;
                for (const word of ignoreWords) {
                    if (finalTranscript.trim() === word) {
                        shouldReturn = true;
                        break; // Exit the loop if condition is met
                    }
                }
            
                if (shouldReturn) return; 

                const {success, error} = modifyTranscript({
                    globals,
                    role: "user",
                    content: finalTranscript
                });


                // ws.send(
                //     JSON.stringify({
                //         messageType: "transcript",
                //         finalTranscript
                //     })
                // )
         

                generateResponse({
                    globals,
                    processingQueue,
                    createdAt: Date.now(), 
                    ws
                });
            

                // ws.send(JSON.stringify(data));
            });

            deepgram.addListener(LiveTranscriptionEvents.Close, async () => {
                console.log("deepgram: disconnected");
                clearInterval(keepAlive);
                deepgram.finish();
            });

            deepgram.addListener(LiveTranscriptionEvents.Error, async (error) => {
                console.log("deepgram: error received");
                console.error(error);
            });

            deepgram.addListener(LiveTranscriptionEvents.Warning, async (warning) => {
                console.log("deepgram: warning received");
                console.warn(warning);
            });

            deepgram.addListener(LiveTranscriptionEvents.Metadata, (data) => {
                console.log("deepgram: metadata received");
                console.dir(data);
            });
        });

        return deepgram;
    };


    let deepgram = setupDeepgram(ws);

    ws.on('message', async function (message) {


        try {
            // Parse the JSON string back to an object
            const jsonMessage = JSON.parse(message);

            // Check if messageType is 'audio'
            if (jsonMessage.messageType === "audio") {
                // Decode the Base64 string to binary data
                const audioData = Buffer.from(jsonMessage.data, 'base64');

                // Send the binary data to Deepgram
                deepgram.send(audioData);
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
    });

}

