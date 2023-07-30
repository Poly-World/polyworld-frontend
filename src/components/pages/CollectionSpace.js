import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { useState, useEffect, useRef, Suspense } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import EnvSky from '../ui/CollectionSpace/EnvSky';
import EnvStars from '../ui/CollectionSpace/EnvStars';
import Floor from '../ui/CollectionSpace/Floor';
import Light from '../ui/CollectionSpace/Light';
import Wall from '../ui/CollectionSpace/Wall';
import Player from '../ui/CollectionSpace/Player';
import ImageFrame from '../ui/CollectionSpace/ImageFrame';
import World from './World';
import Spot from '../ui/World/3Dcanvas/Spot';

const CollectionSpace = () => {
  const aspect = window.innerWidth / window.innerHeight;
  const doorSpot = { x: 0, y: 0.005, z: 2 };
  const roomName = useParams().id;
  const navigate = useNavigate();

  const [isCollectionVisible, setIsColletionVisible] = useState(false);

  const [myPlayer, setMyPlayer] = useState({});
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (
      Math.abs(doorSpot.x - myPlayer.x) < 1.5 &&
      Math.abs(doorSpot.z - myPlayer.z) < 1.5
    ) {
      setIsColletionVisible(true);
      navigate('/world');
    } else {
      setIsColletionVisible(false);
    }
  }, [doorSpot]);
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: '#000',
      }}
    >
      <Suspense fallback={null}>
        <Canvas
          gl={{ antialias: true }}
          shadows={{
            enabled: true,
            autoUpdate: true,
            type: THREE.PCFSoftShadowMap,
          }}
          camera={{
            fov: 50,
            aspect: aspect,
            near: 0.1,
            far: 100,
            position: [2, 2, 0],
            zoom: 0.5,
          }}
        >
          <EnvSky />
          <EnvStars />
          <Light />
          <Floor />
          <Wall />
          <Spot spot={doorSpot} />

          <ImageFrame />
          <Player
            roomName={roomName}
            setMyPlayer={setMyPlayer}
            setIsLocked={setIsLocked}
            isLocked={isLocked}
          />
        </Canvas>
      </Suspense>
      <CrossHair isLocked={isLocked} />
    </div>
  );
};
const CrossHair = styled.div`
  ${({ isLocked }) => {
    return css`
      position: fixed;
      top: 50%;
      left: 50%;
      width: 2px;
      height: 2px;
      background: #f00;
      border: 10px solid #fff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      visibility: ${isLocked
        ? 'visible'
        : 'hidden'}; // initial visibility is hidden
    `;
  }}
`;

export default CollectionSpace;
