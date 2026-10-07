import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { X, Check, Image as ImageIcon } from 'lucide-react';
import wallpaper1 from "@/public/wallpaper1.jpg";
import wallpaper2 from "@/public/wallpaper2.jpg";
import wallpaper3 from "@/public/wallpaper3.jpg";
import wallpaper4 from "@/public/wallpaper4.jpg";
import wallpaper5 from "@/public/wallpaper5.jpg";
import wallpaper6 from "@/public/wallpaper6.jpg";
import wallpaper7 from "@/public/wallpaper7.jpg";
import wallpaper8 from "@/public/wallpaper8.jpg";
import wallpaper9 from "@/public/wallpaper9.jpg";
import wallpaper10 from "@/public/wallpaper10.jpg";

interface WallpaperSelectorProps {
  onSelectWallpaper: (wallpaper: string) => void;
  closeWindow: () => void;
  currentWallpaper?: string;
}

const wallpapers = [
  { id: 1, src: wallpaper1.src, alt: "Flame Lily Floral" },
  { id: 2, src: wallpaper2.src, alt: "Metallic Abstract" },
  { id: 3, src: wallpaper3.src, alt: "macOS Big Sur Spectrum" },
  { id: 4, src: wallpaper4.src, alt: "Mojave Honeysuckle" },
  { id: 5, src: wallpaper5.src, alt: "Big Sur Daytime Coast" },
  { id: 6, src: wallpaper6.src, alt: "Big Sur Rocky Shore" },
  { id: 7, src: wallpaper7.src, alt: "Big Sur Starlit Night" },
  { id: 8, src: wallpaper8.src, alt: "Helleborus Orientalis" },
  { id: 9, src: wallpaper9.src, alt: "Tiger Lily Vivid" },
  { id: 10, src: wallpaper10.src, alt: "macOS Sonoma Stock" },
];

const WallpaperSelector: React.FC<WallpaperSelectorProps> = ({
  onSelectWallpaper,
  closeWindow,
  currentWallpaper,
}) => {
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>(
    Object.fromEntries(wallpapers.map((w) => [w.id, true]))
  );

  const handleImageLoad = useCallback((id: number) => {
    setLoadingStates((prev) => ({
      ...prev,
      [id]: false,
    }));
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeWindow();
      }
    },
    [closeWindow]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-6 select-none animate-fade-in"
      onClick={closeWindow}
    >
      <div
        className="w-full max-w-4xl max-h-[88vh] apple-glass rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-black/15 dark:border-white/15 animate-modal-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS Window Titlebar */}
        <div className="h-11 px-4 flex items-center justify-between bg-white/60 dark:bg-apple-tile-1/80 border-b border-black/10 dark:border-white/10 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={closeWindow}
              aria-label="Close"
              className="apple-traffic-light bg-[#ff5f56] hover:brightness-90 active:brightness-75 group"
            >
              <X className="w-2 h-2 text-[#4c0000] opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
            </button>
            <span className="apple-traffic-light bg-[#ffbd2e]" />
            <span className="apple-traffic-light bg-[#27c93f]" />
          </div>

          <div className="flex items-center space-x-2 text-[13px] font-semibold text-gray-800 dark:text-gray-200">
            <ImageIcon className="w-4 h-4 text-apple-blue" />
            <span>System Settings — Wallpaper</span>
          </div>

          <button
            onClick={closeWindow}
            className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/15 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wallpapers Grid: Spacious layout with clear titles placed underneath */}
        <div className="p-5 sm:p-8 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-7 sm:gap-x-8 sm:gap-y-9">
          {wallpapers.map((wallpaper) => {
            const isCurrent = currentWallpaper === wallpaper.src;
            return (
              <div
                key={wallpaper.id}
                onClick={() => onSelectWallpaper(wallpaper.src)}
                className="group flex flex-col items-center cursor-pointer select-none"
              >
                {/* Wallpaper Thumbnail Card */}
                <div
                  className={`relative aspect-video w-full rounded-xl overflow-hidden shadow-md transition-all duration-200 border-2 ${
                    isCurrent
                      ? "border-apple-blue ring-4 ring-apple-blue/30 scale-[1.02] shadow-xl"
                      : "border-black/10 dark:border-white/10 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:border-apple-blue/50"
                  }`}
                >
                  <Image
                    src={wallpaper.src}
                    alt={wallpaper.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                      loadingStates[wallpaper.id] ? "opacity-0" : "opacity-100"
                    }`}
                    onLoad={() => handleImageLoad(wallpaper.id)}
                  />

                  {loadingStates[wallpaper.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse">
                      <div className="w-6 h-6 border-2 border-apple-blue border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Active Selected Badge */}
                  {isCurrent && (
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-apple-blue text-white shadow-lg">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Wallpaper Name Label - Clearly visible underneath the image */}
                <div className="mt-2.5 px-1 text-center w-full">
                  <p
                    className={`text-xs sm:text-[13px] font-semibold tracking-tight transition-colors truncate ${
                      isCurrent
                        ? "text-apple-blue"
                        : "text-gray-900 dark:text-gray-100 group-hover:text-apple-blue"
                    }`}
                  >
                    {wallpaper.alt}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-white/40 dark:bg-black/20 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <span>Click any wallpaper to apply instantly</span>
          <span className="hidden sm:inline">Press Esc to exit</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(WallpaperSelector);
