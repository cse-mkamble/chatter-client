import React, { useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import useSound from 'use-sound';
import config from '../../../config';
import LatestMessagesContext from '../../../contexts/LatestMessages/LatestMessages';
import TypingMessage from './TypingMessage';
import Header from './Header';
import Footer from './Footer';
import Message from './Message';
import cx from 'classnames';
import '../styles/_messages.scss';

const socket = io(
  config.BOT_SERVER_ENDPOINT,
  { transports: ['websocket', 'polling', 'flashsocket'] }
);

function Messages() {
  const [playSend] = useSound(config.SEND_AUDIO_URL);
  const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const { setLatestMessage } = useContext(LatestMessagesContext);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [nextMessages, setNextMessages] = useState([]);

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    const messageObject = {
      user: 'other',
      message: "Hi! My name's Botty.",
      id: 0,
    };
    const NextMessageObject = {
      user: 'me'
    };
    setMessageList((list) => [...list, messageObject]);
    setNextMessages(NextMessageObject);
    playReceive();
    setMessage("");
  }, []);

  useEffect(() => {

    socket.on("bot-message", (message) => {
      const messageObject = {
        user: 'other',
        message: message,
        id: 0,
      };
      const NextMessageObject = {
        user: 'me'
      };
      setMessageList((list) => [...list, messageObject]);
      setNextMessages(NextMessageObject);
      playReceive();
    });

  }, []);

  function onChangeMessage(e) {
    setMessage(e.target.value);
  }

  const sendMessage = (e) => {
    socket.emit("user-message", message)
    const messageObject = {
      user: 'me',
      message: message,
      id: 1,
    };
    const NextMessageObject = {
      user: 'other'
    };
    setMessageList((list) => [...list, messageObject]);
    setNextMessages(NextMessageObject);
    setMessage("");
    playSend();
  }

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        {messageList.map((messageContent) => (
          <Message message={messageContent} nextMessage={nextMessages} />
        ))}
      </div>
      <Footer message={message} sendMessage={sendMessage} onChangeMessage={onChangeMessage} />
    </div>
  );
}

export default Messages;
