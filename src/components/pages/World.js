import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyboardControls, Preload } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import Swal from 'sweetalert2';

//components
import EnvSky from '../ui/World/3Dcanvas/EnvSky';
import Floor from '../ui/World/3Dcanvas/Floor';
import Light from '../ui/World/3Dcanvas/Light';
import Spot from '../ui/World/3Dcanvas/Spot';
import Tree from '../ui/World/3Dcanvas/Tree';
import Road from '../ui/World/3Dcanvas/Road';
import House from '../ui/World/3Dcanvas/House';
import Pond from '../ui/World/3Dcanvas/Pond';
import Beach from '../ui/World/3Dcanvas/Beach';
import Stuff from '../ui/World/3Dcanvas/Stuff';
import Milestone from '../ui/World/3Dcanvas/Milestone';
import Portal from '../ui/World/3Dcanvas/Portal';
import HouseName from '../ui/World/3Dcanvas/HouseName';
import EnvStars from '../ui/CollectionSpace/EnvStars';
import Lamp from '../ui/World/3Dcanvas/Lamp';
import Npc from '../ui/World/3Dcanvas/Npc';
import { CharacterController } from '../ui/World/3Dcanvas/CharacterController';

// global state
import { useRecoilState, useRecoilValue } from 'recoil';
import { JoinExitState, IdRecoilState, IdState } from '../../state/UserAtom';

import RoomHonorAlert from '../layout/World/RoomHonorAlert';

import VisitListWriteModal from '../ui/Three/ui/VisitListWriteModal';

import Header from '../ui/public/Header';
import userAPI from '../../apis/userAPI';
import FriendsModal from '../ui/public/FriendsModal';

import LoadingSpinner from '../ui/public/LoadingSpinner';
import AudioPlayer from '../ui/public/AudioPlayer';
import { keyframes, styled } from 'styled-components';
import NpcTalkModal from '../layout/World/NpcTalkModal';

export const Controls = {
  forward: 'forward',
  back: 'back',
  left: 'left',
  right: 'right',
  jump: 'jump',
};

