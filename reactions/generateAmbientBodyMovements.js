export function generateAmbientBodyMovements({ duration }) {
    const baseScalar = 1;
    const relativeMagnitudes = [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5];
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
  
    // Randomly choose one active element per pair (0,1), (2,3), (4,5)
    const activeIndices = [
      Math.random() < 0.5 ? 0 : 1,
      Math.random() < 0.5 ? 2 : 3,
      Math.random() < 0.5 ? 4 : 5
    ];
  
    for (let step = 0; step < numSteps; step++) {
      const timeInSeconds = (step * timestep) / 1000.0;
      const envelope = Math.sin((Math.PI * step) / numSteps); // Half-sine wave envelope
      let targets = [0, 0, 0, 0, 0, 0]; // Initialize with zeroes
  
      // Calculate sin values for three active elements
      frequencies.forEach((freq, index) => {
        const variedFreq = freq + (Math.random() * 0.02 - 0.01); // Small random variation
        const variedMagnitude = relativeMagnitudes[index] * (1 + (Math.random() * 0.1 - 0.05)); // Small random variation
        const noise = (Math.random() - 0.5) * 0.02; // Small noise factor
        const value = baseScalar * variedMagnitude * absoluteMagnitude * Math.sin(2 * Math.PI * variedFreq * timeInSeconds) + noise;
  
        // Set the active element at the chosen index and apply the envelope
        targets[activeIndices[index]] = value * envelope;
      });
  
      movements.push({
        targets,
        duration: Math.random() < 0.05 ? Math.random() * 150 : timestep, // Add variability to duration
      });
    }
  
    // Ensure the last targets are all zero by adding a final movement with zero targets
    movements.push({
      targets: [0, 0, 0, 0, 0, 0],
      duration: timestep,
    });
  
    // Apply the half-sine wave to all targets
    const halfSine = generateHalfSineWave(movements.length);
    movements.forEach((el, sinDex) => {
      el.targets.forEach((t, index) => {
        el.targets[index] = t * halfSine[sinDex];
      });
    });
  
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
  
  function generateHalfSineWave(n) {
    const sineWave = [];
    for (let i = 0; i < n; i++) {
      const x = (Math.PI * i) / (n - 1);
      sineWave.push(Math.sin(x));
    }
    return sineWave;
  }
  
  // Example usage
  const movements = generateAmbientBodyMovements({ duration: 2000 });
  console.log(movements);
  