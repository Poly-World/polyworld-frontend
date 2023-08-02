import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React, { useEffect } from 'react';
import { BoxGeometry, PlaneGeometry, MeshBasicMaterial } from 'three';
import * as THREE from 'three';
const Table = () => {
  const glb = useGLTF('../models/table/desk.glb');
  const table = glb.scene.children[0];
  useEffect(() => {
    if (!table) return;

    glb.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
    // table.position.y = 0;
    table.position.set(-2.3, 1, 4.3);
    table.rotation.z = Math.PI / 2;
    table.scale.x = 2;
    table.scale.y = 2;
    table.scale.z = 2;
  }, []);

  return (
    <>
      <mesh castShadow name="chair" position={[-2.5, 1, 3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'white'} transparent opacity={0} />
      </mesh>
      <mesh
        castShadow
        name="desk"
        position={[-4, 2, 5]}
        rotation={[Math.PI / 2, 0, Math.PI]}
      >
        <planeGeometry args={[3, 1]} />
        <meshStandardMaterial
          color={'white'}
          transparent
          opacity={1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <primitive castShadow object={table} dispose={null} />
    </>
  );
};

export default Table;