import { generateAmbientHeadMovements } from "./generateAmbientHeadMovements.js"
import { eyeMovementsForAmbient } from "./eyeMovementsForAmbient.js"

export function manageAmbientMovements({
    globals
}) {



    if (globals.forwardSocket && globals.forwardSocket.ws) {
        const overAllDuration = 60000
        const visemes = generateAmbientHeadMovements({
            duration: overAllDuration,
            globals
        })


        const visemesWithEyes = eyeMovementsForAmbient({visemes})
        
        console.log("sending ambient movements")
        // globals.forwardSocket.ws.send(JSON.stringify({
        //     visemes: visemesWithEyes, 
        //     messageType:"ambientMovements"
        // }))

    } else {
        setTimeout(() => {
            manageAmbientMovements({
                globals
            })
            console.log("sent manage ambient moves")
        }, 500)

    }



}