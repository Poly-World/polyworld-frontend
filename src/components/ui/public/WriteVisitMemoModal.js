import { forwardRef, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import userAPI from '../../../apis/userAPI';
import { useParams } from 'react-router-dom';

const WriteVisitMemoModal = forwardRef((props, ref) => {
  let wrapperRef = useRef(); //모달창 가장 바깥쪽 태그를 감싸주는 역할

  const [content, setContent] = useState('');
  const roomHost = useParams().id;
  // const email = JSON.parse(sessionStorage.getItem('isLogin'))[
  //   'LoginEmailState'
  // ];

  console.log(roomHost);

  const visitData = {
    // email: email,
    content: content,
  };

  const sendVisitList = async () => {
    await userAPI
      .post(`/user/${roomHost}/guestbook`, visitData)
      .then((res) => {
        console.log(res);
        // Swal.fire({
        //   title: '회원가입 성공하셨습니다!',
        //   confirmButtonColor: '#0e72ed',
        // });
        window.alert('방명록 성공!');

        // navigate('/login');
      })
      .catch((err) => {
        console.log('방명록 오류', err);
        window.alert('방명록 실패!');
      });
  };

  // 모달 끄기
  // useEffect(() => {
  //   console.log('ddd');
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // });

  // const handleClickOutside = (event) => {
  //   if (wrapperRef && !wrapperRef.current.contains(event.target)) {
  //     props.setLetterModalOpen(false);
  //   }
  // };

  return (
    <>
      {/* <Container ref={wrapperRef}> */}
      <Container>
        <ListTitle>guest book</ListTitle>
        <VisitListTitle>Content</VisitListTitle>

        <Content onChange={(e) => setContent(e.target.value)}></Content>
        <CustomButton onClick={sendVisitList}>Write</CustomButton>
      </Container>
    </>
  );
});

const Container = styled.div`
  width: 300px;
  height: 300px;
  right: 40%;
  top: 25%;
  /* background-color: transparent; */
  position: absolute;
  box-sizing: border-box;
  margin: 5% auto;
  padding: 53px 45px;
  border-radius: 10px;
  background-image: url('/images/visitMemo.png');
  background-size: cover;
`;

const ListTitle = styled.div`
  font-family: 'luckiest guy';
  display: flex;
  justify-content: center;

  font-size: 20px;
  margin-bottom: 15px;
`;

const VisitListTitle = styled.div`
  font-family: 'luckiest guy';

  font-size: 15px;
  margin-bottom: 5px;
`;

const Title = styled.input`
  width: 100%;
  height: 30px;
  border: 1px solid #3f3e3c;
  background-color: transparent;
  margin-bottom: 10px;
  border-radius: 3px;
  outline: none;
`;

const Content = styled.textarea`
  width: 100%;
  height: 100px;
  border: 1px solid #3f3e3c;
  background-color: transparent;

  border-radius: 3px;
  outline: none;
`;

const CustomButton = styled.div`
  font-family: 'luckiest guy';

  width: 90px;
  height: 26px;
  border-radius: 27px;
  display: flex;
  margin: 15px auto auto;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  background-color: transparent;
  border: 1.2px solid black;
  cursor: pointer;
  &:hover {
    transition-duration: 0.3s;
    background-color: white;
  }
`;
export default WriteVisitMemoModal;