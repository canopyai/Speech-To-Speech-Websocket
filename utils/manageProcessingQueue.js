import fs from "fs"


export const manageProcessingQueue = ({
    processingQueue,
    globals,
    ws
}) => {


    const maxAge = 5000;

    let i = 0;
    while (i < processingQueue.length) {
        if (Date.now() - processingQueue[i].timestamp >= maxAge) {
            processingQueue.splice(i, 1);
        } else {
            i++;
        }
    }

    if (processingQueue.length && processingQueue[0].forwardData) {


        processingQueue.sort((a, b) => {
            return a.timestamp - b.timestamp;
        });

        const { forwardData } = processingQueue[0];


        const { emotionSequences, isFirstChunk, headVisemes, headBrowVisemes, visemes } = forwardData;

        let curDur = visemes.reduce((acc, cur) => {
            return acc + cur.duration
        })

        if(!globals.sentItemsDurs){
            globals.sentItemsDurs = []
        }

        globals.sentItemsDurs.push({curDur, timestamp: Date.now()})

        

        if (forwardData) {
            let bodyVisemes = headVisemes;
            //call math.random 10 times

            let btargets = [Math.random(), Math.random(), Math.random(), Math.random(),Math.random(), Math.random(), Math.random(), Math.random(),Math.random(), Math.random()]

            console.log("bodyVisemes", bodyVisemes)

            const bodyObject = {
                messageType: "bodyMovements",
                visemes: [{
                    targets:btargets, 
                    duration:300
                }]
            }
    
    

            if (isFirstChunk) {
                globals.forwardSocket.ws.send(JSON.stringify({
                    messageType: "clearQueue",
                    conversationIndex: globals.conversationIndex
                }));
            }


            const emotionAnimationData = {
                messageType: "emotionsNonSpeaking",
                visemes: [{
                    targets: [0, 0, 0, 0, 0, 0, 0, 0],
                    duration: 300
                }],
            };


            globals.forwardSocket.ws.send(JSON.stringify(emotionAnimationData));
            const SemotionAnimationData = {
                messageType: "emotions",
                visemes: [{
                    targets: [0, 0, 0, 0, 0, 0, 0, 0],
                    duration: 300
                }],
            };


            globals.forwardSocket.ws.send(JSON.stringify(SemotionAnimationData));
            globals.forwardSocket.ws.send(JSON.stringify(bodyObject));
            console.log("sent body movements")
            globals.forwardSocket.ws.send(JSON.stringify(forwardData));



            if (!globals.lastNonSpeakingTimestamp) {
                globals.lastNonSpeakingTimestamp = Date.now()
            }

            if (Date.now() > globals.lastNonSpeakingTimestamp) {
                globals.lastNonSpeakingTimestamp = Date.now()
            } 
            
            let totalDurs = 0;

            setTimeout(()=>{

                if(!globals.sentItemsDurs){
                    globals.sentItemsDurs = []
                }

                //add all durations in last 3 seconds
                totalDurs = globals.sentItemsDurs.reduce((acc, cur)=>{
                    if(Date.now()-cur.timestamp<3000){
                        return acc + cur.curDur
                    }else{
                        return acc
                    }
                }, 0)

            }, 2000)

            if (globals.isEmotionCycleSet) {
               
            

                setTimeout(() => {
                    //check if user is still speaking 
                    globals.isEmotionCycleSet = false;
                    globals.forwardSocket.ws.send(JSON.stringify({
                        messageType: "emotionsNonSpeaking",
                        visemes: [{
                            targets: [0, 0, 0, 0, 0, 0, 0, 0],
                            duration: 100
                        }]
                    }));
                }, 500)


            }










            globals.frontendSocket.ws.send(JSON.stringify(forwardData));




            processingQueue.shift();
            if(processingQueue.length==1){
                setTimeout(()=>{
                    const emotionAnimationData = {
                        messageType: "emotionsNonSpeaking",
                        visemes: [{
                            targets: [1, 0, 0, 0, 0, 0, 0, 0],
                            duration: 300
                        }],
                    };
                    
                    // globals.forwardSocket.ws.send(JSON.stringify(emotionAnimationData));
                }, totalDurs)

    
            }

        }
    }
}
