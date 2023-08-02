import { Float, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React, { useEffect } from 'react';
import { BoxGeometry, MeshBasicMaterial } from 'three';
import * as THREE from 'three';

const Remote = () => {
  const glb = useGLTF('../models/remote/tv_remote.glb');
  const remote = glb.scene.children[0];
  const { scene } = useThree();
  const pointGeometry = new THREE.CylinderGeometry(0.14, 0, 0.3, 32);
  const pointMaterial = new THREE.MeshStandardMaterial({ color: 'red' });

  useEffect(() => {
    if (!remote) return;
    glb.scene.traverse((child) => {
      if (child.isMesh) child.castShadow = true;
    });
    remote.position.set(4.7, 1.6, 3.6);
    remote.scale.set(0.03, 0.03, 0.03);

    const mesh = new THREE.Mesh(
      new BoxGeometry(0.2, 0.2, 0.6),
      new MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    mesh.name = 'Remote';
    mesh.castShadow = true;
    mesh.position.x = remote.position.x;
    mesh.position.y = remote.position.y;
    mesh.position.z = remote.position.z;
    scene.add(mesh);
  });
  return (
    <>
      <Float
        speed={10}
        rotationIntensity={0.1}
        floatIntensity={0.01}
        floatingRange={[0, 0.1]}
      >
        <mesh
          position={[4.6, 2, 3.5]}
          geometry={pointGeometry}
          material={pointMaterial}
        />
      </Float>
      <primitive object={remote} dispose={null} />
    </>
  );
};

export default Remote;
