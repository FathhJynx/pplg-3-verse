
import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        // Disable Lenis on mobile devices (width < 768px)
        if (window.innerWidth < 768) {
            return;
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            lerp: 0.1, // Improved momentum
            smoothWheel: true,
            syncTouch: false, // Disable touch sync as we want native feel if enabled, but we are disabling entirely on mobile
            touchMultiplier: 2,
            wheelMultiplier: 1,
            infinite: false,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
            if (lenisRef.current) {
                lenisRef.current.raf(time);
                requestAnimationFrame(raf);
            }
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    return <>{children}</>;
}
