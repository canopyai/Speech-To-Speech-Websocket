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
            duration: (Math.random()<0.5)?(Math.random()*7000):timestep 
        });
    }
    // prolongSomeMovements({
    //     movements
    // })

    return movements;
}

