import { csvToMatrix } from './csvToMatrix.js'
import { multiplyMatrices } from './multiplyMatrices.js'

let embeddingLayer = null;

const semanticToAudioRatio = 0.75
const previousToCurrentRatio = 0.5

csvToMatrix("./emotions/similarity_matrix.csv", (matrix) => {
    embeddingLayer = matrix;
    console.log(embeddingLayer.length, embeddingLayer[0].length)
    // Now you have your matrix, you can use it as needed in your JavaScript code
});

export function generateEmotionVector({
    globals
}) {

    const audioMapIndices = {
        neutral: 0,
        happy: 1,
        fear: 2,
        sad: 3,
        disgust: 4,
        anger: 5
    };

    const eigenSpaceMapIndices = {
        angry: 0,
        concern: 1,
        curiosity: 2,
        disgust: 3,
        excitement: 4,
        fear: 5,
        happy: 6,
        interest: 7,
        neutral: 8,
        sad: 9,
        surprise: 10
    };


    const audioEmotions = globals.emotions.audioIntonation;
    const semantics = globals.emotions.semantics;
    const previousEmotionVector = globals.emotions.emotionVector || new Array(Object.keys(semanticsSample).length).fill([1 / (Object.keys(semanticsSample).length)]);;

    let emotionVector = new Array(Object.keys(audioMapIndices).length).fill([0]);

    // Populate the vector using the indices map
    audioEmotions.forEach(emotion => {
        const index = audioMapIndices[emotion.label];
        emotionVector[index] = [emotion.score];
    });

    const audioVectorOnSemanticEigenspace = multiplyMatrices(embeddingLayer, emotionVector);

    const semanticVector = Object.keys(semantics).map(key => [semantics[key]]);

    let combinedSemanticAudioVector = []
    for (let i = 0; i < audioVectorOnSemanticEigenspace.length; i++) {
        const audioComponent = audioVectorOnSemanticEigenspace[i];
        const semanticComponent = semanticVector[i];
        const combinedComponent = (semanticComponent * semanticToAudioRatio) + (audioComponent * (1 - semanticToAudioRatio));
        combinedSemanticAudioVector.push(combinedComponent);
    }



    //normalise the vector
    const sum = combinedSemanticAudioVector.reduce((a, b) => a + b, 0);
    const normalisedVector = combinedSemanticAudioVector.map(value => value / sum);


    //sum with previous vector in a ratio
    const markovEmotionVector = normalisedVector.map((value, index) => {
        return value * previousToCurrentRatio + previousEmotionVector[index] * (1 - previousToCurrentRatio);
    });

    console.log(markovEmotionVector)

    //what is the max value except neutral
    const max = Math.max(...markovEmotionVector.filter((_, index) => index !== 8));
    const maxIndex = markovEmotionVector.findIndex((value, index) => index !== 8 && value === max);
    console.log(max, maxIndex, Object.keys(semanticsSample)[maxIndex]);













}

const emotionSample = [
    { label: 'neutral', score: 0.0612898230552673 },
    { label: 'sad', score: 0.93299254924058914 },
    { label: 'fear', score: 0.002432159148156643 },
    { label: 'happy', score: 0.002050377894192934 },
    { label: 'disgust', score: 0.0007079485803842545 },
    { label: 'anger', score: 0.000527246156707406 }
]

const semanticsSample = { "Angry": 0.015201834587727737, "Concern": 0.0174366701264442, "Curiosity": 0.009760728792344532, "Disgust": 0.05711311709682893, "Excitement": 0.01819185437573322, "Fear": 0.07301013054488233, "Happy": 0.0289196786022471, "Interest": 0.0930067070471884, "Neutral": 0.54768447003173, "Sad": 0.150145699265289655, "Surprise": 0.11514789343919082 }
// const global = {}
// global.emotions = {
//     audioIntonation: emotionSample,
//     semantics: semanticsSample
// }
// setTimeout(() => {
//     const result = generateEmotionVector({
//         globals: global
//     })
//     console.log(result)
// }, 1000)



