import { generateAmbientHeadMovements } from "./generateAmbientHeadMovements"

export function manageAmbientMovements({
    globals
}) {


    const overAllDuration = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
    const movements = generateAmbientHeadMovements(overAllDuration)

    globals.forwardSocket.ws.send(JSON.stringify())


}