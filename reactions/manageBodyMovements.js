import { generateAmbientBodyMovements } from "./generateAmbientBodyMovements.js"
import { eyeMovementsForBody } from "./eyeMovementsForBody.js"


export function manageBodyMovements({
    globals
}) {

    if (globals.forwardSocket && globals.forwardSocket.ws) {
        const overAllDuration = 60000
        const visemes = generateAmbientBodyMovements({
            duration: overAllDuration,
            globals
        })





        let visemesWithEyes = eyeMovementsForBody({visemes})
        
        visemesWithEyes = [{
            targets: [1, 0, 0, 0, 0, 0, 0, 0],
            duration: 300
        }, 
        {
            targets: [5, 0, 0, 0, 0, 0, 0, 0],
            duration: 300
        }]

        console.log("visemesWithEyes", visemesWithEyes)
    
        visemesWithEyes.forEach((el)=>{
            el.targets[2] = 0
            el.targets[3] = 0
        })
        
        console.log("sending ambient movements")
        globals.forwardSocket.ws.send(JSON.stringify({
            visemes: visemesWithEyes, 
            messageType:"bodyMovements"
        }))

    } else {
        setTimeout(() => {
            manageBodyMovements({
                globals
            })
            console.log("sent manage ambient moves")
        }, 500)

    }



}