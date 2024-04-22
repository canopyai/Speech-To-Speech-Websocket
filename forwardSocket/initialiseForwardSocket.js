import { modifyTranscript } from '../transcript/modifyTranscript.js';

export function initialiseForwardSocket({
    globals,
    forwardSocket

}) {

    forwardSocket.ws.on('message', (message) => {
        const { messageType } = JSON.parse(message);
        if (messageType === "updateThread") {

            console.log("updateThread", JSON.parse(message));

            const { uuid, numberOfVisemesPlayed } = JSON.parse(message);

            const animationData = globals.animationsSent.find(animation => animation.uuid === uuid);
            console.log(animationData)

            const { text, visemesLength } = animationData;

            const fractionOfText = numberOfVisemesPlayed/visemesLength;

            const textToUpdate = text.slice(0, Math.floor(fractionOfText * text.length));

            console.log("textToUpdate", textToUpdate)

            modifyTranscript({
                globals, 
                role:"assistant", 
                content: textToUpdate
            })









        }
    })
}