import { useEffect, useRef, useState } from 'react';
import RButton from '../components/RButton';
import RInput from '../components/RInput';
import str2color from '../functions/str2color';
import uniqId from '../functions/uniqId';
import useStorage from '../functions/useStorage';
import messagesReducer from '../functions/messagesReducer';
import styles from './Chat.module.css';

const authorColor = str2color(18, 80, 30);

export default function Chat({ state, setState }) {
  const dispatch = action => {
    setState(state => messagesReducer(state, action));
  };

  const contentRef = useRef();
  const [author, setAuthor] = useStorage('username', () => 'Guest ' + uniqId());
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Change you nickname');
  const messages = state.messages || [];

  useEffect(() => {
    contentRef.current.scrollTop = contentRef.current.scrollTopMax;
  }, [state.messages]);

  const sendMessage = () => {
    if (!message)
      return;

    const payload = { author, message };
    dispatch({
      type: 'addMessage',
      payload,
    });
    setMessage('');
  };

  const handleKeypress = e => {
    if (e.keyCode === 13) {
      sendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content} ref={contentRef}>
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
          placeholder="Nickname"
          className={styles.authorInput}
          value={author}
          onChange={setAuthor}
          style={{ color: authorColor(author) }}
        />
        <RInput
          placeholder="Message"
          className={styles.messageInput}
          value={message}
          onChange={setMessage}
          onKeyUp={handleKeypress}
        />
        <RButton className={styles.send} onClick={sendMessage}>Send</RButton>
      </div>
      <div className={styles.statusBar}>
        {status}
      </div>
    </div>
  );
}