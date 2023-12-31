import * as THREE from 'three';
const Floor = () => {
  return (
    <>
      <mesh
        receiveShadow
        name="floor"
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
      >
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color={'#724152'} />
      </mesh>
      <mesh name="top" rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color={'#D8E0E3'} />;
      </mesh>
    </>
  );
};

export default Floor;
