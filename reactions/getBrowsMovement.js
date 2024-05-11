export function sendBrowsMovement({
    globals
}) {

    // return;
    if(!globals.lastBrowMovement){
        globals.lastBrowMovement = Date.now()
    }

    const activationProbs = 1

    if(Math.random()>activationProbs) return;

    if(globals.forwardSocket && globals.forwardSocket.ws){
        const prospectiveTargs = [Math.random(), Math.random(), Math.random(), Math.random()];

        const sum = prospectiveTargs.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        
        const strength = 0.5
        const normalizedProspectiveTargs = prospectiveTargs.map(value => (value * strength) / sum);

        
        globals.forwardSocket.ws.send(JSON.stringify({

            

            visemes: [{
                duration: 100, 
                targets: [1,0,0,0]
            }], 
            messageType:"brows"
   
        }))


    }

}