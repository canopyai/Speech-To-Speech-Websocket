import axios from "axios";

export const authenticate = async (authToken) => {

    const { data } = await axios.post("https://us-central1-speechsdk.cloudfunctions.net/validate_jwt", {
        "token": authToken
    });


    if (data.valid) {
        return {
            success: true,
            projectId: data.payload.projectId,
            error: null
        }
    }
    
    return {
        success: false,
        projectId: null,
        error: data.error
    }
}