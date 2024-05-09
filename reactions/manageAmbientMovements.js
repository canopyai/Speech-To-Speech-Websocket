import { generateAmbientHeadMovements } from "./generateAmbientHeadMovements.js"

export function manageAmbientMovements({
    globals
}) {


    if(globals.forwardSocket){
        const overAllDuration = 600000
        const movements = generateAmbientHeadMovements({
            duration:overAllDuration, 
            globals
        })
    
        globals.forwardSocket.ws.send(JSON.stringify(movements))
    } else {
        setTimeout(()=>{
            manageAmbientMovements({
                globals
            })
        }, 500)
     
    }
  


}