import { handleVoice } from "./configVoice.js"
import { handleVisual } from "./configVisual.js"
import { handleInitialSystemMessage } from "./configInitialSystemMessage.js"

export const handleConfig = ({
    globals, 
    data
}) => {

    handleVoice({
        globals, 
        data
    })

    handleVisual({
        globals, 
        data
    })

    handleInitialSystemMessage({
        globals, 
        data
    })

}