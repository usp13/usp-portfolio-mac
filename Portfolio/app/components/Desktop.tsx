import { useState } from "react";
import Image from "next/image";

interface DesktopProps {
  toggleWindow: (id: string) => void;
}

export default function Desktop({ toggleWindow }: DesktopProps) {
  const [pulsingId, setPulsingId] = useState<string | null>(null);

  const icons = [
    {
      id: "about",
      label: "About Me",
      iconSrc: "/icons/finder.png"
    },
    {
      id: "projects",
      label: "Projects",
      iconSrc: "/icons/appstore.png"
    },
    {
      id: "work-experience",
      label: "Experience",
      iconSrc: "/icons/notes.png"
    },
    {
      id: "contact",
      label: "Contact",
      iconSrc: "/icons/mail.png"
    },
    {
      id: "resume",
      label: "Resume",
      iconSrc: "/icons/reminders.png"
    }
  ];

  const handleClick = (id: string) => {
    setPulsingId(id);
    setTimeout(() => {
      setPulsingId((curr) => (curr === id ? null : curr));
    }, 300);
    toggleWindow(id);
  };

  return (
    <div className="absolute right-3 sm:right-6 top-10 p-2 flex flex-col gap-4 sm:gap-6 select-none z-10">
      {icons.map(({ id, label, iconSrc }) => (
        <button
          key={id}
          className="group flex flex-col items-center focus:outline-none w-16 sm:w-20"
          onClick={() => handleClick(id)}
        >
          <div
            className={`relative w-12 h-12 sm:w-14 sm:h-14 transition-all duration-150 group-hover:scale-105 group-active:scale-90 drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)] ${
              pulsingId === id ? "animate-icon-pulse" : ""
            }`}
          >
            <Image
              src={iconSrc}
              alt={label}
              width={64}
              height={64}
              className="w-full h-full object-contain pointer-events-none"
              priority
            />
          </div>
          <span className="mt-1 text-white text-[11px] sm:text-xs font-medium text-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] px-1.5 py-0.5 rounded group-focus:bg-[#0066cc] group-focus:text-white line-clamp-2 max-w-[76px]">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
