import React, { useState, useEffect } from 'react';

interface GreetingMessage {
  id: string;
  text: string;
  emoji: string;
  color: string;
  colorClass: string;
}

const GREETINGS: GreetingMessage[] = [
  {
    id: 'salam',
    text: 'Assalamu Alaikum',
    emoji: '👋',
    color: '#087F5B',
    colorClass: 'text-[#087F5B]'
  },
  {
    id: 'masjid',
    text: 'Madina Masjid MKB Nagar',
    emoji: '☀️',
    color: '#D4A72C',
    colorClass: 'text-[#D4A72C]'
  },
  {
    id: 'afternoon',
    text: 'Good Afternoon',
    emoji: '☀️',
    color: '#3B6FD8',
    colorClass: 'text-[#3B6FD8]'
  },
  {
    id: 'welcome',
    text: 'Welcome to Madina Masjid MKB Nagar',
    emoji: '🕌',
    color: '#7657C8',
    colorClass: 'text-[#7657C8]'
  }
];

export const AnimatedGreeting: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isSliding, setIsSliding] = useState(false);

  // Accessibility: respect prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener?.('change', listener);
      return () => mediaQuery.removeEventListener?.('change', listener);
    }
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    // Rotate through the 4 greetings every 3.5 seconds
    const interval = setInterval(() => {
      const target = (currentIndex + 1) % GREETINGS.length;
      setNextIndex(target);
      setIsSliding(true);

      // Smooth slide duration 480ms
      setTimeout(() => {
        setCurrentIndex(target);
        setNextIndex(null);
        setIsSliding(false);
      }, 480);
    }, 3500);

    return () => clearInterval(interval);
  }, [currentIndex, reducedMotion]);

  const currentItem = GREETINGS[currentIndex];
  const nextItem = nextIndex !== null ? GREETINGS[nextIndex] : null;

  const renderItemContent = (item: GreetingMessage) => (
    <div 
      className={`flex items-center gap-1.5 text-xs font-bold truncate ${item.colorClass}`}
      style={{ color: item.color }}
    >
      <span className="truncate tracking-tight">{item.text}</span>
      <span className="text-xs shrink-0 select-none" role="img" aria-hidden="true">
        {item.emoji}
      </span>
    </div>
  );

  return (
    <div 
      className="relative h-5 w-full max-w-[280px] overflow-hidden flex items-center select-none mb-0.5" 
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Reduced motion static fallback */}
      {reducedMotion ? (
        <div className="absolute inset-0 flex items-center">
          {renderItemContent(currentItem)}
        </div>
      ) : (
        <>
          {/* Current Active Item (Slides out when transition triggers) */}
          <div 
            key={`current-${currentItem.id}`}
            className={`absolute inset-0 flex items-center ${
              isSliding ? 'animate-greeting-out pointer-events-none' : ''
            }`}
          >
            {renderItemContent(currentItem)}
          </div>

          {/* Incoming Next Item (Slides into view from bottom) */}
          {isSliding && nextItem && (
            <div 
              key={`next-${nextItem.id}`}
              className="absolute inset-0 flex items-center animate-greeting-in pointer-events-none"
            >
              {renderItemContent(nextItem)}
            </div>
          )}
        </>
      )}
    </div>
  );
};
