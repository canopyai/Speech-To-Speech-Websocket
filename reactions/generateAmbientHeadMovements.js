export function generateAmbientHeadMovements(duration) {
    const baseScalar = 0.3;
    const frequencies = [1/2, 1/1, 1/0.7];
    const timestep = 15; 
    const numSteps = Math.floor(duration / timestep);  
    let movements = [];

    for (let step = 0; step < numSteps; step++) {
        const timeInSeconds = step * timestep / 1000.0;  
        let targets = frequencies.map(freq => baseScalar * Math.sin(2 * Math.PI * freq * timeInSeconds));
        
        targets = targets.concat(Array(7).fill(0));
        
        movements.push({
            targets: targets,
            duration: timestep
        });
    }

    return movements;
}
