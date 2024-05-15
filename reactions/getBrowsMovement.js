export function sendBrowsMovement({
    globals
}) {

    // return;
    if(!globals.lastBrowMovement){
        globals.lastBrowMovement = Date.now() - 10000
    }

    const activationProbs = 1

    if(Math.random()>activationProbs) return;
    if(Date.now() - globals.lastBrowMovement<10000) return;

    if(globals.forwardSocket && globals.forwardSocket.ws){

        
        console.log("sending brows movement data")
        globals.forwardSocket.ws.send(JSON.stringify({

            

            visemes: [{
                duration: 100, 
                targets: getBrowsVector({
                    globals
                })
            }], 
            messageType:"brows"
   
        }))


    }

}

function getBrowsVector({
    globals
}){

    if (!globals.dominantEmotion){
        return [0.3,0,0,0]
    }

    switch (globals.dominantEmotion.emotion) {
        case "happy":
            return [active,0,0,0]
        case "sad":
            return [0,active,0,0]
        case "angry":
            return [0,0,active,0]
        case "concern":
            return [0,active,0,0]
        case "neutral":
            return [active,0,0,0]
        case "excited":
            return [active,0,0,0]
        case "fear":
            return [active/2,0,0,active/2]
        case "disgust":
            return [0,0,0,active]
    }
}