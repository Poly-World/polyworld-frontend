import { styled } from 'styled-components';
import SearchBox from '../ui/MapList/SearchBox';

const MapList = () => {
  return (
    <Container>
      <Header>
        <SearchBox />
        <AlarmIcon>
          <img src="/images/alarm.png" alt="" />
        </AlarmIcon>
        <LoginNickname>UUGEEN</LoginNickname>
      </Header>
    </Container>
  );
};

const Container = styled.div`
  padding: 30px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const AlarmIcon = styled.div`
  width: 60px;
  height: 60px;
  margin-right: 25px;
  img {
    width: 100%;
    height: 100%;
  }
`;

const LoginNickname = styled.div`
  display: flex;
  margin-right: 20px;
  color: gray;
  padding-top: 20px;
  font-size: 30px;
`;

export default MapList;
