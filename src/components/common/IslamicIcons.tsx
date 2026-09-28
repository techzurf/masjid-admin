import React from 'react';

export const MosqueIcon: React.FC<{ className?: string; size?: number }> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 2v2" />
    <path d="M12 4c-3 0-5 2.5-5 5.5v3.5h10V9.5C17 6.5 15 4 12 4z" />
    <path d="M4 9h2v12H4z" />
    <path d="M18 9h2v12h-2z" />
    <path d="M5 5l-1 4" />
    <path d="M19 5l1 4" />
    <path d="M2 21h20" />
    <path d="M9 21v-5a3 3 0 0 1 6 0v5" />
    <circle cx="12" cy="2" r="0.8" fill="currentColor" />
  </svg>
);

export const KaabaIcon: React.FC<{ className?: string; size?: number }> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M4 7l8-4 8 4-8 4-8-4z" />
    <path d="M4 7v10l8 4 8-4V7" />
    <path d="M12 11v10" />
    <path d="M4 10.5l8 4 8-4" stroke="#D4A72C" strokeWidth="1.5" />
    <path d="M4 11.5l8 4 8-4" stroke="#D4A72C" strokeWidth="1.5" />
  </svg>
);

export const CrescentStarIcon: React.FC<{ className?: string; size?: number }> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.79c-.44-.07-.9-.11-1.36-.11z" />
    <polygon points="17 4 17.8 6.5 20.5 6.5 18.3 8 19.1 10.5 17 9 14.9 10.5 15.7 8 13.5 6.5 16.2 6.5" fill="currentColor" stroke="none" />
  </svg>
);

export const RubElHizbIcon: React.FC<{ className?: string; size?: number }> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect x="5" y="5" width="14" height="14" rx="1" />
    <rect x="5" y="5" width="14" height="14" rx="1" transform="rotate(45 12 12)" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

export const TasbeehBeadsIcon: React.FC<{ className?: string; size?: number }> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="12" cy="4" r="1.5" />
    <circle cx="16.5" cy="5.5" r="1.5" />
    <circle cx="19.5" cy="9.5" r="1.5" />
    <circle cx="20" cy="14" r="1.5" />
    <circle cx="17.5" cy="18" r="1.5" />
    <circle cx="13" cy="20" r="1.5" />
    <circle cx="8" cy="19.5" r="1.5" />
    <circle cx="5" cy="16.5" r="1.5" />
    <circle cx="4" cy="12" r="1.5" />
    <circle cx="5.5" cy="7.5" r="1.5" />
    <circle cx="8.5" cy="4.5" r="1.5" />
    <path d="M12 20v3" />
    <path d="M10 23h4" />
  </svg>
);

export const RamadanLanternIcon: React.FC<{ className?: string; size?: number }> = ({ className = "w-6 h-6", size }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M12 2v2" />
    <circle cx="12" cy="4" r="1" />
    <path d="M8 7h8l-1-2H9L8 7z" />
    <path d="M7 8l-2 5 2 6h10l2-6-2-5H7z" />
    <path d="M10 19v2h4v-2" />
    <line x1="12" y1="10" x2="12" y2="17" />
    <circle cx="12" cy="13.5" r="1.5" fill="#D4A72C" stroke="none" />
  </svg>
);
