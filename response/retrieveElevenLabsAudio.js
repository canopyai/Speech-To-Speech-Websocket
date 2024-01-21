const axios = require("axios")
const elevenlabsKey = "a9e3d4fc4bf7e281083a53972fd5b3e3"

exports.retrieveElevenLabsAudio = async ({
    voiceId,
    elevenLabsSentence,
    process, 
    sentence
}) => {

    if (elevenLabsSentence.trim()) {

        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?optimize_streaming_latency=4`;
        const headers = {
            Accept: 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': elevenlabsKey
        };

        const data = {
            text: elevenLabsSentence,
            modelId: 'eleven_monolingual_v1',
            voiceSettings: {
                stability: 0.5,
                similarityBoost: 0.5
            }
        };



        let response;
        try{
             response = await axios.post(url, data, { headers: headers, responseType: 'arraybuffer' });
        } catch(err){
            console.log(err)
        }

        const base64String = Buffer.from(response.data, 'binary').toString('base64');

        


        console.log("received response from 11 labs")
    } else {
        
        throw "Empty sentence sent to 11 labs!"
    }


}