export const getAnimationData = async ({
    TTSSentence
}) => {
    console.log("getAnimationData", TTSSentence)
    try {
        const remoteUrl = "http://34.32.228.101:8080/generate_animation";
        const url = new URL(remoteUrl);
        url.searchParams.append('text', TTSSentence);

        const response = await fetch(url);
        console.log(response)
        const data = await response.json();
        

        console.log("fetched data", data);
    } catch (error) {
        console.error("An error occurred:", error);
    }
};