import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  X,
  Tv,
  CheckCircle2
} from 'lucide-react';
import { LATEST_MASJID_VIDEOS, MasjidVideoItem } from '../../data/videosData';

export const LatestVideosSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedVideo, setSelectedVideo] = useState<MasjidVideoItem | null>(null);

  // Sync pagination dots with scroll position
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth === 0) return;
    const newIndex = Math.round(scrollLeft / (clientWidth * 0.85));
    const clampedIndex = Math.max(0, Math.min(newIndex, LATEST_MASJID_VIDEOS.length - 1));
    if (clampedIndex !== activeIndex) {
      setActiveIndex(clampedIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.clientWidth * 0.85;
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  const handlePrev = () => {
    const prev = Math.max(0, activeIndex - 1);
    scrollToIndex(prev);
  };

  const handleNext = () => {
    const next = Math.min(LATEST_MASJID_VIDEOS.length - 1, activeIndex + 1);
    scrollToIndex(next);
  };

  // Open video modal or external app
  const handleOpenVideo = (video: MasjidVideoItem) => {
    setSelectedVideo(video);
  };

  const handleDirectYouTube = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="latest-videos-section" className="w-full scroll-mt-20">
      {/* Header with Title, Subtitle, and Carousel Controls */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E87961] animate-pulse"></span>
            <h2 className="text-xs font-bold text-slate-800 tracking-wider uppercase">
              Latest Videos
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Watch the latest updates from Madina Masjid
          </p>
        </div>

        {/* Subtle navigation arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Previous video"
            className="w-7 h-7 rounded-full bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === LATEST_MASJID_VIDEOS.length - 1}
            aria-label="Next video"
            className="w-7 h-7 rounded-full bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroller Carousel */}
      {/* Width set to 84% so a portion of the next card is naturally visible */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {LATEST_MASJID_VIDEOS.map((video, idx) => {
          const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
          const fallbackThumbnail = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;

          return (
            <div
              key={video.id}
              onClick={() => handleOpenVideo(video)}
              className="w-[84vw] max-w-[320px] shrink-0 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer snap-start flex flex-col overflow-hidden group select-none"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                <img
                  src={thumbnailUrl}
                  alt={video.title}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== fallbackThumbnail) {
                      target.src = fallbackThumbnail;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Subtle dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                {/* Category & YouTube Badge */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white tracking-wide">
                    {video.category || 'Madina Masjid'}
                  </span>

                  {/* YouTube Official Logo Badge */}
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-white">
                    <span className="w-3.5 h-2.5 bg-[#FF0000] rounded-xs flex items-center justify-center">
                      <Play className="w-1.5 h-1.5 text-white fill-white ml-0.5" />
                    </span>
                    <span>YouTube</span>
                  </span>
                </div>

                {/* Prominent Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-md shadow-lg flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-transform border border-white/40">
                    <div className="w-9 h-9 rounded-full bg-[#087F5B] flex items-center justify-center shadow-inner">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Bottom Duration / Tag Info */}
                <div className="absolute bottom-2 right-2.5 z-10">
                  <span className="px-2 py-0.5 rounded-sm bg-black/80 text-[10px] font-semibold text-white/90">
                    {video.duration || 'Watch'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5 group-hover:text-[#087F5B] transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {video.description}
                    </p>
                  )}
                </div>

                {/* Action Bar */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#087F5B]" />
                    <span>Official Channel</span>
                  </span>

                  <button
                    onClick={(e) => handleDirectYouTube(e, video.youtubeUrl)}
                    className="text-[11px] font-bold text-[#087F5B] hover:text-[#07543F] flex items-center gap-1 py-0.5 px-1.5 rounded-md hover:bg-emerald-50 transition-colors"
                  >
                    <span>Watch</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-2">
        {LATEST_MASJID_VIDEOS.map((_, dotIdx) => (
          <button
            key={dotIdx}
            onClick={() => scrollToIndex(dotIdx)}
            aria-label={`Go to video ${dotIdx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              dotIdx === activeIndex
                ? 'w-5 h-1.5 bg-[#087F5B]'
                : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

      {/* Video Player Modal (Triggered on Card Tap) */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-4 h-3 bg-[#FF0000] rounded-xs flex items-center justify-center">
                  <Play className="w-2 h-2 text-white fill-white ml-0.5" />
                </span>
                <span className="text-xs font-bold text-slate-800">
                  Madina Masjid Video
                </span>
              </div>

              <button
                onClick={() => setSelectedVideo(null)}
                className="w-7 h-7 rounded-full bg-slate-200/80 text-slate-700 flex items-center justify-center hover:bg-slate-300 transition-colors"
                aria-label="Close video player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Responsive Embedded YouTube Player (user-initiated play) */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Body */}
            <div className="p-4 flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {selectedVideo.title}
                </h3>
                {selectedVideo.description && (
                  <p className="text-xs text-slate-600 mt-1">
                    {selectedVideo.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  Close
                </button>

                <a
                  href={selectedVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#087F5B] hover:bg-[#07543F] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>Open in YouTube App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
