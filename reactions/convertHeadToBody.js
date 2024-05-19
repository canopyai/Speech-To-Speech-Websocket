import { eyeMovementsForBody } from "./eyeMovementsForBody";

export function convertHeadToBody({
    headVisemes
}){
    const initialVisemes = headVisemes.map((viseme) => {
        return {
            duration: viseme.duration,
            targets: viseme.targets.slice(0, 5)
        }
    });

    const eyesIncluded = eyeMovementsForBody({
        visemes:initialVisemes
    });


    eyesIncluded.forEach((viseme, index) => {
        viseme.targets[2] = 0
        viseme.targets[3] = 0
    })

    return eyesIncluded

}