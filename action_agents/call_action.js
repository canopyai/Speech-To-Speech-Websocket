import axios from 'axios';

export const callActionAgent = async (action, data, endpoint) => {
    try {

        const response = await axios.post(endpoint, {
            action,
            data
        });

        console.log("responseJson: ", response.data);

        return { success: true, data: response.data };

    } catch (error) {
        return { success: false, data: error }
    }
}