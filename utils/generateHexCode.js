export const generateRandomHex = ({
    length = 6
}) => {
    const characters = '0123456789ABCDEF';
    let hexCode = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        hexCode += characters[randomIndex];
    }

    return { hexCode };
};
