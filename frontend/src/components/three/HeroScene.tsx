'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function FloatingParticle({ position, size, speed, color }: {
  position: [number, number, number];
  size: number;
  speed: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[size, 0]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.35}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

function GoldRing({ position, size }: { position: [number, number, number]; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[size, size * 0.08, 16, 32]} />
        <meshStandardMaterial
          color="#B99A65"
          transparent
          opacity={0.3}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const particles = [
    { position: [-3, 1, -2] as [number, number, number], size: 0.08, speed: 0.8, color: '#B99A65' },
    { position: [3.5, -0.5, -3] as [number, number, number], size: 0.06, speed: 1.2, color: '#D4BA8A' },
    { position: [-2, -1, -1] as [number, number, number], size: 0.05, speed: 1, color: '#C9A6B2' },
    { position: [2, 1.5, -2.5] as [number, number, number], size: 0.07, speed: 0.9, color: '#B99A65' },
    { position: [-1, 2, -3] as [number, number, number], size: 0.04, speed: 1.1, color: '#D4BA8A' },
    { position: [4, 0, -2] as [number, number, number], size: 0.06, speed: 0.7, color: '#C9A6B2' },
    { position: [-4, -1.5, -2.5] as [number, number, number], size: 0.05, speed: 1.3, color: '#B99A65' },
    { position: [1, -2, -1.5] as [number, number, number], size: 0.04, speed: 1, color: '#D4BA8A' },
  ];

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#D4BA8A" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#C9A6B2" />

      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}

      <GoldRing position={[-2.5, 0.5, -3]} size={0.8} />
      <GoldRing position={[3, -1, -4]} size={1.2} />
      <GoldRing position={[0, 2.5, -5]} size={0.6} />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="hero-scene absolute inset-0 pointer-events-none" style={{ opacity: 0.22 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
