import requestPromise from 'request-promise';

export const decoratePhonemes = async ({ audioData, globals, ws, process }) => {
    // console.log("decorator", process.id, Date.now())
    const { id } = process;

    const initialTime = Date.now();
    const decoratorObject = {
        audioData,
        processId: id,
        currentdatetime: Date.now()
    };

    const options = {
        method: 'POST',
        uri: 'http://127.0.0.1:8081/phonemize',
        // uri: 'https://phonemizer-mlzdnrxolq-ue.a.run.app/phonemize',
        body: decoratorObject,
        json: true // Automatically stringifies the body to JSON
    };

    try {
        const response = await requestPromise(options);

        const finalTime = Date.now();
        const { phonemes } = response;
        process.phonemesVector = phonemes;
        const timeDelta = finalTime - initialTime;
        console.log("processId", id, "timeDelta", timeDelta)
        //write this data to a file



    } catch (error) {
        console.error('Error:', error.message);
    }
};
