import { clone, patch } from 'jsondiffpatch';
import { Server } from 'socket.io';

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Already set up');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const data = {};

  io.on('connection', (socket) => {
    socket.emit('init', data);

    socket.on('delta', (delta) => {
      patch(data, delta);
      socket.broadcast.emit('delta', delta);
    });
  });

  console.log('Setting up socket');
  res.end();
}