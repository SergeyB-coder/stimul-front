import  client  from "socket.io-client";
import { url } from "./constants";

const socket = client(url);

export function useSocket () {
    
    return {
        socket
    }
}

