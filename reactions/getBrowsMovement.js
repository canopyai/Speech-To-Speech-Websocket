export function sendBrowsMovement({
    globals
}) {

    console.log("sendBrowsMovement function being called")
    // return;
    if (!globals.lastBrowMovement) {
        globals.lastBrowMovement = Date.now() - 10000
    }

    const activationProbs = 1

    if (Math.random() > activationProbs) return;
    if (Date.now() - globals.lastBrowMovement < 10000) return;

    if (globals.forwardSocket && globals.forwardSocket.ws) {

        console.log("sending brows movement data")

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

    const active = (Math.random() * 0.1) + 0.2

    if (!globals.dominantEmotion) {
        return [0, active/2, 0, active/2]
    }



    switch (globals.dominantEmotion.emotion) {
        case "happy":
            return [0, active/2, 0, active/2]
        case "sad":
            return [active, 0, 0, 0] //0 index
        case "angry":
            return [0, 0, active, 0] // 2 index
        case "concern":
            return [active, 0, 0, 0]  // 0 index
        case "neutral":
            return [0, active/2, 0, active/2]
        case "excited":
            return [0, active, 0, 0]
        case "fear":
            return [active, 0, 0, 0]
        case "disgust":
            return [0, 0, active, 0] // 2 index 
    }
}