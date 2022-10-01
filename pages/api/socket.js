import { Server } from 'socket.io';

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Already set up');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const history = [];

  io.on('connection', (socket) => {
    socket.emit('history', history);
    socket.on('createdMessage', (msg) => {
      history.push(msg);
      socket.broadcast.emit('newIncomingMessage', msg);
    });
  });

  console.log('Setting up socket');
  res.end();
}