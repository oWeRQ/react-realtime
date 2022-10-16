import { useState } from 'react';
import uniqId from '../functions/uniqId';
import useStorage from '../functions/useStorage';

export default function Chat({ state, dispatch }) {
  const [author, setAuthor] = useStorage('username', 'Guest ' + uniqId());
  const [message, setMessage] = useState('');
  const messages = state.messages || [];

  const sendMessage = async () => {
    const payload = { author, message };
    dispatch({
      type: 'addMessage',
      payload,
    });
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
    <div>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>
            {msg.author}: {msg.message}
          </li>
        ))}
      </ul>
      <input
        size="8"
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      :
      <input
        size="16"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={handleKeypress}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}