import { forwardRef, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import userAPI from '../../../apis/userAPI';
import { useParams } from 'react-router-dom';

const FriendsModal = forwardRef((props, ref) => {
  let wrapperRef = useRef(); //모달창 가장 바깥쪽 태그를 감싸주는 역할

  const [content, setContent] = useState('');
  const roomHost = useParams().id;
  //   const email = JSON.parse(sessionStorage.getItem('isLogin'))[
  //     'LoginEmailState'
  //   ];

  console.log(roomHost);

  //   const visitData = {
  //     email: email,
  //     content: content,
  //   };

  const sendVisitList = async () => {
    console.log(content);
    // await userAPI
    //   .post(`/user/${roomHost}/guestbook`, visitData)
    //   .then((res) => {
    //     console.log(res);
    //     // Swal.fire({
    //     //   title: '회원가입 성공하셨습니다!',
    //     //   confirmButtonColor: '#0e72ed',
    //     // });
    //     window.alert('방명록 성공!');

    //     // navigate('/login');
    //   })
    //   .catch((err) => {
    //     console.log('방명록 오류', err);
    //     window.alert('방명록 실패!');
    //   });
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

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      // Enter 키를 눌렀을 때 처리할 로직을 여기에 작성합니다.
      // 예를 들어, sendVisitList() 함수를 호출하거나 다른 동작을 수행할 수 있습니다.
      // 여기서는 sendVisitList() 함수를 호출하는 예시를 보여줍니다.
      sendVisitList();
      setContent(''); // input 값을 비웁니다.
    }
  };

  return (
    <>
      {/* <Container ref={wrapperRef}> */}
      <Container>
        <Wrap>
          <IconX></IconX>
        </Wrap>

        <VisitListTitle>Search Email</VisitListTitle>

        <Content>
          <Search
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleSearchEnter}
          ></Search>
          <WrapSearch>
            <SearchResult>psung9510</SearchResult>
            <Plus></Plus>
          </WrapSearch>
        </Content>
        <VisitListTitle>Friends List</VisitListTitle>

        <Title>
          <Friend></Friend>
        </Title>
      </Container>
    </>
  );
});

const Container = styled.div`
  width: 380px;
  height: 550px;
  right: 40%;
  top: 5%;
  background-color: white;
  position: absolute;
  box-sizing: border-box;
  margin: 5% auto;
  padding: 25px 30px;
  border-radius: 20px;
  background-size: cover;
`;

const Wrap = styled.div`
  width: 100%;
  display: flex;

  align-items: end;
  justify-content: flex-end;
`;

const IconX = styled.div`
  width: 35px;
  height: 35px;
  background-image: url('/images/xicon.png');
  background-size: cover;
  margin-bottom: 10px;
`;

const WrapSearch = styled.div`
  display: flex;
  padding: 10px;
`;

const Search = styled.input`
  margin: 5px auto auto 60px;
  width: 230px;
  height: 30px;
  background-color: transparent;
  outline: none;
  border: none;
`;

const SearchResult = styled.div`
  width: 90px;
  height: 45px;
  margin-left: 60px;
  font-size: 18px;
`;

const Plus = styled.div`
cursor: pointer;
  width: 20px;
  height: 20px;
  background-image: url('/images/plusicon.png');
  background-size: cover;
  cur
`;

const VisitListTitle = styled.div`
  font-family: 'luckiest guy';
  margin-top: 10px;
  font-size: 18px;
  margin-bottom: 5px;
  color: #36363a;
`;

const Title = styled.div`
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
  height: 280px;
  background-color: transparent;
  margin-bottom: 10px;
  border-radius: 3px;
  background-image: url('/images/list.png');
  background-size: cover;
`;

const Content = styled.div`
  width: 100%;
  height: 88px;
  /* border: 1px solid #3f3e3c; */
  background-color: transparent;
  background-image: url('/images/search.png');
  background-size: cover;
`;

const Friend = styled.div`
  width: 98%;
  height: 50px;
  background-color: #cecdc2;
  /* border: 1px solid grey; */
  border-radius: 15px;
`;
export default FriendsModal;