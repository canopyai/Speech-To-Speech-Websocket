export function generateBlinking({
    duration
}){

    // return

    const blinkHoldDur = 15;

    const blinkRatio = 1.5

    const remaingDur = duration - blinkHoldDur;

    const anaBlink = Math.floor(remaingDur / blinkRatio);
    
    const cataBlink = remaingDur - anaBlink;


    return {
        visemes: [
            {
                targets: [1],
                duration: anaBlink
            },
            // {
            //     targets: [1],
            //     duration: blinkHoldDur
            // },
            {
                targets: [0],
                duration: cataBlink
            }
            {
                targets: [0],
                duration: 50
            }
        ], 

        messageType:"blink"
        
    }



}
