export const constructFinalTranscriptFromWords = ({
    globals
}) => {
    // Sort the wordBuffer array by start_time in ascending order
    let wordBuffer = globals.wordBuffer;

    wordBuffer.sort((a, b) => a.start_time - b.start_time);

    // Remove the word with the lower dateTime when two words have the same start_time
    const uniqueSortedWords = wordBuffer.filter((word, index, arr) => {
        if (index === 0) {
            return true;
        }
        //if the words is not an alphanumeric character, return false
        if (!word.alternatives[0].content.match(/^[0-9a-zA-Z]+$/)) {
            return false;
        }
        return word.start_time !== arr[index - 1].start_time;
    });


    if(uniqueSortedWords.length == globals.previousUniqueWordBufferLength){
        return {finalTranscript: "", success: false};
    }

    globals.previousUniqueWordBufferLength = uniqueSortedWords.length;


    let finalTranscript = '';
    let previousWord = null;
    uniqueSortedWords.forEach((word) => {



            //check that word.alternatives[0].content is an alphanumeric character
            //if not, return
            if (!word.alternatives[0].content.match(/^[0-9a-zA-Z]+$/)) {
                return;
            }
        

            if (word.alternatives[0].content.toLowerCase() === previousWord?.toLowerCase()) {
                return;
            }

            globals.lastTranscriptionTimeProcessed = word.end_time;

            

            
            finalTranscript += word.alternatives[0].content.toLowerCase() + ' ';
  
   
            previousWord = word.alternatives[0].content.toLowerCase();

   
    });


    return { finalTranscript,  success: true };
}