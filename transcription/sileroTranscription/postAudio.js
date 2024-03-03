import axios from 'axios';
import FormData from 'form-data';

export const postAudioBuffer = async ({ globals }) => {

    // Check if buffers are available
    if (!globals.buffers || globals.buffers.length === 0) {
        console.log('No buffers to send');
        return;
    }

    return;
    // Example function to combine audio buffers
    // This assumes all buffers are of the same format and can be directly concatenated
    const combineBuffers = (buffers) => {
        let totalLength = buffers.reduce((acc, val) => acc + val.byteLength, 0);
        let result = new Uint8Array(totalLength);
        let offset = 0;
        buffers.forEach(buffer => {
            result.set(new Uint8Array(buffer), offset);
            offset += buffer.byteLength;
        });
        return result.buffer; // Return as ArrayBuffer to be compatible with FormData
    };


    // Combine all buffers into one
    const combinedBuffer = combineBuffers(globals.buffers);

    // Prepare the FormData with the combined buffer
    const formData = new FormData();

    formData.append('file', new Blob([combinedBuffer], { type: 'audio/wav' }), {
        filename: 'combined_audio.wav',
        contentType: 'audio/wav',
    });

    return 
    
    try {
        const response = await axios.post('http://127.0.0.1:8086/transcribe', formData, {
            headers: formData.getHeaders(),
        });
        console.log('Transcription Response:', response.data);
    } catch (error) {
        console.error('Error posting audio buffer:', error.message);
    }
};
