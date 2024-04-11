import requestPromise from 'request-promise';
import { convertToVectors } from './convertToVectors.js';
import { graphemeGroups } from './graphemesToVector.js';
import { getHeadMovementVectors } from './getHeadMovementVectors.js';

export const decoratePhonemes = async ({
    audioData,
    globals,
    ws,
    process,
    sampleRate,
    finishReason
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
        //uri: 'https://phonemizer-mlzdnrxolq-ue.a.run.app/transcribe',

        body: decoratorObject,
        json: true // Automatically stringifies the body to JSON
    };

    try {

        const response = await requestPromise(options);



        const { visemesData } = convertToVectors({
            decoratorResponse: response,

        });

        console.log("requested head movement vector")

        // const { headMovementVectors } = getHeadMovementVectors({
        //     decoratorResponse: response, 
        //     process, 
        //     visemesData
        // })

        console.log("retrieved head movement vectors")


        // process.headMovementVectors = headMovementVectors


        

        if (finishReason === "stop") {
            visemesData.push({
                vector: Array(Object.keys(graphemeGroups).length).fill(0),
                startTime: visemesData[visemesData.length - 1].endTime,
                endTime: visemesData[visemesData.length - 1].endTime + 100,
                headMovementVectors: [0, 0, 0]
            })
        }

        process.visemesData = visemesData;





    } catch (error) {

    }
};
