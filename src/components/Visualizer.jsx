import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Visualizer = ({ analyzer }) => {
  const meshRef = useRef();
  const geometryRef = useRef();

  useFrame(() => {
    if (!analyzer || !meshRef.current || !geometryRef.current) return;
    
    // Get frequency data using the Web Audio API directly
    const analyserNode = analyzer.analyser;
    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(dataArray);
    
    const positions = geometryRef.current.attributes.position.array;
    
    // Store original positions once
    if (!geometryRef.current.originalPositions) {
      geometryRef.current.originalPositions = Float32Array.from(positions);
    }
    
    // Update vertices
    for (let i = 0; i < positions.length; i += 3) {
      const frequencyIndex = Math.floor((i / positions.length) * dataArray.length);
      const amplitude = dataArray[frequencyIndex] / 255.0;
      
      // Get original position
      const originalX = geometryRef.current.originalPositions[i];
      const originalY = geometryRef.current.originalPositions[i + 1];
      const originalZ = geometryRef.current.originalPositions[i + 2];
      
      // Apply stronger distortion
      const distortionFactor = 1 + (amplitude * 2); // Increased amplitude effect
      positions[i] = originalX * distortionFactor;
      positions[i + 1] = originalY * distortionFactor;
      positions[i + 2] = originalZ * distortionFactor;
    }
    
    geometryRef.current.attributes.position.needsUpdate = true;
    
    // Add dynamic rotation based on average frequency
    const averageFrequency = Array.from(dataArray).reduce((a, b) => a + b, 0) / dataArray.length;
    meshRef.current.rotation.x += 0.001 + (averageFrequency / 25000);
    meshRef.current.rotation.y += 0.001 + (averageFrequency / 25000);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry ref={geometryRef} args={[1, 4]} />
      <meshPhongMaterial 
        wireframe 
        color="#8712B8"
        emissive="#8712B8"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

export default Visualizer;
