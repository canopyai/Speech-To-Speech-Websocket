import { generateAmbientBodyMovements } from './generateAmbientBodyMovements.js';
import { eyeMovementsForBody } from "./eyeMovementsForBody.js"
export function convertHeadToBody({
    headVisemes
}){


    const totalDuration = headVisemes.reduce((acc, curr) => acc + curr.duration, 0)
    let visemes = generateAmbientBodyMovements({
        duration: totalDuration,

    })

    visemes.forEach((el)=>{
        el.targets[2] = 0
        el.targets[3] = 0
    })
    let visemesWithEyes = eyeMovementsForBody({visemes})

    return visemesWithEyes
}
