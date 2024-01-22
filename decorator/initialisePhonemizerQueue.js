
exports.initialisePhonemizerQueue = (globals) => {
    setInterval(() => {
        // if (globals.phonemesBeingProcessed.length > 3) return
        // if (Date.now() < globals.phonemizerCoolDown) return

        processQueue(globals);

    }, 500); // Adjust the interval as needed


}


const processQueue = (globals) => {
    const { decoratorSocket, phonemizerQueue } = globals;

    if (phonemizerQueue.length > 0) {
        const decoratorObject = phonemizerQueue.shift(); // Dequeue the first item
        const { processId, currentdatetime } = decoratorObject;
        globals.phonemesBeingProcessed.push(processId);
        decoratorSocket.emit('phonemize', decoratorObject);
    }
}

