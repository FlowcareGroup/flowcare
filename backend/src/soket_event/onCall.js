import { io } from "../../index.js";

; // Ajusta la ruta a tu archivo 'server.js'

const onCall = (participants) => {

    
    
    if (participants.receiver.socketId) {
        io.to(participants.receiver.socketId).emit(
            "incomingCall", 
            participants
        );
    } else {
        console.error("No se encontró socketid para el receptor.");
    }
};

export default onCall;