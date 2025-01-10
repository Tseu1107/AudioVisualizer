import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Visualizer from './Visualizer';

const Scene = ({ analyzer }) => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <color attach="background" args={['white']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars 
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
      <Visualizer analyzer={analyzer} />
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