const World = () => {
  //route
  const navigate = useNavigate();
  const roomName = useParams().id;
  const canvasRef = useRef();
  const containerRef = useRef();
  const glRef = useRef();
  //state
  const [myPlayer, setMyPlayer] = useState({});
  const [isCollectionVisible, setIsColletionVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [friend, setFriend] = useState(false);
  const [selectRoom, setSelectRoom] = useState();
  const [flag, setFlag] = useState(true);
  const [friendsInfo, setFriendsInfo] = useState();
  const [showOverlay, setShowOverlay] = useState(false);

  const [npcTalk, setNpcTalk] = useState(false);

  useEffect(() => {
    if (npcTalk === true) {
      setNpcTalk(true);
    } else {
      setNpcTalk(false);
    }
  }, [npcTalk]);

  const playTransitionSound = (link) => {
    const audio = new Audio('/musics/doorsound.mp3');

    audio.play();
  };
  const randomMapSound = () => {
    setShowOverlay(true);
    const audio = new Audio('/musics/beachsound.mp3');

    audio.addEventListener('ended', () => {
      setShowOverlay(false);
      getRandomUser();
    });
    audio.play();
  };

  const fadeIn = {
    hidden: { opacity: 0 }, // 초기 상태
    visible: { opacity: 1 }, // 최종 상태
  };

  const [friendModalOpen, setFriendModalOpen] = useState(false);
  //globalState
  const joinExit = useRecoilValue(JoinExitState);
  const recoilLoginId = useRecoilValue(IdRecoilState);
  const loginId = useRecoilValue(IdState);

  //spots
  const mySpot = { x: 3.2, y: 0.005, z: -8.1 };
  const waveSpot = { x: 35, y: 0.005, z: 4.5 };

  const aspectRatio = window.innerWidth / window.innerHeight;

  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
      { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
      { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
      { name: Controls.jump, keys: ['Space'] },
    ],
    []
  );

  const userId = recoilLoginId;

  const enterRandomMap = () => {
    Swal.fire({
      title: '파도타기 맵에 입장하시겠습니까?',
      confirmButtonColor: '#0e72ed',
    }).then((result) => {
      if (result.isConfirmed) {
        randomMapSound();
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (recoilLoginId !== 0) {
      try {
        const response = await userAPI.get(`/user/${recoilLoginId}/content`);

        console.log('서버 응답:', response.data);
        setSelectRoom(response.data.userHouseNum);
        setFriendsInfo(response.data.friendsInfoArray);

        // 성공적으로 게시물을 생성한 후에 추가적인 처리를 할 수 있습니다.
      } catch (error) {
        console.error('서버 오류:', error);
      }
    } else {
      try {
        const response = await userAPI.get(`/user/${loginId}/content`);

        console.log('서버 응답:', response.data);
        setSelectRoom(response.data.userHouseNum);
        setFriendsInfo(response.data.friendsInfoArray);

        // 성공적으로 게시물을 생성한 후에 추가적인 처리를 할 수 있습니다.
      } catch (error) {
        console.error('서버 오류:', error);
      }
    }
  };

  const getRandomUser = async (e) => {
    // e.preventDefault();
    navigate('/collectionspace_two/64d4525623aa8d0d3a048e2f');

    // try {
    //   const response = await userAPI.get(`user/${loginId}/surfing`);

    //   // console.log('서버 응답:', response.data);
    //   const id = response.data._id;
    //   const num = response.data.houseNum;
    //   const nickname = response.data.nickname;
    //   if (num === 1) {
    //     navigate(`/collectionspace/${id}?nickname=${nickname}`);
    //   } else if (num === 2) {
    //     navigate(`/collectionspace_two/${id}?nickname=${nickname}`);
    //   } else if (num === 3) {
    //     navigate(`/collectionspace_three/${id}?nickname=${nickname}`);
    //   }

    //   // 성공적으로 게시물을 생성한 후에 추가적인 처리를 할 수 있습니다.
    // } catch (error) {
    //   console.error('서버 오류:', error);
    // }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  useEffect(() => {
    if (friend === true) {
      setFriendModalOpen(true);
    } else {
      setFriendModalOpen(false);
    }
  }, [friend]);

  // 친구 집 위치 저장
  const friendsSpots = [
    { x: -17, y: 0.005, z: 15 },
    { x: -11.7, y: 0.005, z: 5.5 },
    { x: -4.4, y: 0.005, z: -6.8 },
    { x: -10, y: 0.005, z: -4 },
    { x: 10, y: 0.005, z: -2.7 },
  ];

  console.log(friendsInfo);

  useEffect(() => {
    //내 집
    if (
      Math.abs(mySpot.x - myPlayer.x) < 1 &&
      Math.abs(mySpot.z - myPlayer.z) < 1
    ) {
      if (selectRoom === 1) {
        navigate(`/collectionspace/${loginId}`);
        playTransitionSound();
      } else if (selectRoom === 2) {
        navigate(`/collectionspace_two/${loginId}`);
        playTransitionSound();
      } else if (selectRoom === 3) {
        navigate(`/collectionspace_three/${loginId}`);
        playTransitionSound();
      }
    }

    //친구 집
    for (let i = 0; i < friendsSpots.length; i++) {
      if (
        Math.abs(friendsSpots[i].x - myPlayer.x) < 1 &&
        Math.abs(friendsSpots[i].z - myPlayer.z) < 1
      ) {
        const num = friendsInfo[i]?.houseNum;
        const id = friendsInfo[i]?._id;
        const nickname = friendsInfo[i]?.nickname;
        if (num) {
          if (num === 1) {
            navigate(`/collectionspace/${id}?nickname=${nickname}`);
            playTransitionSound();
          } else if (num === 2) {
            navigate(`/collectionspace_two/${id}?nickname=${nickname}`);
            playTransitionSound();
          } else if (num === 3) {
            navigate(`/collectionspace_three/${id}?nickname=${nickname}`);
            playTransitionSound();
          }
        }
        break;
      }
    }
    // 파도타기 집
    if (
      Math.abs(waveSpot.x - myPlayer.x) < 1 &&
      Math.abs(waveSpot.z - myPlayer.z) < 1 &&
      flag
    ) {
      enterRandomMap();
      setFlag(false);
    }
  }, [myPlayer]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 1.5 }} // 이동 시간 설정
      variants={fadeIn} // 애니메이션 variant
    >
      {showOverlay && <ShrinkingOverlay className="active" />}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          background: '#000',
        }}
      >
        <KeyboardControls map={map}>
          <Suspense fallback={null}>
            <Canvas
              ref={canvasRef}
              gl={{ antialias: true }}
              shadows={{
                enabled: true,
                autoUpdate: true,
                type: THREE.PCFSoftShadowMap,
              }}
              camera={{
                fov: 42,
                aspect: aspectRatio,
                near: 0.1,
                far: 1000,
                position: [0, 10, 25],
              }}
            >
              <EnvSky />
              <EnvStars />
              <Light />
              <Spot spot={mySpot} />
              <Spot spot={friendsSpots[0]} />
              <Spot spot={waveSpot} />
              <Portal friendsInfo={friendsInfo} />
              <HouseName friendsInfo={friendsInfo} />
              <Physics>
                <Beach />
                <Pond />
                <Road />
                <Milestone />
                <Stuff />
                <House />
                <Tree />
                <Lamp />
                <Floor />
                <Npc
                  myPlayer={myPlayer}
                  setNpcTalk={setNpcTalk}
                  npcTalk={npcTalk}
                />
                <CharacterController
                  setMyPlayer={setMyPlayer}
                  friendModalOpen={friendModalOpen}
                  npcTalk={npcTalk}
                />
              </Physics>
              <Preload all />
            </Canvas>
            <RoomHonorAlert text="방향키를 조작해 자유롭게 이동해보세요!" />
          </Suspense>
          <AudioPlayer src="/musics/pongdang.mp3" />
        </KeyboardControls>
        <Header setFriend={setFriend} />
        {npcTalk && <NpcTalkModal setNpcTalk={setNpcTalk} />}
        {friendModalOpen && (
          <FriendsModal
            setFriendModalOpen={setFriendModalOpen}
            setFriend={setFriend}
            friendsInfo={friendsInfo}
            setFriendsInfo={setFriendsInfo}
          />
        )}
      </div>
    </motion.div>
  );
};

const shrinkIn = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0);
  }
`;

const ShrinkingOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 200vw;
  height: 200vw;
  background-color: black;
  border-radius: 50%;
  transform: scale(1);
  transform-origin: center center;
  animation: ${shrinkIn} 1s forwards;
  z-index: 1000;
`;

export default World;
