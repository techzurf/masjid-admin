import React, { useRef, useState, useEffect } from 'react';

const NEW_PROMO_VIDEO_URL =
  'https://res.cloudinary.com/dv16a8l1l/video/upload/v1790316580/205173-926480917_medium_vpshjn.mp4';
const FALLBACK_PROMO_VIDEO_URL =
  'https://res.cloudinary.com/dv16a8l1l/video/upload/v1790306065/Eid_Ul_Fitr_2026_Greeting___Islamic_Ramadan_After_Effects_Template_eid_eidmubarak_intro_template_eqggxo.mp4';

interface PromoVideoBannerProps {
  className?: string;
}

export const PromoVideoBanner: React.FC<PromoVideoBannerProps> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState(NEW_PROMO_VIDEO_URL);

  useEffect(() => {
    // Robust cross-browser & mobile iOS autoplay handling
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Retry muted playback if browser temporarily interrupted
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [videoSrc]);

  const handleVideoError = () => {
    if (videoSrc !== FALLBACK_PROMO_VIDEO_URL) {
      setVideoSrc(FALLBACK_PROMO_VIDEO_URL);
    }
  };

  return (
    <div className={`w-full h-[160px] sm:h-[175px] relative overflow-hidden bg-[#061D15] shrink-0 ${className}`}>
      {/* Fallback dark/green background on slow networks or while video is loading */}
      <div
        className={`absolute inset-0 bg-[#062017] transition-opacity duration-500 pointer-events-none ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: 'radial-gradient(ellipse at center, #0B3B2B 0%, #051911 100%)',
        }}
      />

      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        onError={handleVideoError}
        onLoadedData={() => setIsLoaded(true)}
        className="w-full h-full object-cover block pointer-events-none select-none"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
};
