import { Float, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { BoxGeometry, MeshBasicMaterial } from 'three';
import * as THREE from 'three';

const Camera = () => {
  const glb = useGLTF('../models/camera/camera_3d.glb');
  //   const glb = useGLTF('../models/cartoon_furniture.glb');
  const cameraMesh = glb.scene.children[0];
  const { scene, camera } = useThree();
  const pointGeometry = new THREE.CylinderGeometry(0.14, 0, 0.3, 32);
  const pointMaterial = new THREE.MeshStandardMaterial({ color: 'red' });

  const coneRef = useRef();
  useEffect(() => {
    if (!cameraMesh) return;

    // camera.position.x = -2;
    // camera.position.y = 1.2;
    // camera.position.z = 4;
    cameraMesh.position.set(-2, 1.2, 4);
    cameraMesh.rotation.x = -Math.PI / 6;
    // camera.rotation.y = Math.PI;
    cameraMesh.rotation.z = Math.PI / 2;
    cameraMesh.scale.x = 0.0003;
    cameraMesh.scale.y = 0.0003;
    cameraMesh.scale.z = 0.0003;
    const mesh = new THREE.Mesh(
      new BoxGeometry(0.3, 0.4, 0.5),
      new MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      })
    );
    mesh.name = 'camera';
    mesh.castShadow = true;
    // mesh.position.x = camera.position.x;
    // mesh.position.y = camera.position.y;
    // mesh.position.z = camera.position.z;
    mesh.position.set(-2, 1.2, 4);
    scene.add(mesh);
  });

  useFrame(() => {
    if (
      Math.abs(coneRef.current.position.x - camera.position.x) < 3.5 &&
      Math.abs(coneRef.current.position.z - camera.position.z) < 3.5
    ) {
      coneRef.current.visible = true;
    } else {
      coneRef.current.visible = false;
    }
  });
  return (
    <>
      <Float
        speed={30}
        rotationIntensity={0.1}
        floatIntensity={0.01}
        floatingRange={[0, 0.1]}
      >
        <mesh
          ref={coneRef}
          position={[-2, 1.7, 4]}
          geometry={pointGeometry}
          material={pointMaterial}
        />
      </Float>
      <primitive object={cameraMesh} dispose={null} />
    </>
  );
};

export default Camera;
