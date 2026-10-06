import React from 'react';
import { useApp } from '../../context/AppContext';

export const ConnectMuslimPreview: React.FC = () => {
  const { setOverlayScreen } = useApp();

  const serviceIcons: {
    id: string;
    screenKey: 'work_halal_jobs' | 'business_directory' | 'nikah_matrimony' | 'islamic_education';
    url: string;
    alt: string;
  }[] = [
    {
      id: 'cm-1',
      screenKey: 'work_halal_jobs',
      url: 'https://res.cloudinary.com/dv16a8l1l/image/upload/v1791212331/work_halal_1_ideqes.png',
      alt: 'Connect Muslim Service 1'
    },
    {
      id: 'cm-2',
      screenKey: 'business_directory',
      url: 'https://res.cloudinary.com/dv16a8l1l/image/upload/v1791212620/work_halal_2_uhb3yi.png',
      alt: 'Connect Muslim Service 2'
    },
    {
      id: 'cm-3',
      screenKey: 'nikah_matrimony',
      url: 'https://res.cloudinary.com/dv16a8l1l/image/upload/v1791213608/work_halal_3_idz7uu.png',
      alt: 'Connect Muslim Service 3'
    },
    {
      id: 'cm-4',
      screenKey: 'islamic_education',
      url: 'https://res.cloudinary.com/dv16a8l1l/image/upload/v1791268828/work_halal_4_heysky.png',
      alt: 'Connect Muslim Service 4'
    }
  ];

  return (
    <div className="w-full">
      {/* Clean Heading */}
      <div className="mb-2 px-0.5">
        <h2 className="text-xs font-bold text-slate-800 tracking-wider uppercase">
          Connect Muslim Services
        </h2>
      </div>

      {/* Compact 2x2 Layout with the 4 Icon Images */}
      <div className="grid grid-cols-2 gap-2.5">
        {serviceIcons.map((icon) => (
          <button
            key={icon.id}
            type="button"
            onClick={() => setOverlayScreen(icon.screenKey)}
            className="w-full rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs active:scale-98 transition-all cursor-pointer border border-slate-200/80 bg-white group focus:outline-hidden"
          >
            <img
              src={icon.url}
              alt={icon.alt}
              className="w-full h-auto object-cover block group-hover:opacity-95 transition-opacity"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
