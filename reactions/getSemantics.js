export async function getSemantics(messages) {
    const url = "http://35.204.35.46:8080"; // Replace with the appropriate URL

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messages)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log("Messages posted successfully!");
        const data = await response.text();
        console.log(data);
    } catch (error) {
        console.error(`Error posting messages: ${error}`);
    }
}


