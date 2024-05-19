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
    let targets = Array(6).fill(0); // Initialize with zeroes

    // Calculate sin values for three pairs and ensure only one element in each pair is active
    frequencies.forEach((freq, index) => {
      const variedFreq = freq + (Math.random() * 0.02 - 0.01); // Even smaller random variation
      const variedMagnitude = relativeMagnitudes[index] * (1 + (Math.random() * 0.1 - 0.05)); // Even smaller random variation
      const noise = (Math.random() - 0.5) * 0.02; // Much smaller noise factor
      const value = baseScalar * variedMagnitude * absoluteMagnitude * Math.sin(2 * Math.PI * variedFreq * timeInSeconds) + noise;

      // Randomly select which element in the pair to activate
      const pairIndex = index * 2;
      if (Math.random() < 0.5) {
        targets[pairIndex] = value;
      } else {
        targets[pairIndex + 1] = value;
      }
    });

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

