import { generateAmbientHeadMovements } from "./generateAmbientHeadMovements.js"
import { eyeMovementsForBody } from "./eyeMovementsForBody.js"


export function manageBodyMovements({
    globals
}) {

    if (globals.forwardSocket && globals.forwardSocket.ws) {
        const overAllDuration = 60000
        const visemes = generateAmbientHeadMovements({
            duration: overAllDuration,
            globals
        })


        const visemesWithEyes = eyeMovementsForBody({visemes})
        
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