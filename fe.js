let recorder;
let socket;

document.getElementById('recordButton').addEventListener('click', async () => {
    if (recorder && recorder.recording) {
        // Stop recording
        recorder.stopRecording(() => {
            document.getElementById('status').textContent = 'Not Recording';
        });
    } else {
        // Start recording
        document.getElementById('status').textContent = 'Recording...';
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        recorder = new RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/wav',
            recorderType: RecordRTC.StereoAudioRecorder,
            timeSlice: 250,
            desiredSampRate: 16000,
            numberOfAudioChannels: 1,
            bufferSize: 16384,
            audioBitsPerSecond: 128000,
            ondataavailable: async (blob) => {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    const arrayBuffer = await blob.arrayBuffer();
                    const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
                    socket.send(JSON.stringify({
                        data: base64String, 
                        messageType: "audio"
                    }));
                    
                }
            }
        });

        recorder.startRecording();
 
        socket = new WebSocket('ws://localhost:8080');

        window.addEventListener("audioPlay", (event) => {
   
            const { dialogue } = event.detail;
            socket.send(JSON.stringify({
                data: {
                    role:"assistant", 
                    content:dialogue 
                }, 
                messageType: "transcript"
            }));
        });

        socket.onmessage = (event) => {
            const { messageType } = JSON.parse(event.data);

            switch (messageType) {
                case "audio":
                    const { base64String, dialogue } = JSON.parse(event.data);
                    enqueueAudio({
                        base64String,
                        dialogue
                    });
                    break;
                case "vadStart":
                    window.vadStart = Date.now();
                    const vadStartEvent = new Event('vadStart');
                    window.dispatchEvent(vadStartEvent);
                    break;
                case "vadStop":
                    window.vadStop = Date.now();
                    break;
                default:
                    break;
            }
        };

    }
});

