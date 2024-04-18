import { modifyTranscript } from '../transcript/modifyTranscript.js';

export function initialiseForwardSocket({
    globals,
    forwardSocket

}) {

    forwardSocket.ws.on('message', (message) => {
        console.log("forward socket message: ", message)
        const { messageType } = JSON.parse(message);
        if (messageType === "updateThread") {
            console.log("time to update thread")

            const { uuid, numberOfVisemesPlayed } = JSON.parse(message);
            console.log("uuid: ", uuid, globals.animationsSent.map(animation => animation.uuid))

            const animationData = globals.animationsSent.find(animation => animation.uuid === uuid);

            const { text, visemesLength } = animationData;

            const fractionOfText = numberOfVisemesPlayed/visemesLength;

            const textToUpdate = text.slice(0, Math.floor(fractionOfText * text.length));

            modifyTranscript({
                globals, 
                role:"assistant", 
                content: textToUpdate
            })

            console.log("modified transcript: ", globals.mainThread)








        }
    })
}