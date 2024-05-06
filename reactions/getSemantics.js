export async function getSemantics(messages) {
    const url = "http://34.90.246.127:8080"; // Replace with the appropriate URL

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

        const data = await response.text();

        globals.frontendSocket.ws.send(JSON.stringify({
            messageType: "empathy",
            latency: endSem - startSem,
        }))
    
    
        globals.emotions.semantics = data;
    } catch (error) {
        console.error(`Error posting messages: ${error}`);
    }
}


