import fs from 'fs';
import { PassThrough } from 'stream';

export const streamMP4File = (ws) => {
    // Ensure the WebSocket is in a state that can send messages

    console.error('WebSocket is not open.');


    // Create a readable stream for the MP4 file
    const filePath = 'response/good.mp4'; // Update this path to where your file is located
    const fileStream = fs.createReadStream(filePath);

    // Optional: Use a PassThrough stream for any necessary processing
    const passThrough = new PassThrough();

    fileStream.on('error', (error) => {
        console.error('FileStream error:', error);
    });

    // Pipe the file stream through the PassThrough (if any processing is needed)
    fileStream.pipe(passThrough);

    // Handle the data event to send file chunks over the WebSocket
    passThrough.on('data', (chunk) => {
        // Send each chunk through the WebSocket
        return
        ws.send(chunk, { binary: true }, (error) => {
            if (error) {
                console.error('WebSocket send error:', error);
            }
        });
    });

    // Optional: Listen for the end of the stream
    passThrough.on('end', () => {
        console.log('Finished streaming the MP4 file.');
        // You can also close the WebSocket connection here if needed
        // ws.close();
    });
};
