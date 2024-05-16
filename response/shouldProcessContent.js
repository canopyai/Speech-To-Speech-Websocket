export const shouldProcessContent = ({ sentence, part }) => {

    const content = sentence.previousContent;

    const buffer = sentence.buffer


    const special_content_conditions = [
        (content && (((!sentence.is_previous_content_number &&
            ((content.includes(".")) ||
                content.includes("?") ||
                content.includes("!") ||
                content.includes("]")) ||
                content.includes(",")) 
        ) && sentence.sentence.split(" ").length > 4))),
        // ((content === ",") && (sentence.sentence.split(" ").length <3)|| (content === ",") && (sentence.sentence.split(" ").length > 3)),
        // additional_conditions({ sentence, part }).boolean,


        (part.choices[0].finish_reason === "stop")
    ];

    const condition = special_content_conditions.includes(true);

    if(additional_conditions({ sentence, part }).boolean){
        sentence.buffer = additional_conditions({ sentence, part }).word
        const word = additional_conditions({ sentence, part }).word;
        if (word) {
            const lastIndex = sentence.sentence.lastIndexOf(word);
            if (lastIndex !== -1) {
                sentence.sentence = sentence.sentence.substring(0, lastIndex) + sentence.sentence.substring(lastIndex).replace(word, "");
            }
        }
    } else {
        sentence.buffer = null
    }



    return condition;
}


function additional_conditions({
    sentence,
    part
}) {
    let break_words = ["and", "which", "where"]

    const content = sentence.previousContent.trim()

    let return_condition = {
        boolean: false,
    }

    break_words.forEach(word => {
        if (((content === word) && sentence.sentence.split(" ").length > 3)) {

            return_condition.boolean = true
            return_condition.word = word
        }
    })

    return false



}
