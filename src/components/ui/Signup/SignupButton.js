import React from 'react';
import styled from 'styled-components';

const SignupButton = ({ clickSubmit }) => {
  return <SignupBtn onClick={clickSubmit}>SIGN UP</SignupBtn>;
};

const SignupBtn = styled.div`
  width: 55px;
  height: 15px;
  display: flex;
  font-family: 'luckiest guy';

  align-items: center;
  justify-content: center;
  margin: 15px auto 10px;
  font-size: 15px;
  color: gray;
  cursor: pointer;
  &:hover {
    border-bottom: 1px solid gray;
  }
`;

export default SignupButton;
