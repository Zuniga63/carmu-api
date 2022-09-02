import { Server } from 'socket.io';
import categoryRoom from './categoryRoom';

export default function sockets(io: Server) {
  let clientsConected: number = 0;

  io.on('connection', (socket) => {
    clientsConected += 1;
    console.log('New user connected! count:%d', clientsConected);

    socket.on('disconnect', () => {
      clientsConected -= 1;
      console.log('User disconnected! count:%d', clientsConected);
    });

    categoryRoom(socket);
  });
}
