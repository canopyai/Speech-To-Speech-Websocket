export function eyeMovementsForAmbient({
    globals,
    visemes
}) {


    const lookUpRatio = 0.2 //index 5
    const lookDownRatio = 0.45 //index 4
    const lookLeftRatio = 0.3//index 0
    const lookRightRatio = 0.3//index 1
    const newVisemes = []
    const timestep = 15
    for (let viseme of visemes) {
        const { targets } = viseme

        const eyeTargets = [targets[5] * lookUpRatio, lookRightRatio * targets[1], targets[4] * lookDownRatio, targets[0] * lookLeftRatio]

        newVisemes.push({
            targets: viseme.targets.concat(eyeTargets),
            duration: (Math.random()<0.01)?((Math.random()*1500)):timestep
        })

    }

    return newVisemes
}