export function createNonSpeakingEmotion({
    globals,
}) {
    let dominantEmotion = null;

    if (globals.dominantEmotion) {
        dominantEmotion = globals.dominantEmotion;
    }

    if (!globals.isEmotionCycleSet) return null;

    if (dominantEmotion) {
        // const { }
        console.log("dominant emotion", dominantEmotion)
        const { emotion, scaledValue } = dominantEmotion;


        // linearly fit scaledValue between 0.6 and 1.2
        const preStrength = 0.6 + 0.6 * scaledValue;

        const strength = Math.min(1, preStrength);

        //randomly generate a number between 0.7 and 1.2

        const duration = (700 + Math.random() * 500) * strength;

        const curve = createAnimationCurve({
            duration,
            strength
        });

        const emotionIndex = emotionStateSpace({
            strength,
            label: emotion
        })

        const visemes = []

        for (let i = 0; i < curve.length; i++) {
            const targets = [0, 0, 0, 0, 0, 0, 0, 0];
            targets[emotionIndex] = curve[i];
            visemes.push({
                targets,
                duration: 15,
            });

        }

        console.log("emotions while talking visemes")


        globals.forwardSocket.ws.send(JSON.stringify({
            messageType: "emotionsNonSpeaking",
            visemes
        }));


        console.log("sending global forward socket stuff")






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
}) {
    const emotionsMap = {
        happy: [0, 1, 2],
        neutral: [1, 4],
        angry: [3, 5],
        sad: [3, 4],
        concerned: [3, 4, 5],
        excited: [1, 2, 6],
        fear: [3, 4], 
        disgust: [4, 5],
    }

    //randomly select an element from the array corresponding to the emotion

    let elements = emotionsMap[label];
    if(!elements) {
        elements = emotionsMap["neutral"]
    }
    const element = elements[Math.floor(Math.random() * elements.length)];

    return element



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