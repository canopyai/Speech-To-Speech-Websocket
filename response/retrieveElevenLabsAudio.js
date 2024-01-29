import axios from "axios";
const elevenlabsKey = "a0db3b43532337aaffa8178d40099086"
import { decoratePhonemes } from "../decorator/decoratePhonemes.js";

export const retrieveElevenLabsAudio = async ({
    voiceId = "21m00Tcm4TlvDq8ikWAM",
    process,
    TTSSentence,
    globals,
    ws,
}) => {

    if (TTSSentence.trim()) {

        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?optimize_streaming_latency=4`;
        const headers = {
            Accept: 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': elevenlabsKey
        };

        const data = {
            text: TTSSentence,
            modelId: 'eleven_turbo_v2',
            
            voiceSettings: {
                stability: 0.5,
                similarityBoost: 0.5
            }
        };



        let response;
        let base64String;
        try {
            let initialTime = Date.now();
            response = await axios.post(url, data, { headers: headers, responseType: 'arraybuffer' });
            console.log("11 labs response time:", Date.now() - initialTime);
            base64String = Buffer.from(response.data, 'binary').toString('base64');

        } catch (err) {
            console.log(Object.keys(err))
            console.log(JSON.parse(err.response.data))
        }


        decoratePhonemes({
            audioData: base64String,
            globals,
            ws,
            process
        });

        process.base64String = base64String;




        console.log("tts engine response", process.id, Date.now())
    } else {

        return "Empty sentence sent to 11 labs!"
    }


}