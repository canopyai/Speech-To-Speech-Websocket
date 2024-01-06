let audioQueue = [];
let currentlyPlaying = false;
let currentAudio = null; // Reference to the currently playing audio

window.addEventListener('vadStart', () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    audioQueue = [];
    currentlyPlaying = false;
});


function base64ToBlob(base64, contentType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}

// Function to play the next audio in the queue
async function playNext() {
    if (audioQueue.length === 0) {
        currentlyPlaying = false;
        return;
    }

    currentlyPlaying = true;
    const { audioBlob, dialogue } = audioQueue.shift();
    const audioUrl = URL.createObjectURL(audioBlob);

    currentAudio = new Audio(audioUrl); // Assign the new Audio object to currentAudio

    try {
        await currentAudio.play();

        // Create a CustomEvent instead of Event
        const audioPlayEvent = new CustomEvent('audioPlay', {
            detail: { dialogue }
        });

        window.dispatchEvent(audioPlayEvent);


        currentAudio.addEventListener('ended', () => {
            playNext();
        });
    } catch (error) {
        console.error('Error playing audio:', error);
    }
}


function enqueueAudio({
    base64String,
    dialogue
}) {
    const audioBlob = base64ToBlob(base64String, 'audio/mpeg');
    audioQueue.push({
        audioBlob,
        dialogue
    });

    if (!currentlyPlaying) {
        playNext();
    }
}


