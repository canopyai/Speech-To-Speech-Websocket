export function generateAmbientBodyMovements({ duration }) {
    const baseScalar = 1;
    const frequencies = [0.2, 1, 0.1];
    const relativeMagnitudes = [1, 0.7, 1];
    const absoluteMagnitude = 1.2;
    const timestep = 15;
    const numSteps = Math.floor(duration / timestep);
    let movements = [];
  
    for (let step = 0; step < numSteps; step++) {
      const timeInSeconds = step * timestep / 1000.0;
      let targets = [];
  
      // Calculate sin values and interleave them with zeros, with more random direction
      frequencies.forEach((freq, index) => {
        const variedFreq = freq + (Math.random() * 0.02 - 0.01); // Even smaller random variation
        const variedMagnitude = relativeMagnitudes[index] * (1 + (Math.random() * 0.1 - 0.05)); // Even smaller random variation
        const noise = (Math.random() - 0.5) * 0.02; // Much smaller noise factor
        const direction = Math.random() < 0.5 ? 1 : -1; // Random direction for the movement
        targets.push(baseScalar * variedMagnitude * absoluteMagnitude * Math.sin(2 * Math.PI * variedFreq * timeInSeconds) * direction + noise);
        if (index < frequencies.length) {
          targets.push(0); // Maintain interleaved zeroes
        }
      });
  
      movements.push({
        targets,
        duration: Math.random() < 0.05 ? Math.random() * 150 : timestep // Add variability to duration
      });
    }
  
    // Smooth transitions
    movements = smoothTransitions(movements);
  
    return movements;
  }
  
  function smoothTransitions(movements) {
    const smoothedMovements = [];
    const alphaBase = 0.01; // Base smoothing factor
  
    for (let i = 0; i < movements.length; i++) {
      if (i === 0) {
        smoothedMovements.push(movements[i]);
      } else {
        const previousTargets = smoothedMovements[i - 1].targets;
        const currentTargets = movements[i].targets;
  
        const alpha = alphaBase * (1 + Math.random() * 0.1); // Randomize smoothing factor slightly
  
        const smoothedTargets = currentTargets.map((target, index) => {
          return alpha * target + (1 - alpha) * previousTargets[index];
        });
  
        smoothedMovements.push({
          targets: smoothedTargets,
          duration: movements[i].duration
        });
      }
    }
  
    return smoothedMovements;
  }
  