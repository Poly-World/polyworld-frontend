import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import React, { useRef, useEffect } from 'react';
import { radToDeg } from 'three/src/math/MathUtils';

useGLTF.preload('../models/portal/the_great_morpheus.glb');

const Portal = () => {
  const glb = useGLTF('../models/portal/the_great_morpheus.glb');
  const road = glb.scene.children[0];
  const glbs = [];
  glbs.push(glb);
  useEffect(() => {
    if (!road) return;

    glbs.map((glb) => {
      glb.scene.traverse((child) => {
        if (child.isMesh) child.receiveShadow = true;
      });
    });
  }, []);
  return (
    <RigidBody type='fixed'>
      <>
        {/* 왼쪽 길 */}
        <primitive
          position={[-4, -0.02, 11]}
          scale={[0.2, 0.2, 0.2]}
          rotation={[-Math.PI / 2, 0, Math.PI / 12]}
          object={road.clone()}
          dispose={null}
        />
      </>
    </RigidBody>
  );
};

export default Portal;
