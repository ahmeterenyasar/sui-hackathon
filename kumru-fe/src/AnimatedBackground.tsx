import { useEffect, useRef } from "react";

declare global {
  interface Window {
    THREE: any;
    VANTA: any;
  }
}

export function AnimatedBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    let timeoutId: number;
    
    const initVanta = () => {
      if (!vantaRef.current) return;

      if (window.VANTA && window.THREE) {
        try {
          vantaEffect.current = window.VANTA.BIRDS({
            el: vantaRef.current,
            THREE: window.THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            backgroundColor: 0x0,
            color1: 0x667eea,
            color2: 0x764ba2,
            birdSize: 1.2,
            wingSpan: 25.0,
            speedLimit: 5.0,
            separation: 50.0,
            alignment: 50.0,
            cohesion: 50.0,
            quantity: 3.0,
          });
        } catch (error) {
          console.error("Vanta.js initialization error:", error);
        }
      } else {
        timeoutId = setTimeout(initVanta, 100);
      }
    };

    // Start with a slight delay
    timeoutId = setTimeout(initVanta, 100);

    return () => {
      clearTimeout(timeoutId);
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy();
        } catch (error) {
          console.error("Vanta.js destroy error:", error);
        }
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      id="vanta-background"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
}
