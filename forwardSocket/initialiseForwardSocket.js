import { modifyTranscript } from '../transcript/modifyTranscript.js';
import { dispatchBlinking } from '../reactions/dispatchBlinking.js';

export function initialiseForwardSocket({
    globals,
    forwardSocket

}) {

    setTimeout(() => {
        dispatchBlinking({
            globals
        })
    }, 5000)

    forwardSocket.ws.on('message', (message) => {
        const { messageType } = JSON.parse(message);
        if (messageType === "updateThread") {

            const { uuid, numberOfVisemesPlayed } = JSON.parse(message);

            console.log(JSON.parse(message))

            const animationData = globals.animationsSent.find(animation => animation.uuid === uuid);

            if (!animationData) return

            const { text, visemesLength } = animationData;

            const fractionOfText = numberOfVisemesPlayed/visemesLength;

            const textToUpdate = text.slice(0, Math.floor(fractionOfText * text.length));


            modifyTranscript({
                globals, 
                role:"assistant", 
                content: textToUpdate
            })









        }
    })
}