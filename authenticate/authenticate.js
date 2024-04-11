import axios from "axios";

export const authenticate = async (authToken) => {

    const { data } = await axios.post("https://us-central1-speechsdk.cloudfunctions.net/validate_jwt", {
        "token": authToken
    });


    if (data.valid) {
        console.log("auth success");
        return {
            success: true,
            projectId: data.payload.projectId,
            error: null
        }
    } else {
        console.log("auth failed");
        return {
            success: false,
            projectId: null,
            error: data.error
        }
    }
    
    return {
        success: false,
        projectId: null,
        error: data.error
    }
}