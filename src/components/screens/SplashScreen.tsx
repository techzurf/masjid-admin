import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const SPLASH_VIDEO_URL = 'https://res.cloudinary.com/dv16a8l1l/video/upload/v1790831683/download_1_qiihw2.mp4';

export const SplashScreen: React.FC = () => {
  const { setOverlayScreen, hasSeenOnboarding } = useApp();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const transitionedRef = useRef(false);

  const handleFinish = () => {
    if (transitionedRef.current) return;
    transitionedRef.current = true;
    if (!hasSeenOnboarding) {
      setOverlayScreen('onboarding');
    } else {
      setOverlayScreen(null);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay prevented or interrupted:', err);
        });
      }
    }

    // Safety timeout in case video fails to load or cannot play on restricted devices
    const safetyTimer = setTimeout(() => {
      handleFinish();
    }, 6000);

    return () => clearTimeout(safetyTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 w-full h-full h-[100dvh] bg-black flex items-center justify-center overflow-hidden select-none pointer-events-none">
      <video
        ref={videoRef}
        src={SPLASH_VIDEO_URL}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        loop={false}
        controls={false}
        preload="auto"
        onEnded={handleFinish}
        onError={handleFinish}
        className="w-full h-full object-cover object-center"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  );
};
