export const getAnimationData =  async ({
    TTSSentence
}) => {
    const remoteUrl = "http://34.32.228.101:8080/generate_animation"
    const url = new URL(remoteUrl);
    url.searchParams.append('text', TTSSentence);

    const reponse =  await fetch(url)
    const data = await reponse.json()

    print("fetched data", data)

}