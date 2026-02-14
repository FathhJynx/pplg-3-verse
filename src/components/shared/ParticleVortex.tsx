
import { useRef, useEffect } from "react";

const ParticleVortex = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles: { x: number; y: number; z: number; color: string }[] = [];
        const particleCount = 200;
        const colors = ['#ff0099', '#00f3ff', '#ffffff'];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: (Math.random() - 0.5) * width,
                y: (Math.random() - 0.5) * height,
                z: Math.random() * 2 + 0.5,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        let animationFrameId: number;

        const animate = () => {
            // Clear with slight fade for trail effect if desired, or full clear
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, width, height);

            particles.forEach((p) => {
                const centerX = width / 2;
                const centerY = height / 2;

                // Move particles towards camera
                p.z -= 0.01;
                // Reset if too close
                if (p.z <= 0.1) {
                    p.z = 2;
                    p.x = (Math.random() - 0.5) * width;
                    p.y = (Math.random() - 0.5) * height;
                }

                const perspective = 300 / p.z;
                const x = centerX + p.x * perspective * 0.005;
                const y = centerY + p.y * perspective * 0.005;

                // Size based on distance
                const size = Math.max(0.1, (3 - p.z) * 1.5);

                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                // Fade based on distance
                ctx.globalAlpha = Math.min(1, (2 - p.z) * 0.8);
                ctx.fill();
                ctx.globalAlpha = 1;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
};

export default ParticleVortex;
