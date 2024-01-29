export const handleLLM = ({
    globals, 
    data
}) => {
    const {LLM} = data;
    globals.LLM = LLM;
}