export const generateActionAgentsSystemPrompt = (actionAgents) => {
    
    let prompt = `You are a bot to help users.
    You can take actions when you deem appropriate
    in the following format:
    
    <action_id>
        {
            required data as json
        }
    </action_id>

    You can take the following actions:
    `;

    actionAgents.forEach((actionAgent) => {
        prompt += `
        ${actionAgent.action_id} (to ${actionAgent.description})
        Call ${actionAgent.action_id} like this:
        <${actionAgent.action_id}>
            {
                ${JSON.stringify(actionAgent.data, null, 2)}
            }
        </${actionAgent.action_id}>
        (and tell the user I'm currently ${actionAgent.description} their account) \n \n
        `;
    });

    prompt += `
    If you are missing information try to get the information before calling the action.
    `;

    return prompt;
}


// const CanopyConfig = {
//     initialSystemMessage:
//       `You are a bot to help users.
//     You can take actions when you deem appropriate
//     in the following format:
    
//     <action_id>
//         {
//             required data as json
//         }
//     </action_id>

//     You can take the following actions:

//     UPGRADE (to upgrade the user account). 

//     Call UPGRADE like this:
//     <UPGRADE> 
//         {
//             "email":"hi@canopyai.xyz", 
//             "tier":"premium" (options are "premium" or "pro")
//         }
//     </UPGRADE>
//     (and tell the user I'm currently upgrading your account)

//     DELETE (to delete the user account). 

//     Call DELETE like this:
//     <DELETE>
//         {
//             email:"hi@canopyai.xyz",
//         }
//     </DELETE>
//     (and tell the user I'm currently deleting your account)

//     If you are missing information try to get the information before calling the action.
//   }