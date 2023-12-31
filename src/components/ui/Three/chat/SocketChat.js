import React, { useEffect, useState } from 'react';
import TalkBubble from './TalkBubble';

// global state
import { useRecoilState } from 'recoil';
import {
  LoginState,
  UserState,
  JoinExitState,
  UserCount,
} from '../../../../state/UserAtom';

function SocketChat({ roomName, socket }) {
  const [isLogin, setIsLogin] = useRecoilState(LoginState);
  const [myId, setMyId] = useRecoilState(UserState);
  const [joinExit, setJoinExit] = useRecoilState(JoinExitState);
  const [countUser, setCountUser] = useRecoilState(UserCount);

  const [nickName, setNickName] = useState('');
  const [sendNickName, setSendNickName] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [roomUserCount, setRoomUserCount] = useState(0);

  useEffect(() => {
    // 소켓 이벤트 핸들러 등록
    socket.on('welcome', (user, newCount) => {
      console.log(user, newCount);
      setRoomUserCount(newCount);
      setCountUser(newCount);
    });

    socket.on('bye', (left, newCount) => {
      // console.log(left, newCount);
      setRoomUserCount(newCount);
      setCountUser(newCount);
    });

    socket.on('origin_user', (data) => {
      console.log('입장, 퇴장 ', data);
      setJoinExit(data);
    });

    socket.on('new_user', (data) => {
      console.log(data);
    });

    socket.on('new_message', (message) => {
      console.log(message);

      setMessageList((prevList) => [...prevList, message]);
    });

    //이동 좌표
    socket.on('move', () => {});

    return () => {
      // 컴포넌트 언마운트 시 소켓 이벤트 핸들러 해제
      socket.off('welcome');
      socket.off('bye');
      socket.off('new_message');
    };
  }, [roomName]);

  const handleRoomSubmit = (event) => {
    event.preventDefault();
    setSendNickName(nickName);
    // console.log('닉네임', nickName);
    const data = {
      nickName: nickName,
      roomName: roomName,
    };
    setMyId(data.nickName);
    socket.emit('enter_room', data);
    setIsLogin(true);
  };

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    socket.emit('new_message', inputMessage, roomName, () => {
      setMessageList((prevList) => [...prevList, `you: ${inputMessage}`]);
      setInputMessage('');
    });
  };

  return (
    // 임시 UI
    <div>
      {sendNickName ? (
        <div>
          <ul>
            {messageList.map((message, index) => (
              <TalkBubble key={index} message={message} />
              // <li key={index}>{message}</li>
            ))}
          </ul>
          <form id="msg" onSubmit={handleMessageSubmit}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Enter your message"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      ) : (
        <div>
          <input
            type="text"
            name="name"
            placeholder="Enter your nickname"
            onChange={(e) => setNickName(e.target.value)}
          />
          <button onClick={handleRoomSubmit}>Enter Room</button>
        </div>
      )}
    </div>
  );
}

export default SocketChat;
