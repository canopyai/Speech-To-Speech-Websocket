import { generateAmbientHeadMovements } from "./generateAmbientHeadMovements.js"
import { eyeMovementsForAmbient } from "./eyeMovementsForAmbient.js"

export function manageAmbientMovements({
    globals
}) {

    // return


    if (globals.forwardSocket && globals.forwardSocket.ws) {
        const overAllDuration = 60000
        const visemes = generateAmbientHeadMovements({
            duration: overAllDuration,
            globals
        })

        console.log("manage ambient movements")

        globals.forwardSocket.ws.send(JSON.stringify({
            visemes: eyeMovementsForAmbient({visemes}), 
            messageType:"ambientMovements"
        }))
        console.log()
    } else {
        setTimeout(() => {
            manageAmbientMovements({
                globals
            })
        }, 500)

    }



}