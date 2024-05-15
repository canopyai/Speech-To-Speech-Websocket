export function sendBrowsMovement({
    globals
}) {

    // return;
    if (!globals.lastBrowMovement) {
        globals.lastBrowMovement = Date.now() - 10000
    }

    const activationProbs = 1

    if (Math.random() > activationProbs) return;
    if (Date.now() - globals.lastBrowMovement < 10000) return;

    if (globals.forwardSocket && globals.forwardSocket.ws) {


        console.log("sending brows movement data")
        globals.forwardSocket.ws.send(JSON.stringify({



            visemes: [{
                duration: 100,
                targets: getBrowsVector({
                    globals
                })
            }],
            messageType: "brows"

        }))


    }

}

function getBrowsVector({
    globals
}) {

    if (true) {
    // if (!globals.dominantEmotion) {
        return [0, 0, 1, 0]  //loopy in the middle
    }

    const active = (Math.random() * 0.2) + 1

    switch (globals.dominantEmotion.emotion) {
        case "happy":
            return [active, 0, 0, 0]
        case "sad":
            return [active, 0, 0, 0] //0 index
        case "angry":
            return [active, 0, 0, 0]
        case "concern":
            return [active, 0, 0, 0]  // 0 index
        case "neutral":
            return [active, 0, 0, 0]
        case "excited":
            return [active, 0, 0, 0]
        case "fear":
            return [active, 0, 0, 0]
        case "disgust":
            return [active, 0, 0, 0]
    }
}