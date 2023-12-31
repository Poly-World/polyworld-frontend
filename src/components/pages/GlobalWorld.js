import { useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { styled, keyframes, css } from 'styled-components';
import gsap from 'gsap';
import Spot from '../ui/World/3Dcanvas/Spot';
import Game from '../ui/Three/3Dcanvas/Game';
import HouseOne from '../ui/GlobalWorld/3Dcanvas/HouseOne';
import HouseTwo from '../ui/GlobalWorld/3Dcanvas/HouseTwo';
import HouseThree from '../ui/GlobalWorld/3Dcanvas/HouseThree';
import HouseFour from '../ui/GlobalWorld/3Dcanvas/HouseFour';

import Portal from '../ui/GlobalWorld/3Dcanvas/Portal';

const Floor = () => {
  const floorTexture = useLoader(THREE.TextureLoader, '../images/grid.png');
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.x = 10;
  floorTexture.repeat.y = 10;

  return (
    <mesh castShadow receiveShadow name="floor" rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial map={floorTexture} transparent opacity={0} />
    </mesh>
  );
};

let isPressed = false;
const mouse = new THREE.Vector2();
const destinationPoint = new THREE.Vector3();
let angle = 0;
useGLTF.preload('../models/ilbuni.glb');
const Player = () => {
  const glb = useGLTF('../models/ilbuni.glb');
  const playerMesh = glb.scene.children[0];
  playerMesh.position.y = 3;
  const three = useThree();

  const mixer = new THREE.AnimationMixer(playerMesh);
  const actions = [
    mixer.clipAction(glb.animations[0]),
    mixer.clipAction(glb.animations[1]),
  ];
  playerMesh.userData.animations = actions;
  console.log(playerMesh.userData.animations);

  const checkIntersects = () => {
    const floorMesh = three.scene.getObjectByName('floor');
    const pointerMesh = three.scene.getObjectByName('pointerMesh');

    const intersects = three.raycaster.intersectObject(floorMesh);

    if (!playerMesh) return;
    for (const item of intersects) {
      if (item.object.name === 'floor') {
        destinationPoint.x = item.point.x;
        destinationPoint.y = 3;
        destinationPoint.z = item.point.z;
        playerMesh.lookAt(destinationPoint);

        playerMesh.userData.moving = true;

        pointerMesh.position.x = destinationPoint.x;
        pointerMesh.position.z = destinationPoint.z;
      }
      break;
    }
  };

  const raycasting = () => {
    three.raycaster.setFromCamera(mouse, three.camera);
    checkIntersects();
  };

  const calculateMousePosition = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  };

  useEffect(() => {
    glb.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
    // const mixer = new THREE.AnimationMixer(playerMesh);
    // const actions = [
    //   mixer.clipAction(glb.animations[0]),
    //   mixer.clipAction(glb.animations[1]),
    // ];
    const handlePointerDown = (e) => {
      isPressed = true;
      calculateMousePosition(e);
    };
    const handlePointerMove = (e) => {
      calculateMousePosition(e);
    };
    const handlePointerUp = () => {
      isPressed = false;
    };

    three.gl.domElement.addEventListener('pointerdown', handlePointerDown);
    three.gl.domElement.addEventListener('pointermove', handlePointerMove);
    three.gl.domElement.addEventListener('pointerup', handlePointerUp);
    return () => {
      isPressed = false;
      three.gl.domElement.removeEventListener('pointerdown', handlePointerDown);
      three.gl.domElement.removeEventListener('pointermove', handlePointerMove);
      three.gl.domElement.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);
  useFrame((state, delta) => {
    if (!playerMesh) return;
    // TODO 이곳에서 이동로직 처리
    mixer.update(delta);

    if (isPressed) {
      raycasting();
    }
    if (playerMesh.userData.moving) {
      angle = Math.atan2(
        destinationPoint.z - playerMesh.position.z,
        destinationPoint.x - playerMesh.position.x
      );
      playerMesh.position.x += Math.cos(angle) * 0.05;
      playerMesh.position.z += Math.sin(angle) * 0.05;

      three.camera.position.x = 1 + playerMesh.position.x;
      three.camera.position.z = 5 + playerMesh.position.z;

      playerMesh.userData.animations[0].stop();
      playerMesh.userData.animations[1].play();

      if (
        Math.abs(destinationPoint.x - playerMesh.position.x) < 0.03 &&
        Math.abs(destinationPoint.z - playerMesh.position.z) < 0.03
      ) {
        playerMesh.userData.moving = false;
        // console.log('멈춤');
      }
    } else {
      // 서 있는 상태
      playerMesh.userData.animations[0].play();
      playerMesh.userData.animations[1].stop();
    }
    // console.log(playerMesh);
  });
  return <primitive name={'character'} object={glb.scene} dispose={null} />;
};

const PointerCircle = () => {
  return (
    <mesh
      receiveShadow
      castShadow
      name="pointerMesh"
      position={[0, 0.01, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <circleGeometry args={[1, 32]} />
      <meshStandardMaterial color={'yellow'} transparent opacity={0.8} />
    </mesh>
  );
};

// Light를 별도의 컴포넌트로 분리했다.
const LightComponent = () => {
  const three = useThree();
  const lightRef = useRef();
  useEffect(() => {
    const light = lightRef.current;
    if (light) {
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.shadow.camera.left = -100;
      light.shadow.camera.right = 100;
      light.shadow.camera.top = 100;
      light.shadow.camera.bottom = -100;
      light.shadow.camera.near = -100;
      light.shadow.camera.far = 100;
    }
  }, []);
  return (
    <>
      <ambientLight color={'white'} intensity={0.7} />
      <directionalLight ref={lightRef} castShadow position={[3, 3, 3]} />;
    </>
  );
};

const GlobalWorld = () => {
  const roomName = useParams().id;
  const navigate = useNavigate();
  const gameSpot = { x: 5, y: 0.005, z: 5 };

  // 모달창 상태 관리
  const [modalOpen, setModalOpen] = useState(false);
  const aspectRatio = window.innerWidth / window.innerHeight;
  // 모달창 노출
  const showModal = () => {
    if (modalOpen === true) {
      setModalOpen(false);
    } else {
      setModalOpen(true);
    }
  };
  useEffect(() => {}, []);
  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: '#000',
      }}
    >
      <Canvas
        gl={{ antialias: true }}
        shadows={{
          enabled: true,
          autoUpdate: true,
          type: THREE.PCFSoftShadowMap,
        }}
        orthographic
        camera={{
          zoom: 60,
          position: [0, 5, 5],
          left: -1 * aspectRatio,
          right: 1 * aspectRatio,
          top: 1,
          bottom: -1,
          near: -1000,
          far: 1000,
        }}
      >
        <Floor />
        {/* <Portal /> */}
        <HouseOne />
        <HouseThree />
        <HouseFour />
        <Spot spot={gameSpot} />
        <LightComponent />
        <PointerCircle />
        <Suspense fallback={null}>
          <Player />
        </Suspense>
      </Canvas>
      {/* <HomeICon
        onClick={() => {
          navigate('/maplist');
        }}
      >
        <img src="/images/magnifier.png" alt="" />
      </HomeICon>
      <PostBox onClick={showModal}>
        <img src="/images/postbox.png" alt="" />
      </PostBox> */}
    </div>
  );
};

const rotationAnimation = keyframes`
    from {
        transform: rotate(-5deg);
    } to{
        transform: rotate(5deg);
    }
`;

const HomeICon = styled.div`
  animation: ${rotationAnimation} 1s linear infinite alternate;
  position: absolute;
  cursor: pointer;
  left: 1%;
  bottom: 1%;
  width: 90px;
  height: 90px;
  margin: 60px;
  img {
    width: 100%;
    height: 100%;
  }
`;

const PostBox = styled.div`
  position: absolute;
  cursor: pointer;
  right: 5%;
  bottom: 5%;
  width: 120px;
  height: 120px;
  img {
    width: 100%;
    height: 100%;
  }
`;

const Container = styled.div`
  ${({ modalOpen }) => {
    return css`
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: ${modalOpen ? 1 : -1};
      background: ${modalOpen ? 'rgba(0, 0, 0, 0.5)' : 'transparent'};
    `;
  }}
`;

const ChatWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  color: 'white';
`;

export default GlobalWorld;
