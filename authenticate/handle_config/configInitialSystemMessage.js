export const handleInitialSystemMessage = ({
    globals,
    data
}) => {

    const { initialSystemMessage } = data;
    console.log("handling initialSystem Message", initialSystemMessage)


    if (initialSystemMessage) {
        globals.mainThread.push({
            role: "system",
            content: initialSystemMessage
        })
    }

}