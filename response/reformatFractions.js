export const reformatFractions = (str) => {
    // Check for a slash in the string
    if (!str.includes('/')) {
        return false;
    }
    
    // Split the string into numerator and denominator using the slash
    let parts = str.split('/');
    
    // If there are more than 2 parts (i.e., multiple slashes) return false
    if (parts.length !== 2) {
        return false;
    }
    
    let numerator = parts[0];
    let denominator = parts[1];
    
    // Check if the numerator or denominator are numbers
    let isNumeratorNumber = !isNaN(Number(numerator));
    let isDenominatorNumber = !isNaN(Number(denominator));
    
    // Check if the numerator or denominator have less than 3 characters
    let isNumeratorShort = numerator.length < 3;
    let isDenominatorShort = denominator.length < 3;
    
    // Check if any spaces exist in the string
    let hasSpaces = /\s/.test(str);
    
    // Return true if either numerator or denominator is a number or if either is less than 3 characters
    // and there are no spaces
    return (isNumeratorNumber || isDenominatorNumber || isNumeratorShort || isDenominatorShort) && !hasSpaces;
}