const Spot = ({ spot }) => {
  return (
    <mesh
      name="spot"
      position={[spot.x, spot.y, spot.z]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <circleGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color={'yellow'} transparent opacity={0.5} />
    </mesh>
  );
};

export default Spot;
