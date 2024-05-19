export function generateAmbientHeadMovements({
    duration,
    globals
}) {
    const baseScalar = 0.7;
    const frequencies = [0.2, 1, 0.1];
    const relativeMagnitudes = [1, 0.7, 1];
    const absoluteMagnitude = 1.2;
    const timestep = 15;
    const numSteps = Math.floor(duration / timestep);
    let movements = [];
    let isEyebrows = false;

    if (globals.isUserSpeaking) {
        isEyebrows = Math.random() > 0.5;
    }

    for (let step = 0; step < numSteps; step++) {
        const timeInSeconds = step * timestep / 1000.0;
        let targets = [];

        // Calculate sin values and interleave them with zeros, with added noise
        frequencies.forEach((freq, index) => {
            const variedFreq = freq + (Math.random() * 0.05 - 0.025); // Small random variation
            const variedMagnitude = relativeMagnitudes[index] * (1 + (Math.random() * 0.2 - 0.1)); // Small random variation
            const noise = (Math.random() - 0.5) * 0.05; // Smaller noise factor
            targets.push(baseScalar * variedMagnitude * absoluteMagnitude * Math.sin(2 * Math.PI * variedFreq * timeInSeconds) + noise);
            if (index < frequencies.length) {
                targets.push(0); // Maintain interleaved zeroes
            }
        });

        movements.push({
            targets,
            duration: (Math.random() < 0.05) ? (Math.random() * 150) : timestep // Add variability to duration
        });
    }

    // Optionally smooth transitions using easing functions
    movements = smoothTransitions(movements);

    return movements;
}

function smoothTransitions(movements) {
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    for (let i = 1; i < movements.length; i++) {
        const prevTargets = movements[i - 1].targets;
        const currTargets = movements[i].targets;
        const easedTargets = currTargets.map((target, index) => {
            const prevTarget = prevTargets[index];
            const t = easeInOutQuad(i / movements.length); // Apply easing
            return prevTarget + t * (target - prevTarget); // Interpolation with easing
        });
        movements[i].targets = easedTargets;
    }
    return movements;
}
