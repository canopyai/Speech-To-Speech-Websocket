export const getAnimationData = async ({
    TTSSentence
}) => {
    console.log("getAnimationData", TTSSentence)
    try {
        const remoteUrl = "http://34.32.228.101:8080/generate_animation";
        const url = new URL(remoteUrl);
        url.searchParams.append('text', TTSSentence);

        console.log("url", url)

        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // or response.json() if your server responds with JSON
        })
        .then(data => {
            console.log(data);
        })
    } catch (error) {
        console.error("An error occurred:", error);
    }
};