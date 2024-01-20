const { constructFinalTranscriptFromWords } = require('./constructFinalTranscriptFromWords');


exports.handlePartial = ({
    message,
    globals
}) => {

    const { results } = message;

    results.forEach((result) => {

        result.dateTime = Date.now();
        globals.wordBuffer.push(result);
    });
    const { finalTranscript, success } = constructFinalTranscriptFromWords({
        globals
    });

    globals.finalTranscript = finalTranscript

    return { success };


    

}