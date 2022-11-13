import { patch } from 'jsondiffpatch';
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
    console.log('connection', socket.id);
    let code;

    socket.on('code', (_) => {
      code = _; 
      
      if (typeof data[code] !== 'object') {
        data[code] = {};
      }
      
      socket.emit('init', data[code]);
      socket.join(code);
    });

    socket.on('delta', (delta) => {
      if (delta) {
        console.log('delta', JSON.stringify(delta));
        patch(data[code], delta);
        socket.to(code).emit('delta', delta);
      }
    });
  });

  console.log('Setting up socket');
  res.end();
}