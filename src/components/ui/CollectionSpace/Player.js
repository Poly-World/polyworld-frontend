import React, { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

function Player({
  setMyPlayer,
  setIsLocked,
  isLocked,
  setAlbum,
  setCamera,
  setPencil,
  setVisitMemo,
  setVideoRemote,
  setShowImageEffect, // 추가
  setAlbumDetail,
}) {
  const { camera, gl, scene, clock } = useThree();

  // culling 효과 true
  camera.frustumCulled = true;
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const [isLockingDelayed, setIsLockingDelayed] = useState(false);
  // raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // player speed
  const speed = 0.1;

  // Control 움직임이 일정하게 하기 위해 매번 재할당
  const controlsRef = useRef();
  if (!controlsRef.current) {
    controlsRef.current = new PointerLockControls(camera, gl.domElement);
  }
  const controls = controlsRef.current;
  controls.pointerSpeed = 0.1;

  const checkIntersects = () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    for (const item of intersects) {
      console.log(item.object.name.length);

      if (item.object.name === "camera") {
        setCamera(true);
      }
      if (item.object.name === "pencil") {
        setPencil(true);
      }
      if (item.object.name === "visit_post") {
        setVisitMemo(true);
      }
      if (item.object.name === "Remote") {
        setVideoRemote(true);
      }
      if (item.object.name === "photoBook") {
        setShowImageEffect(true);
      }
      if (
        item.object.name !== "family_photo1_lambert9_0" &&
        item.object.name.length === 24
      ) {
        setAlbum(true);
        setAlbumDetail(item.object.name);
      }
    }
  };

  const handleClick = (e) => {
    if (isLockingDelayed) return;

    controls.lock();
    checkIntersects();
    setIsLocked(true);
  };

  const handleLock = () => {
    if (isLockingDelayed) return;
    console.log("lock!");
  };

  const handleUnlock = () => {
    console.log("unlock!");
    setIsLocked(false);
    setIsLockingDelayed(true);

    setTimeout(() => {
      setIsLockingDelayed(false);
    }, 1000);
  };
  console.log(camera.position);

  useEffect(() => {
    const keyDownHandler = (e) => {
      switch (e.code) {
        case "ArrowRight":
        case "KeyD":
          setKeys((keys) => ({ ...keys, right: true }));
          break;
        case "ArrowLeft":
        case "KeyA":
          setKeys((keys) => ({ ...keys, left: true }));
          break;
        case "ArrowDown":
        case "KeyS":
          setKeys((keys) => ({ ...keys, down: true }));
          break;
        case "ArrowUp":
        case "KeyW":
          setKeys((keys) => ({ ...keys, up: true }));
          break;
        default:
          break;
      }
    };

    const keyUpHandler = (e) => {
      switch (e.code) {
        case "ArrowRight":
        case "KeyD":
          setKeys((keys) => ({ ...keys, right: false }));
          break;
        case "ArrowLeft":
        case "KeyA":
          setKeys((keys) => ({ ...keys, left: false }));
          break;
        case "ArrowDown":
        case "KeyS":
          setKeys((keys) => ({ ...keys, down: false }));
          break;
        case "ArrowUp":
        case "KeyW":
          setKeys((keys) => ({ ...keys, up: false }));
          break;
        default:
          break;
      }
    };

    const handlePointerLockError = () => {
      console.error("Pointer lock failed.");
    };

    if (controls && controls.domElement) {
      controls.domElement.addEventListener("click", handleClick);
    }

    document.addEventListener("pointerlockerror", handlePointerLockError);

    controls.addEventListener("lock", handleLock);
    controls.addEventListener("unlock", handleUnlock);

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    return () => {
      document.removeEventListener("pointerlockerror", handlePointerLockError);
      if (controls && controls.domElement) {
        controls.domElement.removeEventListener("click", handleClick);
      }
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);

      controls.removeEventListener("lock", handleLock);
      controls.removeEventListener("unlock", handleUnlock);
    };
  }, [controls, handleClick, handleLock, handleUnlock]);

  useEffect(() => {
    setMyPlayer({ x: camera.position.x, z: camera.position.z });
  }, [camera.position.x, camera.position.y]);

  useFrame((delta) => {
    if (isLocked) {
      if (keys.up) {
        controls.moveForward(speed);
      }

      if (keys.down) {
        controls.moveForward(-speed);
      }

      if (keys.left) {
        controls.moveRight(-speed);
      }

      if (keys.right) {
        controls.moveRight(speed);
      }
    }
  });

  return null;
}

export default Player;
