import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'isLogin',
  storage: sessionStorage,
});

export const UserState = atom({
  key: 'UserState',
  default: {},
});

export const LoginState = atom({
  key: 'LoginState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const LoginEmailState = atom({
  key: 'LoginEmailState',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

export const NickNameState = atom({
  key: 'NickNameState',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

export const IdState = atom({
  key: 'IdState',
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const IdRecoilState = atom({
  key: 'IdRecoilState',
  default: 0,
});

export const JoinExitState = atom({
  key: 'JoinExitState',
  default: {},
});

export const UserCount = atom({
  key: 'UserCount',
  default: 0,
});
