"use client";

import { Html, Line, OrbitControls, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const nodes = [
  {
    id: "family",
    label: "Overseas family",
    detail: "Dubai",
    position: [-0.6, 1.35, 0] as [number, number, number],
    color: "#67E8C5",
    scale: 0.45,
  },
  {
    id: "farz",
    label: "Farz+ care layer",
    detail: "Human-led",
    position: [0.8, 0, 0.15] as [number, number, number],
    color: "#F4D27B",
    scale: 0.66,
  },
  {
    id: "saathi",
    label: "Farz+ Saathi",
    detail: "Lahore",
    position: [-0.6, -2.0, -0.15] as [number, number, number],
    color: "#FF8A7A",
    scale: 0.42,
  },
  {
    id: "doctor",
    label: "Doctor",
    detail: "Clinical review",
    position: [3.25, 1.65, -0.2] as [number, number, number],
    color: "#82BCE8",
    scale: 0.48,
  },
] as const;

const connections = [
  ["family", "farz"],
  ["farz", "saathi"],
  ["farz", "doctor"],
] as const;

function CareNode({
  position,
  color,
  scale,
  label,
  detail,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
  label: string;
  detail: string;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.elapsedTime * 0.2;
    group.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8 + position[0]) * 0.08;
  });

  return (
    <group ref={group} position={position}>
      <Sphere args={[scale, 48, 48]}>
        <meshStandardMaterial color={color} roughness={0.28} metalness={0.08} />
      </Sphere>
      <Sphere args={[scale * 1.35, 32, 32]}>
        <meshBasicMaterial color={color} transparent opacity={0.09} />
      </Sphere>
      <Html center distanceFactor={7.5} position={[0, -scale - 0.35, 0]}>
        <div className="care-network-label pointer-events-none hidden w-max rounded-sm border border-white/15 bg-[#071E1B]/90 px-2.5 py-1.5 text-center shadow-lg backdrop-blur-md sm:block">
          <p className="text-[10px] font-bold text-white">{label}</p>
          <p className="mt-0.5 text-[8px] text-[#A9C8C0]">{detail}</p>
        </div>
      </Html>
    </group>
  );
}

function SignalPulse({
  start,
  end,
  delay,
  animate,
}: {
  start: [number, number, number];
  end: [number, number, number];
  delay: number;
  animate: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const from = useMemo(() => new THREE.Vector3(...start), [start]);
  const to = useMemo(() => new THREE.Vector3(...end), [end]);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const progress = animate ? (clock.elapsedTime * 0.17 + delay) % 1 : 0.5;
    mesh.current.position.lerpVectors(from, to, progress);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.08, 20, 20]} />
      <meshBasicMaterial color="#FFFFFF" />
      <pointLight color="#67E8C5" intensity={0.8} distance={1.8} />
    </mesh>
  );
}

function NetworkScene({ animate }: { animate: boolean }) {
  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node])) as Record<
    (typeof nodes)[number]["id"],
    (typeof nodes)[number]
  >;

  return (
    <group position={[1.1, -0.1, 0]} rotation={[-0.05, -0.16, 0]}>
      {connections.map(([from, to], index) => {
        const start = nodeMap[from].position;
        const end = nodeMap[to].position;
        return (
          <group key={`${from}-${to}`}>
            <Line points={[start, end]} color="#5FAE9F" lineWidth={1.1} transparent opacity={0.55} />
            <SignalPulse start={start} end={end} delay={index * 0.31} animate={animate} />
          </group>
        );
      })}
      {nodes.map((node) => (
        <CareNode key={node.id} {...node} />
      ))}
    </group>
  );
}

export function CareNetwork3D() {
  const reduceMotion = useReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, 0.3, 8.4], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-label="Interactive 3D care network connecting an overseas family, Farz+ care manager, Saathi, and doctor"
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#D9FFF3" />
      <pointLight position={[-3, -2, 4]} intensity={24} color="#FF8A7A" distance={9} />
      <pointLight position={[4, 2, 3]} intensity={22} color="#82BCE8" distance={9} />
      <NetworkScene animate={!reduceMotion} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 1.65}
        autoRotate={!reduceMotion}
        autoRotateSpeed={0.35}
      />
    </Canvas>
  );
}
