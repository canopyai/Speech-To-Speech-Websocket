export function generateAmbientBodyMovements({ duration }) {
    const baseScalar = 1;
    const relativeMagnitudes = [1, 0.7, 1];
    const absoluteMagnitude = 1.2;
    const timestep = 15;
    const numSteps = Math.floor(duration / timestep);
    let movements = [];
  
    // Function to generate a random frequency between 0.1 and 0.3
    function getRandomFrequency() {
      return 0.1 + Math.random() * 0.2;
    }
  
    // Generate three random frequencies
    const frequencies = [getRandomFrequency(), getRandomFrequency(), getRandomFrequency()];
  
    for (let step = 0; step < numSteps; step++) {
      const timeInSeconds = (step * timestep) / 1000.0;
      let targets = [];
  
      // Calculate sin values and interleave them with zeros, with less noise
      frequencies.forEach((freq, index) => {
        const variedFreq = freq + (Math.random() * 0.02 - 0.01); // Even smaller random variation
        const variedMagnitude = relativeMagnitudes[index] * (1 + (Math.random() * 0.1 - 0.05)); // Even smaller random variation
        const noise = (Math.random() - 0.5) * 0.02; // Much smaller noise factor
        targets.push(baseScalar * variedMagnitude * absoluteMagnitude * Math.sin(2 * Math.PI * variedFreq * timeInSeconds) + noise);
        if (index < frequencies.length) {
          targets.push(0); // Maintain interleaved zeroes
        }
      });
  
      movements.push({
        targets,
        duration:timestep, // Add variability to duration
      });
    }
  
    // Smooth transitions
    movements = smoothTransitions(movements);
  
    return movements;
  }
  
  function smoothTransitions(movements) {
    const smoothedMovements = [];
    const alpha = 0.01; // Smoothing factor
  
    for (let i = 0; i < movements.length; i++) {
      if (i === 0) {
        smoothedMovements.push(movements[i]);
      } else {
        const previousTargets = smoothedMovements[i - 1].targets;
        const currentTargets = movements[i].targets;
  
        const smoothedTargets = currentTargets.map((target, index) => {
          return alpha * target + (1 - alpha) * previousTargets[index];
        });
  
        smoothedMovements.push({
          targets: smoothedTargets,
          duration: movements[i].duration,
        });
      }
    }
  
    return smoothedMovements;
  }
  

  