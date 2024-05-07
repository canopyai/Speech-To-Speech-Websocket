import { generateBlinking } from './generateBlinking.js';

function gaussianRandom(mean, std, min, max) {
    let u = 0, v = 0;
    let num = 0;
    do {
        u = Math.random(); // Generate u in (0,1)
        v = Math.random(); // Generate v in (0,1)
        num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num * std + mean; // Scale and translate to mean and std deviation
    } while (num < min || num > max); // Continue until the generated number is within the specified bounds

    return num;
}

export function dispatchBlinking({
    globals,
}){
    // predict a random number between 150 and 400

    const duration = Math.floor(Math.random() * 250) + 150;
    const blinkingData = generateBlinking({
        duration
    });

    globals.forwardSocket.ws.send(JSON.stringify(blinkingData));

    const nextBlinkDelay = gaussianRandom(4000, 1800, 600, 8000);

    setTimeout(()=>{
        dispatchBlinking({globals})

    },nextBlinkDelay )
}

