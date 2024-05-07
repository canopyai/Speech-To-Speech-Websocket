export function createNonSpeakingEmotion({
    globals, 
}) {
    let dominantEmotion = null;

    if(globals.dominantEmotion){
        dominantEmotion = globals.dominantEmotion;
    }

    if(dominantEmotion){
        // const { }
        console.log("dominant emotion", dominantEmotion)

    }

    console.log("creating non speaking emotion")


}

function createAnimationCurve({ 
    duration, 
    strength 
}) {
    const steps = Math.round(duration / 15);
    const curve = [];

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const value = strength * (0.5 - 0.5 * Math.cos(Math.PI * t));
        curve.push(value);
    }

    return curve;
}

function emotionStateSpace({
    strength, 
    label
}){
    const emotionsMap = {
        happy:[0,1,2], 
        neutral:[1,4],
        angry:[3,5],
        sad:[3,4],
        concerned:[3,4,5],
        excited:[1,2,6],
        fear: [3,4]
    }

    const emotionVector = [0,0,0,0,0,0,0,0]

    

}


// Happy

// Smile left
// smile middle
// smile teeth

// Neutral
// smile middle

// Angry
// Lips pressed together
// Grimace



// Sad
// Lips pressed together 
// Left mouth twist



// Concerned
// Grimace
// Lips pressed together 
// Left mouth twist


// Excited
// smile middle, smile teeth, jaw open


// Fear

// Lips pressed together 
// Mouth open in terror


// Neutral
// Overbite
// Left mouth twist


// ALL
// Smile left
// smile middle
// smile teeth
// Lips pressed together
// Left mouth twist
// Grimace
// Mouth open
// Overbite