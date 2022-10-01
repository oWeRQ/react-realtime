import io from 'socket.io-client';
import { useState, useEffect } from 'react';

let socket;

export default function Home() {
  const [author, setAuthor] = useState('Guest');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function socketInitializer() {
      if (socket)
        return;

      await fetch('/api/socket');

      if (socket)
        return;

      socket = io();

      socket.on('history', (history) => {
        setMessages(history);
      });

      socket.on('newIncomingMessage', (msg) => {
        setMessages((currentMessages) => [
          ...currentMessages,
          { author: msg.author, message: msg.message },
        ]);
      });
    };

    socketInitializer();

    return () => {
      if (socket) {
        socket.off();
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = async () => {
    socket.emit('createdMessage', { author, message });
    setMessages((currentMessages) => [
      ...currentMessages,
      { author, message },
    ]);
    setMessage('');
  };

  const handleKeypress = (e) => {
    if (e.keyCode === 13) {
      if (message) {
        sendMessage();
      }
    }
  };

  return (
    <>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            {msg.author}: {msg.message}
          </li>
        ))}
      </ul>
      <input
        size="4"
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      :
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={handleKeypress}
      />
      <button onClick={sendMessage}>Send</button>
    </>
  );
}