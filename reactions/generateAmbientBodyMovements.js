export function generateAmbientBodyMovements({ duration }) {
    const baseScalar = 1;
    const frequencyRange = [0.1, 0.3];
    const relativeMagnitudeRange = [0.7, 1.2];
    const absoluteMagnitude = 1.2;
    const timestep = 15;
    const numSteps = Math.floor(duration / timestep);
    let movements = [];
  
    function getRandomInRange([min, max]) {
      return min + Math.random() * (max - min);
    }
  
    for (let step = 0; step < numSteps; step++) {
      const timeInSeconds = (step * timestep) / 1000.0;
      let targets = Array(6).fill(0); // Initialize with zeroes
  
      // Calculate sin values for three pairs and ensure only one element in each pair is active
      for (let i = 0; i < 3; i++) {
        const freq = getRandomInRange(frequencyRange);
        const magnitude = getRandomInRange(relativeMagnitudeRange) * absoluteMagnitude;
        const noise = (Math.random() - 0.5) * 0.02; // Small noise factor
        const value = baseScalar * magnitude * Math.sin(2 * Math.PI * freq * timeInSeconds) + noise;
  
        const index1 = i * 2;
        const index2 = i * 2 + 1;
        if (Math.random() < 0.5) {
          targets[index1] = value;
          targets[index2] = 0;
        } else {
          targets[index1] = 0;
          targets[index2] = value;
        }
      }
  
      movements.push({
        targets,
        duration: Math.random() < 0.05 ? Math.random() * 150 : timestep, // Add variability to duration
      });
    }
  
    // Smooth transitions
    movements = smoothTransitions(movements);
  
    return movements;
  }
  
  function smoothTransitions(movements) {
    const smoothedMovements = [];
    const alpha = 0.1; // Smoothing factor
  
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
  
  // Example usage
  const movements = generateAmbientBodyMovements({ duration: 2000 });
  console.log(movements);
  