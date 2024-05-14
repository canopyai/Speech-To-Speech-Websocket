export function extractCommandsFromSentence({ 
    sentence, 
    globals
}) {
    let text = sentence.sentence;

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
        text = text.replace(speedPattern, '');
         globals.mainThread.push({
            role:"system", 
            content:"You set just the speed for the next dialogue to"+ commands.speed
         })
         globals.speed = commands.speed
    } else {
        globals.speed = 0.9;
    }

    // Extract copy command
    const copyMatch = text.match(copyPattern);
    if (copyMatch) {
        commands.copy = true;
        globals.voiceVector = [0, 0, 1];
        text = text.replace(copyPattern, ''); // Remove the copy command from the text
    }

    // Extract whisper command
    const whisperMatch = text.match(whisperPattern);
    if (whisperMatch) {
        commands.whisper = parseFloat(whisperMatch[1]);
        text = text.replace(whisperPattern, ''); // Remove the whisper command from the text
    }

    // Set global voice vector based on extracted commands
    if (!copyMatch && whisperMatch) {
        globals.voiceVector = [1 - commands.whisper, commands.whisper, 0];
    } else if (!copyMatch && !whisperMatch) {
        globals.voiceVector = [1, 0, 0];
    }

    // Update the sentence with the cleaned text
    sentence.sentence = text.trim();

    return commands;
}
