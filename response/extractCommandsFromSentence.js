export function extractCommandsFromSentence({ 
    sentence, 
    globals
 }) {
    const text = sentence.sentence;

    // Define regex patterns for different commands
    const speedPattern = /<speed:(\d+(\.\d+)?)>/;
    const copyPattern = /<copy>/;
    const whisperPattern = /<whisper:(\d+(\.\d+)?)>/;

    // Initialize an object to store the extracted commands
    const commands = {
        speed: null,
        copy: false,
        whisper: null
    };

    // Extract speed command
    const speedMatch = text.match(speedPattern);
    if (speedMatch) {
        commands.speed = parseFloat(speedMatch[1]);
    } else {
        globals.speed = 0.9
    }

    // Extract copy command
    const copyMatch = text.match(copyPattern);
    const whisperMatch = text.match(whisperPattern);

    if (copyMatch) {
        commands.copy = true;
        globals.voiceVector = [0,0,1]
    } else if(whisperMatch){
        globals.voiceVector = [1-commands.whisper,commands.whisper,0]

    } else {
        globals.voiceVector = [1,0,0]
    }


    return commands;
}