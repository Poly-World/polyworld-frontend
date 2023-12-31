import { Sky } from '@react-three/drei';

const EnvSky = () => {
  return (
    <Sky
      distance={4500}
      sunPosition={[0, 1, 0]}
      inclination={0}
      azimuth={0.25}
    />
  );
};

export default EnvSky;
