export function generateAmbientHeadMovements({
    duration,
    globals
}) {
    const baseScalar = 0.3;
    const frequencies = [1 / 2, 1 / 1, 1 / 0.7];
    const relativeMagnitudes = [1, 0.7, 0.4]
    const absoluteMagnitude = 0.4
    const timestep = 15;
    const numSteps = Math.floor(duration / timestep);
    let movements = [];
    let isEyebrows = false;
    if (globals.isUserSpeaking) {
        isEyebrows = Math.random() > 0.5; // Corrected to call Math.random() as a function
    }

    for (let step = 0; step < numSteps; step++) {
        const timeInSeconds = step * timestep / 1000.0;
        let targets = [];

        // Calculate sin values and interleave them with zeros
        frequencies.forEach((freq, index) => {
            targets.push(baseScalar * relativeMagnitudes[index] * absoluteMagnitude * Math.sin(2 * Math.PI * freq * timeInSeconds)); // Filled
            if (index < frequencies.length) {
                targets.push(0); // Empty
            }
        });

        movements.push({
            targets,
            duration: timestep
        });
    }
    prolongSomeMovements({
        movements
    })

    return movements;
}

function prolongSomeMovements({ movements }) {
    //random number between 2000 and 20000
    let prolongueDuration = ((Math.random() * 18) + 2) * 1000;
    let isProlongueIndex = Math.floor(Math.random() * 1300)
    console.log("isProlongueIndex", isProlongueIndex*15/1000)
    console.log("prolongue duration", prolongueDuration)

    let indexCounter = 0;

    for (let m of movements) {
        console.log("m is", m)
        for (let n of m){
            indexCounter++;
            if (indexCounter == isProlongueIndex) {
                n["duration"] = prolongueDuration
                prolongueDuration = ((Math.random() * 18) + 2) * 1000;
                isProlongueIndex = Math.floor(Math.random() * 1300)
                indexCounter = 0;
            }
        }
     
    }

}