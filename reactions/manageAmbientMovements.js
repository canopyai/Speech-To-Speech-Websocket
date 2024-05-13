import { generateAmbientHeadMovements } from "./generateAmbientHeadMovements.js"
import { eyeMovementsForAmbient } from "./eyeMovementsForAmbient.js"

export function manageAmbientMovements({
    globals
}) {

    // return


    if (globals.forwardSocket && globals.forwardSocket.ws) {
        const overAllDuration = 6000
        const visemes = generateAmbientHeadMovements({
            duration: overAllDuration,
            globals
        })

        console.log("manage ambient movements")

        const visemesWithEyes = eyeMovementsForAmbient({visemes})

        globals.forwardSocket.ws.send(JSON.stringify({
            visemes: visemesWithEyes, 
            messageType:"ambientMovements"
        }))
        console.log()
    } else {
        setTimeout(() => {
            manageAmbientMovements({
                globals
            })
            console.log("sent manage ambient moves")
        }, 500)

    }



}