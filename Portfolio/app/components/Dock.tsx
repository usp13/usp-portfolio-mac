import { useState } from 'react';
import Image from 'next/image';

interface DockItemProps {
  id: string;
  label: string;
  isOpen?: boolean;
  isActive?: boolean;
  isBouncing?: boolean;
  transform: { scale: number; translateY: number };
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  iconSrc: string;
}

interface DockProps {
  toggleWindow: (id: string) => void;
  openWindows?: string[];
  activeWindow?: string | null;
}

const DockItem = ({
  label,
  isOpen,
  isActive,
  isBouncing,
  transform,
  isHovered,
  onClick,
  onMouseEnter,
  iconSrc,
}: DockItemProps) => (
  <div
    className="relative flex flex-col items-center group"
    onMouseEnter={onMouseEnter}
  >
    {/* macOS Tooltip */}
    <div
      className={`absolute -top-10 sm:-top-11 pointer-events-none z-50 transition-all duration-150 ease-out origin-bottom ${
        isHovered
          ? "opacity-100 scale-100 -translate-y-1"
          : "opacity-0 scale-90 pointer-events-none"
      }`}
    >
      <div className="px-2.5 py-1 bg-[#1e1e1e]/90 dark:bg-[#2c2c2e]/90 text-white rounded-md text-[11px] font-medium shadow-apple-window backdrop-blur-xl border border-white/10 whitespace-nowrap">
        {label}
      </div>
    </div>

    {/* App Icon Button with dynamic macOS physics */}
    <button
      onClick={onClick}
      aria-label={label}
      className={`relative w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 lg:w-[50px] lg:h-[50px] 
        flex items-center justify-center origin-bottom focus:outline-none 
        transition-transform duration-120 ease-out ${
          isBouncing ? "animate-dock-bounce" : "active:scale-95"
        }`}
      style={{
        transform: !isBouncing
          ? `scale(${transform.scale}) translateY(${transform.translateY}px)`
          : undefined,
      }}
    >
      <Image
        src={iconSrc}
        alt={label}
        width={56}
        height={56}
        className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)]"
        priority
      />
    </button>

    {/* macOS Active Dot Indicator */}
    <div className="h-1 mt-0.5 flex items-center justify-center">
      {isOpen && (
        <span
          className={`w-1 h-1 rounded-full transition-all duration-200 ${
            isActive
              ? "bg-apple-ink dark:bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] scale-125"
              : "bg-apple-ink/60 dark:bg-white/60"
          }`}
        />
      )}
    </div>
  </div>
);

export default function Dock({
  toggleWindow,
  openWindows = [],
  activeWindow = null,
}: DockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [bouncingId, setBouncingId] = useState<string | null>(null);

  const dockItems = [
    {
      id: "about",
      label: "About Me",
      iconSrc: "/icons/finder.png",
    },
    {
      id: "work-experience",
      label: "Experience",
      iconSrc: "/icons/notes.png",
    },
    {
      id: "projects",
      label: "Projects",
      iconSrc: "/icons/appstore.png",
    },
    {
      id: "contact",
      label: "Contact",
      iconSrc: "/icons/mail.png",
    },
    {
      id: "terminal",
      label: "Terminal",
      iconSrc: "/icons/terminal.png",
    },
    {
      id: "vscode",
      label: "VS Code",
      iconSrc: "/icons/vscode.png",
    },
    {
      id: "browser",
      label: "Safari Browser",
      iconSrc: "/icons/safari.png",
    },
    {
      id: "music-player",
      label: "Spotify",
      iconSrc: "/icons/spotify-icon.png",
    },
    {
      id: "resume",
      label: "Resume",
      iconSrc: "/icons/reminders.png",
    },
    {
      id: "flappy-bird",
      label: "Flappy Bird",
      iconSrc: "/icons/game.png",
    },
  ];

  const getTransform = (index: number) => {
    if (hoveredIndex === null) return { scale: 1, translateY: 0 };
    const dist = Math.abs(hoveredIndex - index);
    if (dist === 0) return { scale: 1.32, translateY: -12 };
    if (dist === 1) return { scale: 1.16, translateY: -6 };
    if (dist === 2) return { scale: 1.05, translateY: -2 };
    return { scale: 1, translateY: 0 };
  };

  const handleItemClick = (id: string) => {
    // Trigger macOS bounce out of the dock box
    setBouncingId(id);
    setTimeout(() => {
      setBouncingId((curr) => (curr === id ? null : curr));
    }, 850);
    toggleWindow(id);
  };

  return (
    <nav
      aria-label="macOS Dock"
      className="fixed bottom-2 sm:bottom-3.5 left-1/2 transform -translate-x-1/2 w-auto max-w-[98vw] z-40"
    >
      <div
        onMouseLeave={() => setHoveredIndex(null)}
        className="flex items-end gap-1 xs:gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 
          bg-white/40 dark:bg-black/45 
          backdrop-blur-2xl rounded-2xl shadow-apple-dock
          border border-white/50 dark:border-white/15 
          transition-all duration-300 overflow-visible relative"
      >
        {dockItems.map((item, index) => (
          <DockItem
            key={item.id}
            id={item.id}
            label={item.label}
            iconSrc={item.iconSrc}
            isOpen={openWindows.includes(item.id)}
            isActive={activeWindow === item.id}
            isBouncing={bouncingId === item.id}
            transform={getTransform(index)}
            isHovered={hoveredIndex === index}
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() => handleItemClick(item.id)}
          />
        ))}
      </div>
    </nav>
  );
}
