import {Server} from  "socket.io";

export const connectToSoket=(server)=>{
    const io=new Server(server);
    return io;
}

