exports.parsePart = ({ part, sentence }) => {
    let content = part.choices[0].delta.content;

    sentence.isPreviousContentNumber = /^\d+$/.test(sentence.previous_content);
    if (content) {
        sentence.sentence += content;
        sentence.previousContent = content;
    }
}