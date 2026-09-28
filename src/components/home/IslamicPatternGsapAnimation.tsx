import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useApp } from '../../context/AppContext';

export const IslamicPatternGsapAnimation: React.FC = () => {
  const { settings } = useApp();
  const isRamadan = settings?.ramadanMode;

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const outerStarRef = useRef<SVGGElement>(null);
  const midStarRef = useRef<SVGGElement>(null);
  const innerStarRef = useRef<SVGGElement>(null);
  const leftFlankRef = useRef<SVGGElement>(null);
  const rightFlankRef = useRef<SVGGElement>(null);
  const orbitalRingsRef = useRef<SVGGElement>(null);
  const particlesRef = useRef<SVGGElement>(null);
  const glowCoreRef = useRef<SVGCircleElement>(null);
  const pulseRingRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Slow, majestic continuous rotations in opposing directions (centered at 250, 160)
      gsap.to(outerStarRef.current, {
        rotation: 360,
        svgOrigin: '250 160',
        duration: 52,
        ease: 'none',
        repeat: -1,
      });

      gsap.to(midStarRef.current, {
        rotation: -360,
        svgOrigin: '250 160',
        duration: 40,
        ease: 'none',
        repeat: -1,
      });

      gsap.to(innerStarRef.current, {
        rotation: 360,
        svgOrigin: '250 160',
        duration: 26,
        ease: 'none',
        repeat: -1,
      });

      // 2. Continuous slow rotation of outer celestial orbital rings
      gsap.to(orbitalRingsRef.current, {
        rotation: -360,
        svgOrigin: '250 160',
        duration: 80,
        ease: 'none',
        repeat: -1,
      });

      // 3. Central emerald-gold aura breathing pulse
      gsap.to(glowCoreRef.current, {
        scale: 1.3,
        opacity: 0.9,
        svgOrigin: '250 160',
        duration: 3.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // Expanding harmonic pulse ring
      gsap.fromTo(
        pulseRingRef.current,
        { scale: 0.5, opacity: 0.85, svgOrigin: '250 160' },
        {
          scale: 1.6,
          opacity: 0,
          svgOrigin: '250 160',
          duration: 4.5,
          ease: 'power1.out',
          repeat: -1,
        }
      );

      // 4. Left and Right flanks gentle floating & breathing
      gsap.to(leftFlankRef.current, {
        y: -6,
        x: -2,
        duration: 4.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      gsap.to(rightFlankRef.current, {
        y: 6,
        x: 2,
        duration: 4.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.5,
      });

      // 5. Floating light particles drift & shimmer across the full width
      if (particlesRef.current) {
        const particles = particlesRef.current.children;
        Array.from(particles).forEach((particle, i) => {
          const delay = (i * 0.28) % 3.2;
          const duration = 3.2 + (i % 5) * 0.7;
          
          gsap.to(particle, {
            y: `+=${(i % 2 === 0 ? 1 : -1) * (10 + (i % 8))}`,
            x: `+=${(i % 3 === 0 ? 1 : -1) * (8 + (i % 6))}`,
            opacity: 0.25 + (i % 4) * 0.2,
            duration,
            delay,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full absolute inset-0 overflow-hidden pointer-events-none select-none transition-colors duration-500 ${
        isRamadan
          ? 'bg-gradient-to-b from-[#0A1C33] via-[#071324] to-[#040D1A]'
          : 'bg-gradient-to-b from-[#05291C] via-[#031E14] to-[#02130C]'
      }`}
      aria-hidden="true"
    >
      {/* Ambient background radial highlights spanning left, center, and right */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background: isRamadan
            ? 'radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.25) 0%, rgba(212, 167, 44, 0.12) 40%, transparent 75%)'
            : 'radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.25) 0%, rgba(212, 167, 44, 0.12) 40%, transparent 75%)',
        }}
      />
      {/* Left flank glow */}
      <div
        className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-64 rounded-full pointer-events-none opacity-30 blur-2xl"
        style={{
          background: isRamadan ? '#D97706' : '#087F5B',
        }}
      />
      {/* Right flank glow */}
      <div
        className="absolute -right-10 top-1/2 -translate-y-1/2 w-48 h-64 rounded-full pointer-events-none opacity-30 blur-2xl"
        style={{
          background: isRamadan ? '#D4A72C' : '#10B981',
        }}
      />
      {/* Islamic geometric watermark subtle lattice */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(212, 167, 44, 0.25) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          backgroundPosition: 'center center',
        }}
      />

      {/* Full-bleed SVG Canvas: 500x320 with slice scaling to cover 100% of hero width & height */}
      <svg
        ref={svgRef}
        viewBox="0 0 500 320"
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Emerald Gradient */}
          <linearGradient id="heroEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#087F5B" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#044D36" stopOpacity="0.85" />
          </linearGradient>

          {/* Gold Accent Gradient */}
          <linearGradient id="heroGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#D4A72C" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#92690B" stopOpacity="0.7" />
          </linearGradient>

          {/* Core Soft Glow Filter */}
          <filter id="heroSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="heroGoldGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Pulsing Core Ring radiating outward from behind prayer card */}
        <circle
          ref={pulseRingRef}
          cx="250"
          cy="160"
          r="80"
          fill="none"
          stroke="url(#heroEmeraldGrad)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />

        {/* Central Ambient Glow */}
        <circle
          ref={glowCoreRef}
          cx="250"
          cy="160"
          r="48"
          fill={isRamadan ? '#F59E0B' : '#10B981'}
          opacity="0.35"
          filter="url(#heroSoftGlow)"
        />
        <circle
          cx="250"
          cy="160"
          r="20"
          fill="#FDE68A"
          opacity="0.6"
          filter="url(#heroGoldGlow)"
        />

        {/* Wide Orbital Rings expanding across the hero canvas */}
        <g ref={orbitalRingsRef} strokeWidth="1" fill="none">
          <ellipse cx="250" cy="160" rx="220" ry="120" stroke="rgba(16, 185, 129, 0.16)" strokeDasharray="4 8" />
          <ellipse cx="250" cy="160" rx="180" ry="95" stroke="rgba(212, 167, 44, 0.2)" strokeDasharray="2 6" />
          <ellipse cx="250" cy="160" rx="140" ry="75" stroke="rgba(52, 211, 153, 0.18)" />
          {/* Node dots on orbital rings */}
          <circle cx="30" cy="160" r="2.5" fill="#D4A72C" opacity="0.6" />
          <circle cx="470" cy="160" r="2.5" fill="#D4A72C" opacity="0.6" />
          <circle cx="250" cy="40" r="2" fill="#34D399" opacity="0.5" />
          <circle cx="250" cy="280" r="2" fill="#34D399" opacity="0.5" />
        </g>

        {/* LEFT FLANK VISUALS - Visibly framing the left side of the Prayer Card */}
        <g ref={leftFlankRef} fill="none">
          {/* Flowing arabesque vertical curves */}
          <path
            d="M 15 30 Q 55 100 25 160 T 35 290"
            stroke="url(#heroEmeraldGrad)"
            strokeWidth="1.4"
            opacity="0.5"
          />
          <path
            d="M 35 45 Q 65 110 40 160 T 50 275"
            stroke="url(#heroGoldGrad)"
            strokeWidth="1"
            strokeDasharray="3 4"
            opacity="0.6"
          />
          {/* Islamic decorative arch / finial motif on left edge */}
          <path
            d="M 5 120 C 35 130, 45 150, 45 160 C 45 170, 35 190, 5 200"
            stroke="url(#heroGoldGrad)"
            strokeWidth="1.2"
            opacity="0.5"
          />
          <circle cx="45" cy="160" r="3.5" fill="#FDE68A" opacity="0.8" filter="url(#heroGoldGlow)" />
          {/* Rub el Hizb 8-point mini star on left */}
          <g transform="translate(25, 75) scale(0.4)" stroke="url(#heroGoldGrad)" strokeWidth="2">
            <rect x="-15" y="-15" width="30" height="30" />
            <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" />
          </g>
          <g transform="translate(30, 245) scale(0.35)" stroke="url(#heroEmeraldGrad)" strokeWidth="2">
            <rect x="-15" y="-15" width="30" height="30" />
            <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" />
          </g>
        </g>

        {/* RIGHT FLANK VISUALS - Visibly framing the right side of the Prayer Card */}
        <g ref={rightFlankRef} fill="none">
          {/* Flowing arabesque vertical curves */}
          <path
            d="M 485 30 Q 445 100 475 160 T 465 290"
            stroke="url(#heroEmeraldGrad)"
            strokeWidth="1.4"
            opacity="0.5"
          />
          <path
            d="M 465 45 Q 435 110 460 160 T 450 275"
            stroke="url(#heroGoldGrad)"
            strokeWidth="1"
            strokeDasharray="3 4"
            opacity="0.6"
          />
          {/* Islamic decorative arch / finial motif on right edge */}
          <path
            d="M 495 120 C 465 130, 455 150, 455 160 C 455 170, 465 190, 495 200"
            stroke="url(#heroGoldGrad)"
            strokeWidth="1.2"
            opacity="0.5"
          />
          <circle cx="455" cy="160" r="3.5" fill="#FDE68A" opacity="0.8" filter="url(#heroGoldGlow)" />
          {/* Rub el Hizb 8-point mini star on right */}
          <g transform="translate(475, 75) scale(0.4)" stroke="url(#heroGoldGrad)" strokeWidth="2">
            <rect x="-15" y="-15" width="30" height="30" />
            <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" />
          </g>
          <g transform="translate(470, 245) scale(0.35)" stroke="url(#heroEmeraldGrad)" strokeWidth="2">
            <rect x="-15" y="-15" width="30" height="30" />
            <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" />
          </g>
        </g>

        {/* CENTER SACRED GEOMETRY - Radiates from behind the Prayer Time Card */}
        {/* 1. Outer 16-Point Geometric Rosette */}
        <g ref={outerStarRef} stroke="url(#heroGoldGrad)" strokeWidth="1.2" fill="none" opacity="0.45">
          <rect x="185" y="95" width="130" height="130" rx="3" />
          <rect x="185" y="95" width="130" height="130" rx="3" transform="rotate(45 250 160)" />
          <rect x="185" y="95" width="130" height="130" rx="3" transform="rotate(22.5 250 160)" stroke="url(#heroEmeraldGrad)" strokeWidth="0.8" opacity="0.4" />
          <rect x="185" y="95" width="130" height="130" rx="3" transform="rotate(67.5 250 160)" stroke="url(#heroEmeraldGrad)" strokeWidth="0.8" opacity="0.4" />
          <circle cx="250" cy="160" r="92" stroke="rgba(212, 167, 44, 0.3)" strokeDasharray="3 5" strokeWidth="1" />
        </g>

        {/* 2. Middle Star Layer (8-point Khatam Star Polygon) */}
        <g ref={midStarRef} stroke="url(#heroEmeraldGrad)" strokeWidth="1.4" fill="none" opacity="0.75">
          <polygon
            points="250,85 268,135 320,160 268,185 250,235 232,185 180,160 232,135"
            stroke="url(#heroGoldGrad)"
            strokeWidth="1.3"
          />
          <polygon
            points="250,85 268,135 320,160 268,185 250,235 232,185 180,160 232,135"
            transform="rotate(45 250 160)"
            stroke="url(#heroEmeraldGrad)"
            strokeWidth="1.3"
          />
          <circle cx="250" cy="160" r="55" stroke="rgba(52, 211, 153, 0.45)" strokeWidth="1" />
        </g>

        {/* 3. Inner Sacred Centerpiece */}
        <g ref={innerStarRef} fill="none" strokeWidth="1.2">
          <circle cx="250" cy="160" r="35" stroke="url(#heroGoldGrad)" opacity="0.8" />
          <polygon
            points="250,128 260,150 282,160 260,170 250,192 240,170 218,160 240,150"
            fill="rgba(212, 167, 44, 0.2)"
            stroke="url(#heroGoldGrad)"
            strokeWidth="1.1"
          />
          <circle cx="250" cy="160" r="7" fill="#FDE68A" opacity="0.95" />
        </g>

        {/* 4. EXPANSIVE FLOATING PARTICLES - Distributed across left, right, top, bottom, and center */}
        <g ref={particlesRef}>
          {/* Left Flank Particles */}
          <circle cx="15" cy="40" r="1.8" fill="#FDE68A" opacity="0.75" filter="url(#heroGoldGlow)" />
          <circle cx="32" cy="85" r="2.2" fill="#34D399" opacity="0.7" filter="url(#heroSoftGlow)" />
          <circle cx="48" cy="130" r="1.5" fill="#FDE68A" opacity="0.6" />
          <circle cx="22" cy="175" r="2" fill="#6EE7B7" opacity="0.75" filter="url(#heroSoftGlow)" />
          <circle cx="42" cy="220" r="1.6" fill="#FDE68A" opacity="0.65" />
          <circle cx="18" cy="270" r="2.2" fill="#34D399" opacity="0.7" />

          {/* Right Flank Particles */}
          <circle cx="485" cy="40" r="1.8" fill="#FDE68A" opacity="0.75" filter="url(#heroGoldGlow)" />
          <circle cx="468" cy="85" r="2.2" fill="#34D399" opacity="0.7" filter="url(#heroSoftGlow)" />
          <circle cx="452" cy="130" r="1.5" fill="#FDE68A" opacity="0.6" />
          <circle cx="478" cy="175" r="2" fill="#6EE7B7" opacity="0.75" filter="url(#heroSoftGlow)" />
          <circle cx="458" cy="220" r="1.6" fill="#FDE68A" opacity="0.65" />
          <circle cx="482" cy="270" r="2.2" fill="#34D399" opacity="0.7" />

          {/* Top & Bottom Ambient Particles */}
          <circle cx="110" cy="25" r="1.6" fill="#FDE68A" opacity="0.6" />
          <circle cx="190" cy="30" r="2" fill="#34D399" opacity="0.65" />
          <circle cx="310" cy="28" r="1.8" fill="#FDE68A" opacity="0.7" filter="url(#heroGoldGlow)" />
          <circle cx="390" cy="24" r="1.5" fill="#6EE7B7" opacity="0.6" />

          <circle cx="120" cy="295" r="1.7" fill="#FDE68A" opacity="0.55" />
          <circle cx="210" cy="300" r="2" fill="#34D399" opacity="0.6" />
          <circle cx="290" cy="298" r="1.5" fill="#FDE68A" opacity="0.65" />
          <circle cx="380" cy="295" r="2" fill="#6EE7B7" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};
