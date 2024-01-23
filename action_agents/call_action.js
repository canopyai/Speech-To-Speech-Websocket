import axios from 'axios';

export const callActionAgent = async (action, data, endpoint) => {
    try {

        const response = await axios.post(endpoint, {
            action,
            data
        });

        console.log("responseJson: ", response.data);

        return response.data;
        
    } catch (error) {
        console.error("Error calling action agent:", error);
        throw error;
    }
}