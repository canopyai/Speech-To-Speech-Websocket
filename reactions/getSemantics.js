export async function getSemantics({last3Messages, globals}) {
    console.log("last3Messages", last3Messages)
    const url = "http://34.91.168.188:8080/classify"; // Replace with the appropriate URL
    console.log("attempting to get semantics")
    const startSem = Date.now();
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({messages:last3Messages})
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.text();
        data = JSON.parse(data);


        globals.frontendSocket.ws.send(JSON.stringify({
            messageType: "empathy",
            latency: Date.now() - startSem,
        }))


    
    
        globals.emotions.semantics = data;

        return data
    } catch (error) {
        console.error(`Error posting messages: ${error}`);
    }
}


