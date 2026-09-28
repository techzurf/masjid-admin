import React, { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import greetingAnimationData from '../../assets/greeting-lottie.json';

interface GreetingLottieProps {
  className?: string;
}

export const GreetingLottie: React.FC<GreetingLottieProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Lottie animation
    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: greetingAnimationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      }
    });

    return () => {
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};
