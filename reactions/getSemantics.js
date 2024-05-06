export async function getSemantics(messages) {
    const url = "http://34.91.168.188:8080"; // Replace with the appropriate URL
    console.log("attempting to get semantics")

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
        console.log(data);

        globals.frontendSocket.ws.send(JSON.stringify({
            messageType: "empathy",
            latency: endSem - startSem,
        }))
    
    
        globals.emotions.semantics = data;
    } catch (error) {
        console.error(`Error posting messages: ${error}`);
    }
}


