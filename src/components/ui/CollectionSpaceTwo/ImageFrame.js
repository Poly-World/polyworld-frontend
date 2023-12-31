import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import React, { useEffect } from "react";
import * as THREE from "three";

const ImageFrameChild = ({
  glb,
  position,
  scale,
  rotation,
  onLoad = () => {},
}) => {
  const frame = glb.scene.clone().children[0]; // 클론을 사용해 독립적인 객체 생성
  const { scene } = useThree();

  useEffect(() => {
    if (frame) {
      frame.traverse((child) => {
        if (child.isframe) child.castShadow = true;
      });

      frame.scale.set(...scale);
      frame.position.set(...position);
      scene.add(frame);

      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 1.5, 1),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      );
      mesh.castShadow = true;
      scene.add(mesh);

      if (typeof onLoad === "function") {
        onLoad();
      }

      return () => {
        if (frame) scene.remove(frame);
      };
    }
  }, [frame, position, scale, scene, onLoad]);

  if (!frame) return null;

  return <primitive rotation={rotation} object={frame} dispose={null} />;
};

const ImageFrame = () => {
  const glb = useGLTF("../models/imageframe/wood_image_frame.glb");

  const positions = [
    [-3, 4.2, 5.0],
    [-5, 4.0, 0],
    [-5, 4.2, 3.5],
    [-5, 3.9, -3.02],
    [5.0, 3.3, -3.2],
  ];

  const scales = [
    [8, 5, 10],
    [10, 5, 12],
    [5, 5, 10],
    [5, 5, 5],
    [12, 5, 15],
  ];
  const rotations = [
    [0, Math.PI / 2, Math.PI / 2],
    [0, 0, Math.PI / 2],
    [0, 0, Math.PI / 2],
    [0, 0, Math.PI / 2],
    [0, -Math.PI, Math.PI / 2],
  ];

  return (
    <>
      {positions.map((position, index) => (
        <ImageFrameChild
          key={index}
          glb={glb}
          position={position}
          scale={scales[index]}
          rotation={rotations[index]}
        />
      ))}
    </>
  );
};

export default ImageFrame;
