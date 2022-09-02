import { Server as WebSocketServer } from 'socket.io';
import http from 'http';
import app from './app';
import sockets from './sockets';

const server = http.createServer(app);
// start server
const httpServer = server.listen(app.get('port'), async (): Promise<void> => {
  console.log(`Server is running on: ${app.get('host')}`);
});

const io = new WebSocketServer(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] } });
sockets(io);
