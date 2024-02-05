const strong = 0.7;
const medium = 0.6;
const weak = 0.5;


const graphemeGroups = {
    "neutral": [],
    "B/P/M": ["B", "P", "M"],
    "Tf/d3": ["CH", "JH", "SH", "ZH", "Y"],
    "D/T": ["D", "T"],
    "F/V": ["F", "V"],
    "K": ["K"],
    "G": ["G"],
    "H": ["HH", "H", "AY"],
    "L": ["L"],
    "N": ["N"],
    "R": ["R"],
    "S/Z": ["S", "Z"],
    "TH/TH": ["TH", "DH"],
    "AH/AH": ["AH", "AA"],
    "AE": ["AE"],
    "EH/EH": ["EH", "EY"],
    "EE": ["IY"],
    "IH": ["IH"],
    "OO": ["UW"],
    "OUH": ["ER"],
    "OH": ["OW", "W"],
    "OY": ["OY", "AO"],
    "UH": ["UH"],
}

export const graphemesToVector = ({
    graphemes,
    start,
    end, 
    word
}) => {
    const aggregateGraphemeObjects = [];

    let strength = medium;

    let totalTime = end - start;

    let timePerGroup = totalTime / graphemes.length;
    let startTime = start

    graphemes.forEach(grp => {


        const grpStrength = grp.match(/\d+/g);

        let grapheme = grp;

        if (grpStrength) {
            const strengthNumber = grpStrength[0];
            grapheme = grp.replace(/\d+/g, '');
            if (strengthNumber === "1") {
                strength = strong;
            } else if (strengthNumber === "2") {
                strength = medium;
            } else if (strengthNumber === "0") {
                strength = weak;
            }
        }

        const group = Object.keys(graphemeGroups).find(group => graphemeGroups[group].includes(grapheme));


        const groupIndex = Object.keys(graphemeGroups).indexOf(group);
        const vector = Array(Object.keys(graphemeGroups).length).fill(0);
        vector[groupIndex] = strength;
        const endTime = startTime + timePerGroup;
        const graphemeObject = {
            vector,
            startTime,
            endTime, 
            word:word.word, 
            grapheme  
        }

        aggregateGraphemeObjects.push(graphemeObject);

        startTime = endTime;




    });

    return { aggregateGraphemeObjects };



}
