import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { deepgramApiKey } from '../../config.js';
import { modifyTranscript } from '../../transcript/modifyTranscript.js';
import { generateResponse } from '../../response/generateResponse.js';
import { listeningReactions } from "../../reactions/listeningReactions.js";


const deepgramClient = createClient(deepgramApiKey);
const ignoreWords = ["hi", "good", "hey", "yeah"]

export const initialiseDeepgramTranscription = async ({
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
            interim_results: true,


        });

        if (keepAlive) clearInterval(keepAlive);
        keepAlive = setInterval(() => {
            deepgram.keepAlive();
        }, 10 * 1000);

        deepgram.addListener(LiveTranscriptionEvents.Open, async () => {


            deepgram.addListener(LiveTranscriptionEvents.Transcript, (data) => {


                const finalTranscript = data.channel.alternatives[0].transcript;


                if (!finalTranscript.trim()) return;
                if (finalTranscript.trim().length < 3) return;

                let shouldReturn = false;
                for (const word of ignoreWords) {
                    if (finalTranscript.trim() === word) {
                        shouldReturn = true;
                        break; // Exit the loop if condition is met
                    }
                }

                if (shouldReturn) return;

                if (data.speech_final && data.is_final) {
                    const { success, error } = modifyTranscript({
                        globals,
                        role: "user",
                        content: finalTranscript,

                    });
                    ws.send(JSON.stringify({
                        messageType: "transcript",
                        content: finalTranscript,
                        timestamp: Date.now()

                    }))
                    generateResponse({
                        globals,
                        processingQueue,
                        createdAt: Date.now(),
                        ws
                    });
                } else {
                    //get reaction
                    listeningReactions({
                        globals,
                        ws,
                        partialTranscript: finalTranscript
                    });

                }


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

