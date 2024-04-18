export function initialiseForwardSocket({
    globals, 
    forwardSocket
    
}){

    forwardSocket.on('message', (message)=>{
        console.log("forward socket message: ", message)
    })
}