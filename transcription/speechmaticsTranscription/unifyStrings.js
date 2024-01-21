export const unifyStrings = (str1, str2) => {

    const overlapLength = Math.min(str1.length, str2.length);


    for (let i = overlapLength; i > 0; i--) {
        if (str1.endsWith(str2.substring(0, i))) {
            return str1 + str2.substring(i);
        }
    }
    return str1 + str2;
}

// Example usage

