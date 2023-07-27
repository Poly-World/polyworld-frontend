import React from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import LoginSignupTitle from '../ui/public/LoginSignupTitle';
import LoginSignupInputForm from '../ui/public/LoginSignupInputForm';
import LoginErrorMessage from '../ui/Login/LoginErrorMessage';
import LoginSignupButton from '../ui/public/LoginSignupButton';
import SignupButton from '../ui/Signup/SignupButton';
import PasswordInputForm from '../ui/public/PasswordInputForm';
import userAPI from '../../apis/userAPI';

import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();

  const checkLogin = async () => {
    await userAPI
      .post('/login', {
        user_email: 'rrr@naver.com',
        user_pwd: 'passwordddd',
      }) //추가
      .then((res) => {
        console.log(res);
        Swal.fire({
          title: `반갑습니다!`,
          confirmButtonColor: '#0e72ed',
        });
        navigate('/three');
      })
      .catch((err) => {
        console.log('포스트 요청 에러', err);
        Swal.fire({
          title: `아이디 또는 패스워드를 확인해주세요!`,
          confirmButtonColor: '#0e72ed',
        });
      });
  };
  return (
    <LoginContainer>
      <LoginSignupTitle />
      <Wrap>
        <LoginWrap>
          <LoginSignupInputForm text="아이디" />
          <PasswordInputForm type="password" text="비밀번호" />
          <LoginErrorMessage />
          <LoginSignupButton
            clickSubmit={() => navigate('/three/111')}
            text="로그인"
          />
          <SignupButton clickSubmit={() => navigate('/signup')} />
        </LoginWrap>
      </Wrap>
    </LoginContainer>
  );
};
const LoginContainer = styled.div`
  font-family: 'Noto Sans KR';
  font-style: normal;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Wrap = styled.div`
  width: 500px;
  height: 400px;
  max-width: 500px;
  max-height: 400px;
  min-width: 500px;
  min-height: 400px;
  background-color: white;
  border: 1px solid #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

const LoginWrap = styled.div`
  margin: 50px 150px;
`;

export default Login;
