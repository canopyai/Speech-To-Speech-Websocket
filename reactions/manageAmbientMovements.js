import { generateAmbientHeadMovements } from "./generateAmbientHeadMovements.js"

export function manageAmbientMovements({
    globals
}) {


    if (globals.forwardSocket && globals.forwardSocket.ws) {
        const overAllDuration = 600000
        const visemes = generateAmbientHeadMovements({
            duration: overAllDuration,
            globals
        })

        globals.forwardSocket.ws.send(JSON.stringify({
            visemes, 
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