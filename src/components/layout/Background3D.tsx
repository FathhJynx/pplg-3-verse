import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Sparkles } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';

const Stars = (props: any) => {
    const ref = useRef<any>();
    const [sphere] = useMemo(() => {
        try {
            // Generate random points in a sphere
            const positions = random.inSphere(new Float32Array(8000), { radius: 2 }) as Float32Array;
            // Validate that we don't have NaN values which crash Three.js
            for (let i = 0; i < positions.length; i++) {
                if (isNaN(positions[i])) positions[i] = 0;
            }
            return [positions];
        } catch (e) {
            console.error("Error generating stars:", e);
            return [new Float32Array(8000).fill(0)];
        }
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 15;
            ref.current.rotation.y -= delta / 20;

            // Mouse interaction (parallax)
            const x = state.pointer.x * 0.2;
            const y = state.pointer.y * 0.2;
            ref.current.rotation.x += (y - ref.current.rotation.x) * delta * 0.5;
            ref.current.rotation.y += (x - ref.current.rotation.y) * delta * 0.5;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#00ff00" // Neon green
                    size={0.003} // Increased size
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
};

const CyberShape = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={meshRef} position={[0, 0, 0]} scale={0.8}>
                <icosahedronGeometry args={[1, 0]} />
                <meshBasicMaterial color="#00ff00" wireframe transparent opacity={0.15} />
            </mesh>
        </Float>
    );
};

const Background3D = () => {
    return (
        <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-black via-zinc-950 to-black pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <fog attach="fog" args={['#000000', 1, 3]} />
                <Stars />
                <Sparkles
                    count={500}
                    scale={3}
                    size={2}
                    speed={0.4}
                    opacity={0.5}
                    color="#4ade80" // lighter green
                />
                <CyberShape />
            </Canvas>
        </div>
    );
};

export default Background3D;
