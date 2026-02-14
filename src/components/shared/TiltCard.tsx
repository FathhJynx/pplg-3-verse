import React, { useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', onClick }) => {
    const ref = useRef<HTMLDivElement>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    // Define the spring using the hook
    const [props, api] = useSpring(() => ({
        xys: [0, 0, 1],
        config: { mass: 1, tension: 350, friction: 30 }, // Slightly less friction for more "alive" feel
    }));

    const calc = (x: number, y: number) => {
        if (!ref.current) return [0, 0, 1];
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate mouse position as percentage for the glare
        const px = ((x - rect.left) / rect.width) * 100;
        const py = ((y - rect.top) / rect.height) * 100;
        setMousePos({ x: px, y: py });

        return [-(y - centerY) / 12, (x - centerX) / 12, 1.05]; // Increased tilt sensitivity
    };

    const trans = (x: number, y: number, s: number) =>
        `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`; // Increased perspective depth

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isHovered) setIsHovered(true);
        const { clientX: x, clientY: y } = e;
        api.start({ xys: calc(x, y) });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        api.start({ xys: [0, 0, 1] });
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setIsHovered(true);
        const touch = e.touches[0];
        api.start({ xys: calc(touch.clientX, touch.clientY) });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        api.start({ xys: calc(touch.clientX, touch.clientY) });
    };

    const handleTouchEnd = () => {
        setIsHovered(false);
        api.start({ xys: [0, 0, 1] });
    };

    return (
        <animated.div
            ref={ref}
            className={`relative transition-all duration-300 ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={onClick}
            style={{
                transform: props.xys.to(trans),
                zIndex: isHovered ? 50 : 1,
                transformStyle: 'preserve-3d',
            }}
        >
            {children}
            {/* Dynamic Glare effect */}
            <div
                className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 rounded-[inherit]"
                style={{
                    background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`,
                    opacity: isHovered ? 1 : 0,
                    mixBlendMode: 'overlay',
                }}
            />
            {/* Additional holographic shimmer */}
            <div
                className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 rounded-[inherit]"
                style={{
                    background: `linear-gradient(${mousePos.x + mousePos.y}deg, transparent 0%, rgba(0, 243, 255, 0.05) 50%, transparent 100%)`,
                    opacity: isHovered ? 0.5 : 0,
                    mixBlendMode: 'screen',
                }}
            />
        </animated.div>
    );
};

export default TiltCard;
