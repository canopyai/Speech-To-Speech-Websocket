export function sendBrowsMovement({
    globals
}) {
    if(!globals.lastBrowMovement){
        globals.lastBrowMovement = Date.now()
    }

    const activationProbs = 1

    if(Math.random()>activationProbs) return;

    if(globals.forwardSocket && globals.forwardSocket.ws){
        globals.forwardSocket.ws.send(JSON.stringify({
            duration: 100, 
            targets: [1,1,0,0]
        }))


    }

}