export const addToTranscriptBuffer = ({
    buffer,
    globals
}) => {

    if(!globals.buffers){
        globals.buffers = [];
    }

    globals.buffers.push(buffer);

    
}