import { generateAmbientBodyMovements } from './generateAmbientBodyMovements.js';

export function convertHeadToBody({
    headVisemes
}){
    //head movements is an array of objects
    //each object has a targets array
    // and a durations array
    //add up all the durations together

    const totalDuration = headVisemes.reduce((acc, curr) => acc + curr.duration, 0)
    console.log("totalDuration", totalDuration)
}
