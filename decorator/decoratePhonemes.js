import requestPromise from 'request-promise';

export const decoratePhonemes = async ({ audioData, globals, ws, process }) => {
    console.log("decorator", process.id, Date.now())
    const { id } = process;

    const decoratorObject = {
        audioData,
        processId: id,
        currentdatetime: Date.now()
    };

    const options = {
        method: 'POST',
        uri: 'http://127.0.0.1:8081/phonemize',
        body: decoratorObject,
        json: true // Automatically stringifies the body to JSON
    };

    try {
        const response = await requestPromise(options);
        const { phonemes } = response;
        process.phonemesVector = phonemes;
    } catch (error) {
        console.error('Error:', error.message);
    }
};
