export const handleVoice = ({
    globals, 
    data
}) =>{
    const {voice} = data
    globals.voice = voice; 
}