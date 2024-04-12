import WebSocket from 'ws';
import { elevenlabsApiKey} from "../config.js"
import https from 'https';

const httpsAgent = new https.Agent({
    keepAlive: true, // Keep sockets around even when there are no outstanding requests, so they can be used for future requests without having to set up a new SSL/TLS session
    maxFreeSockets: 1 // Limit the number of sockets to keep in the free state
  });

// Replace these with actual values
const voice_id = 'ErXwobaYiN019PkySvjV';
const model = 'eleven_turbo_v2';

const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voice_id}/stream-input?model_id=${model}`;


export const initialiseElevenLabsConnection = ({
    globals, 
    processId, 
    createdAt
}) => {

    
    const elevenLabsWs = new WebSocket(wsUrl, {
        agent: httpsAgent // Use the custom HTTPS agent
      });


    if(globals.elevenLabsWs){
        globals.elevenLabsWs.close()

    }

    elevenLabsWs.on('open', function open() {
        console.log('Connected', Date.now());
        // Send data through the WebSocket
        const bosMessage = {
            "text": " ",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.8
            },
            "xi_api_key": elevenlabsApiKey, 
            "optimize_streaming_latency":3
        };
        return
        elevenLabsWs.send(JSON.stringify(bosMessage));
    });

    elevenLabsWs.on('message', function message(data) {
        console.log("recieved data")
        const {audio, alignment } = JSON.parse(data)
        console.log(Object.keys(JSON.parse(data)))
        if(alignment && audio){
            const {chars} = alignment
            const text = chars.join("")

            // console.log(audio)
            return
            globals.ws.send(
                JSON.stringify((
                    {
                        messageType: "audio", 
                        base64String: audio, 
                        dialogue:text
                    }
                )));

        } else if(audio) {

            return
            globals.ws.send(
                JSON.stringify((
                    {
                        messageType: "audio", 
                        base64String: audio, 
                        dialogue:"", 
                        processId, 
                        createdAt
                    }
                )));
        }
        

       
    });

    elevenLabsWs.on('error', function error(error) {
        console.log('Error:', error);
    });

    elevenLabsWs.on('close', function close() {
        console.log("xi closed")
        //reopen
        elevenLabsWs
    });

    globals.elevenLabsWs = elevenLabsWs;
}



