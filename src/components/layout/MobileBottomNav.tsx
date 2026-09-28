import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Compass, 
  LayoutGrid, 
  Menu 
} from 'lucide-react';
import { MosqueIcon } from '../common/IslamicIcons';
import gsap from 'gsap';

interface NavItem {
  id: string;
  label: string;
  icon: (isActive: boolean) => React.ReactNode;
}

export const MobileBottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    overlayScreen, 
    setOverlayScreen, 
    settings, 
    triggerHapticFeedback 
  } = useApp();

  const isRamadan = settings.ramadanMode;
  const containerRef = useRef<HTMLDivElement>(null);
  const [navWidth, setNavWidth] = useState(390);

  // Determine active tab index (0 to 4)
  const getActiveIndex = (): number => {
    if (overlayScreen === 'qibla') return 2;
    if (overlayScreen === 'about_masjid' || overlayScreen === 'settings' || activeTab === 'masjid') return 4;
    if (activeTab === 'prayers' && !overlayScreen) return 1;
    if (activeTab === 'services' && !overlayScreen) return 3;
    if (activeTab === 'home' && !overlayScreen) return 0;
    
    // Fallbacks based on activeTab
    if (activeTab === 'prayers') return 1;
    if (activeTab === 'services') return 3;
    return 0;
  };

  const activeIndex = getActiveIndex();

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: (active) => <Home className={`w-5 h-5 ${active ? 'text-white' : ''}`} strokeWidth={active ? 2.4 : 1.8} />,
    },
    {
      id: 'prayer',
      label: 'Prayer',
      icon: (active) => <MosqueIcon className={`w-5 h-5 ${active ? 'text-white' : ''}`} />,
    },
    {
      id: 'qibla',
      label: 'Qibla',
      icon: (active) => <Compass className={`w-5 h-5 ${active ? 'text-white' : ''}`} strokeWidth={active ? 2.4 : 1.8} />,
    },
    {
      id: 'services',
      label: 'Services',
      icon: (active) => <LayoutGrid className={`w-5 h-5 ${active ? 'text-white' : ''}`} strokeWidth={active ? 2.4 : 1.8} />,
    },
    {
      id: 'more',
      label: 'More',
      icon: (active) => <Menu className={`w-5 h-5 ${active ? 'text-white' : ''}`} strokeWidth={active ? 2.4 : 1.8} />,
    },
  ];

  // Measure container width responsively across 320px, 360px, 375px, 390px, 412px, 430px
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.getBoundingClientRect().width;
        if (w > 0) setNavWidth(w);
      }
    };
    updateWidth();

    const ro = new ResizeObserver(updateWidth);
    ro.observe(containerRef.current);
    window.addEventListener('resize', updateWidth);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Animate the notch and active bubble center coordinate X
  const targetX = (activeIndex + 0.5) * (navWidth / 5);
  const animCoordRef = useRef({ x: targetX });
  const [currentX, setCurrentX] = useState(targetX);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const nextTargetX = (activeIndex + 0.5) * (navWidth / 5);

    if (isFirstRender.current) {
      animCoordRef.current.x = nextTargetX;
      setCurrentX(nextTargetX);
      isFirstRender.current = false;
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      animCoordRef.current.x = nextTargetX;
      setCurrentX(nextTargetX);
      return;
    }

    // Smooth spring-like fluid GSAP transition
    const tween = gsap.to(animCoordRef.current, {
      x: nextTargetX,
      duration: 0.42,
      ease: 'back.out(1.2)', // Controlled fluid spring
      onUpdate: () => {
        setCurrentX(animCoordRef.current.x);
      },
    });

    return () => {
      tween.kill();
    };
  }, [activeIndex, navWidth]);

  // Precise mathematical curved notch SVG path (starts at y=0, dips down 26px around bubble)
  const topY = 0;
  const bottomY = 26;
  const halfW = 32;
  const H = 105; // Sufficient vertical depth for bar + iPhone safe-area-inset-bottom

  const x0 = currentX - halfW;
  const x1 = currentX - 16;
  const x2 = currentX;
  const x3 = currentX + 16;
  const x4 = currentX + halfW;

  const curvedRimPath = `
    M -10 ${topY}
    L ${x0} ${topY}
    C ${currentX - 22} ${topY}, ${currentX - 20} ${topY + 12}, ${x1} ${topY + 18}
    C ${currentX - 10} ${bottomY - 2}, ${currentX - 6} ${bottomY}, ${x2} ${bottomY}
    C ${currentX + 6} ${bottomY}, ${currentX + 10} ${bottomY - 2}, ${x3} ${topY + 18}
    C ${currentX + 20} ${topY + 12}, ${currentX + 22} ${topY}, ${x4} ${topY}
    L ${navWidth + 10} ${topY}
  `.trim();

  const filledBodyPath = `
    ${curvedRimPath}
    L ${navWidth + 10} ${H}
    L -10 ${H}
    Z
  `.trim();

  const handleTabClick = (index: number) => {
    triggerHapticFeedback('light');
    switch (index) {
      case 0:
        setActiveTab('home');
        setOverlayScreen(null);
        break;
      case 1:
        setActiveTab('prayers');
        setOverlayScreen(null);
        break;
      case 2:
        setOverlayScreen('qibla');
        break;
      case 3:
        setActiveTab('services');
        setOverlayScreen(null);
        break;
      case 4:
        setOverlayScreen('about_masjid');
        break;
    }
  };

  return (
    <nav
      ref={containerRef}
      aria-label="Masjid Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 max-w-[430px] mx-auto select-none pointer-events-auto overflow-visible"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* 1. Underlying SVG Background Canvas with Smooth Traveling Curved Notch & Illuminated Rim */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none overflow-visible"
        style={{ height: `${H}px` }}
        aria-hidden="true"
      >
        <defs>
          {/* Main Dark Emerald / Ramadan Navy Gradient */}
          <linearGradient id="navBarBackgroundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isRamadan ? '#0A1E37' : '#063B2C'} />
            <stop offset="60%" stopColor={isRamadan ? '#061426' : '#04271D'} />
            <stop offset="100%" stopColor={isRamadan ? '#040C18' : '#031C14'} />
          </linearGradient>

          {/* Top Rim Illuminated Stroke Gradient */}
          <linearGradient id="navBarRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isRamadan ? '#F59E0B' : '#087F5B'} stopOpacity="0.3" />
            <stop offset="35%" stopColor={isRamadan ? '#FDE68A' : '#D4A72C'} stopOpacity="0.75" />
            <stop offset="50%" stopColor={isRamadan ? '#FFFBEB' : '#6EE7B7'} stopOpacity="0.9" />
            <stop offset="65%" stopColor={isRamadan ? '#FDE68A' : '#D4A72C'} stopOpacity="0.75" />
            <stop offset="100%" stopColor={isRamadan ? '#F59E0B' : '#087F5B'} stopOpacity="0.3" />
          </linearGradient>

          {/* Ambient Notch Glow Filter */}
          <filter id="notchShadowFilter" x="-10%" y="-30%" width="120%" height="160%">
            <feDropShadow dx="0" dy="-3" stdDeviation="5" floodColor={isRamadan ? 'rgba(0,0,0,0.55)' : 'rgba(2, 28, 20, 0.45)'} />
          </filter>
        </defs>

        {/* Solid Bar Body with Cutout */}
        <path
          d={filledBodyPath}
          fill="url(#navBarBackgroundGrad)"
          filter="url(#notchShadowFilter)"
        />

        {/* Highlighted Top Edge Rim that seamlessly dips into the notch */}
        <path
          d={curvedRimPath}
          fill="none"
          stroke="url(#navBarRimGrad)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>

      {/* 2. Elevated Floating Active Circular Bubble (Controlled rise: exactly 8px above the navigation bar) */}
      <div
        className="absolute top-0 left-0 pointer-events-none z-20 flex items-center justify-center transition-transform"
        style={{
          width: '44px',
          height: '44px',
          transform: `translate3d(${currentX - 22}px, -8px, 0)`,
          willChange: 'transform',
        }}
      >
        <div
          className={`w-full h-full rounded-full flex items-center justify-center relative shadow-md ${
            isRamadan
              ? 'bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#92400E] border-2 border-amber-300 shadow-[0_4px_14px_rgba(217,119,6,0.5)]'
              : 'bg-gradient-to-br from-[#10B981] via-[#087F5B] to-[#06543F] border-2 border-[#FDE68A]/90 shadow-[0_4px_14px_rgba(8,127,91,0.5)]'
          }`}
        >
          {/* Subtle interior sheen ring */}
          <div className="absolute inset-0 rounded-full border border-white/20 pointer-events-none" />

          {/* Active White Icon */}
          <div 
            key={activeIndex}
            className="text-white transform transition-transform duration-200 animate-in zoom-in-75 flex items-center justify-center"
          >
            {navItems[activeIndex].icon(true)}
          </div>
        </div>
      </div>

      {/* 3. Five Tab Interactive Columns */}
      <div className="relative z-10 w-full h-[62px] sm:h-[66px] grid grid-cols-5 items-stretch">
        {navItems.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(index)}
              className="relative flex flex-col items-center justify-end pb-1.5 pt-2 h-full cursor-pointer active:scale-95 transition-transform outline-none select-none"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Inactive Icon: Centered in normal bar height, cleanly fades when active */}
              <div
                className={`transition-all duration-250 flex items-center justify-center ${
                  isActive
                    ? 'opacity-0 scale-75 -translate-y-1 pointer-events-none'
                    : isRamadan
                    ? 'opacity-70 text-slate-400 hover:text-amber-200 translate-y-0 scale-100'
                    : 'opacity-75 text-emerald-100/70 hover:text-white translate-y-0 scale-100'
                }`}
                style={{ height: '22px' }}
              >
                {item.icon(false)}
              </div>

              {/* Label at the bottom */}
              <div className="flex flex-col items-center justify-center mt-0.5">
                <span
                  className={`text-[10px] tracking-tight transition-all duration-200 ${
                    isActive
                      ? isRamadan
                        ? 'font-extrabold text-amber-300 scale-105'
                        : 'font-extrabold text-[#D4A72C] scale-105'
                      : isRamadan
                      ? 'font-medium text-slate-400'
                      : 'font-medium text-emerald-100/60'
                  }`}
                >
                  {item.label}
                </span>

                {/* Subtle active gold dot beneath the label */}
                <span
                  className={`w-1 h-1 rounded-full mt-0.5 transition-all duration-300 ${
                    isActive
                      ? isRamadan
                        ? 'bg-amber-400 opacity-100 scale-100 shadow-[0_0_6px_#F59E0B]'
                        : 'bg-[#D4A72C] opacity-100 scale-100 shadow-[0_0_6px_#D4A72C]'
                      : 'opacity-0 scale-0'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
export default MobileBottomNav;
