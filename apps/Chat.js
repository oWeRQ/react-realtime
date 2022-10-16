import { useState } from 'react';
import RButton from '../components/RButton';
import RInput from '../components/RInput';
import str2color from '../functions/str2color';
import uniqId from '../functions/uniqId';
import useStorage from '../functions/useStorage';
import styles from './Chat.module.css';

const authorColor = str2color(18, 80, 30);

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
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.messageList}>
          {messages.map((msg, i) => (
            <div key={i} className={styles.message}>
              <div className={styles.messageAuthor} style={{ color: authorColor(msg.author) }}>
                {msg.author}
              </div>
              <div className={styles.messageText}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <RInput
          className={styles.authorInput}
          value={author}
          onChange={setAuthor}
          style={{ color: authorColor(author) }}
        />
        <RInput
          className={styles.messageInput}
          value={message}
          onChange={setMessage}
          onKeyUp={handleKeypress}
        />
        <RButton className={styles.send} onClick={sendMessage}>Send</RButton>
      </div>
    </div>
  );
}