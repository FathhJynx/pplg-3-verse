import React, { useRef, useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'framer-motion';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', onClick }) => {
    const ref = useRef<HTMLDivElement>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    // Performance optimization: only compute when in view
    const isInView = useInView(ref, { once: false, amount: 0.1 });

    // Define the spring using the hook
    const [props, api] = useSpring(() => ({
        xys: [0, 0, 1],
        config: { mass: 1, tension: 280, friction: 60 }, // optimized for smoother perf
    }));

    const calc = (x: number, y: number) => {
        if (!ref.current || !isInView) return [0, 0, 1];
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate mouse position as percentage for the glare
        const px = ((x - rect.left) / rect.width) * 100;
        const py = ((y - rect.top) / rect.height) * 100;
        setMousePos({ x: px, y: py });

        return [-(y - centerY) / 15, (x - centerX) / 15, 1.05];
    };

    const trans = (x: number, y: number, s: number) =>
        `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isInView) return;
        if (!isHovered) setIsHovered(true);
        const { clientX: x, clientY: y } = e;
        api.start({ xys: calc(x, y) });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        api.start({ xys: [0, 0, 1] });
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isInView) return;
        setIsHovered(true);
        const touch = e.touches[0];
        api.start({ xys: calc(touch.clientX, touch.clientY) });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isInView) return;
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
            className={`relative transition-all duration-300 ${className} ${!isInView ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
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
                willChange: 'transform' // hint for browser optimization
            }}
        >
            {isInView && children}
            {/* Dynamic Glare effect - only rendered when hovered */}
            {isHovered && (
                <>
                    <div
                        className="absolute inset-0 w-full h-full pointer-events-none rounded-[inherit]"
                        style={{
                            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.1) 0%, transparent 60%)`,
                            mixBlendMode: 'overlay',
                        }}
                    />
                    <div
                        className="absolute inset-0 w-full h-full pointer-events-none rounded-[inherit]"
                        style={{
                            background: `linear-gradient(${mousePos.x + mousePos.y}deg, transparent 0%, rgba(0, 243, 255, 0.05) 50%, transparent 100%)`,
                            mixBlendMode: 'screen',
                        }}
                    />
                </>
            )}
        </animated.div>
    );
};

export default TiltCard;
