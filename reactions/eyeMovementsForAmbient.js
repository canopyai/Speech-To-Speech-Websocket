export function eyeMovementsForAmbient({
    globals, 
    visemes
}) {
    const ratio1 = 1 //x left vs eyes right
    const ratio3 = 1 //z up vs eyes down

    const newVisemes = []
    for(let viseme of visemes){
        const eyeTargets = [0,0,0,0]
        eyeTargets[3] = ratio1 * viseme.targets[0];
        eyeTargets[2] = ratio3 * visemes.targets[4];

        newVisemes.push({
            targets: viseme.targets.extend(eyeTargets), 
            duration: 15
        })

    }

    return newVisemes
}