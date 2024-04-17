import writtenNumber from 'written-number';
import { reformatFractions } from './reformatFractions.js';

export const reformatTextForTTS = ({ sentence }) => {
    let str = sentence.sentence;

    str = str.replace(/(\d),(\d)/g, '$1$2');

    str = str.replace(/(\d)(k|m|b|K|M|B)/g, (match, p1, p2) => {
        const lowerP2 = p2.toLowerCase();
        if (lowerP2 === 'k') return p1 + '000';
        if (lowerP2 === 'm') return p1 + '000000';
        if (lowerP2 === 'b') return p1 + '000000000';
    });

    let numberMatch = str.match(/[$]?\d+(\.\d+)?/g);

    if (!numberMatch) {
        return str;
    }

    if (reformatFractions(str)) {
        str = str.replace("/", " by "); 
    }

    str = str.replace("^", " to the power of ");

    for (let i = 0; i < numberMatch.length; i++) {
        let numberStr = numberMatch[i];
        let output = "";

        switch (numberStr.includes('$')) {
            case true:
                numberStr = numberStr.replace('$', '');
                output = " dollars";
                break;
            default:
                output = "";
                break;
        }

        let decimalPart = '';
        let parts = numberStr.split('.');
        numberStr = parts[0];
        if (parts.length > 1) {
            parts.shift();
            decimalPart = ' point ' + writtenNumber(parseInt(parts.join('')));
        }

        const convertedNumber = writtenNumber(parseInt(numberStr)) + decimalPart + output;

        str = str.replace(numberMatch[i], convertedNumber);
    }

    str = str.replace(/dollars hundred/g, "hundred dollars");
    str = str.replace(/dollars thousand/g, "thousand dollars");
    str = str.replace(/dollars million/g, "million dollars");
    str = str.replace(/dollars billion/g, "billion dollars");

    return str;
}



