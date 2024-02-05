import requestPromise from 'request-promise';
import { convertToVectors } from './convertToVectors.js';

export const decoratePhonemes = async ({
    audioData,
    globals,
    ws,
    process,
    sampleRate
}) => {
    // console.log("decorator", process.id, Date.now())
    const { id } = process;

    const initialTime = Date.now();
    const decoratorObject = {
        audioData,
        processId: id,
        currentdatetime: Date.now(),
        sampleRate
    };


    const options = {
        method: 'POST',
        uri: 'http://127.0.0.1:8081/transcribe',
        body: decoratorObject,
        json: true // Automatically stringifies the body to JSON
    };

    try {
        const response = await requestPromise(options);



        const { visemesData } = convertToVectors({
            decoratorResponse: response,
        });

        process.visemesData = visemesData





    } catch (error) {
        console.error('Error:', error.message);
    }
};
