import { generateAmbientBodyMovements } from './generateAmbientBodyMovements.js';
import { eyeMovementsForBody } from "./eyeMovementsForBody.js"
export function convertHeadToBody({
    headVisemes
}){
    //head movements is an array of objects
    //each object has a targets array
    // and a durations array
    //add up all the durations together

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
