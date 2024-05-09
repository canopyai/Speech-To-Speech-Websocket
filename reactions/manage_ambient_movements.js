import { generateAmbientHeadMovements } from "./generateAmbientHeadMovements"

export function manageAmbientMovements({
    globals
}) {


    const overAllDuration = 600000
    const movements = generateAmbientHeadMovements({
        duration:overAllDuration, 
        globals
    })

    globals.forwardSocket.ws.send(JSON.stringify(movements))


}