export const getAnimationData = async ({
    TTSSentence
}) => {
    console.log("TTSSentence", TTSSentence)
    try {
        const remoteUrl = "http://34.32.228.101:8080/generate_animation";
        const url = new URL(remoteUrl);
        url.searchParams.append('text', TTSSentence);

        const response = await fetch(url);
        const data = await response.json();

        console.log("fetched data", data);
    } catch (error) {
        console.error("An error occurred:", error);
    }
};