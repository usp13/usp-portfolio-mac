import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Wifi,
  WifiOff,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  BatteryWarning,
  BatteryCharging,
  Sun,
  Moon,
  Sliders,
  Search,
  Settings,
  Maximize2,
  Minimize2,
  X,
  Check,
  Bluetooth,
  Radio,
  Volume2,
  VolumeX,
  Volume1,
  RotateCcw,
  Lock,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Terminal,
  Code,
  Compass,
  Music,
  FileText,
  Gamepad2,
  User,
  Briefcase,
  FolderGit2,
  Mail,
  Command,
  Zap,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import Calendar from "./Calendar";
import WallpaperSelector from "./WallpaperSel";
import useBatteryStatus from "../hooks/useBatteryStatus";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

interface MenuBarProps {
  switchWallpaper: (wallpaperSrc: string) => void;
  currentWallpaper?: string;
  toggleWindow?: (id: string) => void;
  openWindows?: string[];
  activeWindow?: string | null;
  closeAllWindows?: () => void;
  bringToFront?: (id: string) => void;
}

const APP_META: Record<string, { name: string; icon: React.ComponentType<{ className?: string }> }> = {
  about: { name: "About Me", icon: User },
  "work-experience": { name: "Experience", icon: Briefcase },
  projects: { name: "Projects", icon: FolderGit2 },
  contact: { name: "Contact", icon: Mail },
  vscode: { name: "VS Code", icon: Code },
  browser: { name: "Safari", icon: Compass },
  terminal: { name: "Terminal", icon: Terminal },
  "music-player": { name: "Spotify", icon: Music },
  resume: { name: "Resume", icon: FileText },
  "flappy-bird": { name: "Flappy Bird", icon: Gamepad2 },
};

const ALL_APPS = [
  { id: "about", name: "About Me", category: "Application", shortcut: "Finder" },
  { id: "work-experience", name: "Work Experience", category: "Application", shortcut: "Notes" },
  { id: "projects", name: "My Projects", category: "Application", shortcut: "App Store" },
  { id: "contact", name: "Contact Me", category: "Application", shortcut: "Mail" },
  { id: "terminal", name: "Terminal", category: "Developer", shortcut: "⌘T" },
  { id: "vscode", name: "Visual Studio Code", category: "Developer", shortcut: "Code" },
  { id: "browser", name: "Safari Browser", category: "Application", shortcut: "Web" },
  { id: "music-player", name: "Spotify Music", category: "Entertainment", shortcut: "Music" },
  { id: "resume", name: "Curriculum Vitae (Resume)", category: "Document", shortcut: "PDF" },
  { id: "flappy-bird", name: "Flappy Bird Game", category: "Game", shortcut: "Play" },
];

const SKILLS = [
  { name: "React & Next.js 15", category: "Frontend Framework", appId: "vscode" },
  { name: "TypeScript & JavaScript", category: "Language", appId: "vscode" },
  { name: "Python & PyTorch", category: "AI & ML", appId: "terminal" },
  { name: "Tailwind CSS & Glassmorphism", category: "Design System", appId: "vscode" },
  { name: "Generative AI & LLMs", category: "AI Architecture", appId: "browser" },
  { name: "FastAPI & Node.js", category: "Backend Engine", appId: "vscode" },
];

const MenuBar: React.FC<MenuBarProps> = ({
  switchWallpaper,
  currentWallpaper,
  toggleWindow,
  openWindows = [],
  activeWindow = null,
  closeAllWindows,
}) => {
  const { theme, toggleTheme } = useTheme() as ThemeContextType;
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const batteryStatus = useBatteryStatus();
  
  // Interactive Controls State
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isWallpaperSelectorOpen, setIsWallpaperSelectorOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [hudMessage, setHudMessage] = useState<string | null>(null);

  // Control Center Interactive State
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [currentWifiNetwork, setCurrentWifiNetwork] = useState("Utsav_Fiber_5G");
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [airdropMode, setAirdropMode] = useState<"Contacts" | "Everyone" | "Off">("Contacts");
  const [focusMode, setFocusMode] = useState(false);
  const [brightness, setBrightness] = useState<number>(100);
  const [volume, setVolume] = useState<number>(85);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);

  // Spotlight Search State
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState("");
  const [spotlightSelectedIndex, setSpotlightSelectedIndex] = useState(0);

  const menuRef = useRef<HTMLDivElement>(null);
  const spotlightInputRef = useRef<HTMLInputElement>(null);
  const hudTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Time updater
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // HUD toast notifier
  const showHud = useCallback((message: string) => {
    if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    setHudMessage(message);
    hudTimeoutRef.current = setTimeout(() => {
      setHudMessage(null);
    }, 1900);
  }, []);

  // Global Click Outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K -> Spotlight
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
        setActiveMenu(null);
      }
      // Cmd+/ or Ctrl+/ -> Shortcuts modal
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      }
      // Escape -> close menus / modals
      if (e.key === "Escape") {
        setActiveMenu(null);
        setIsSpotlightOpen(false);
        setIsShortcutsModalOpen(false);
        setIsRestartModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto focus spotlight input
  useEffect(() => {
    if (isSpotlightOpen) {
      setTimeout(() => spotlightInputRef.current?.focus(), 50);
      setSpotlightQuery("");
      setSpotlightSelectedIndex(0);
    }
  }, [isSpotlightOpen]);

  // Brightness filter overlay effect
  useEffect(() => {
    const dimmer = document.getElementById("macos-brightness-overlay");
    if (dimmer) {
      const opacity = Math.max(0, (100 - brightness) / 130);
      dimmer.style.opacity = `${opacity}`;
    }
  }, [brightness]);

  const handleFullscreenToggle = async (): Promise<void> => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        showHud("Entered Full Screen");
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        showHud("Exited Full Screen");
      }
    } catch {
      setIsFullscreen(!isFullscreen);
    }
  };

  const toggleMenu = (menuName: string) => {
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  // Hovering across menus when one is open switches automatically
  const handleMenuMouseEnter = (menuName: string) => {
    if (activeMenu !== null && activeMenu !== menuName) {
      const isTopNav = ["apple", "app", "file", "edit", "view", "window", "help"].includes(activeMenu);
      const isTargetTopNav = ["apple", "app", "file", "edit", "view", "window", "help"].includes(menuName);
      if (isTopNav && isTargetTopNav) {
        setActiveMenu(menuName);
      }
    }
  };

  const executeAction = (action: () => void) => {
    action();
    setActiveMenu(null);
  };

  // Active App Name logic
  const activeAppLabel = activeWindow && APP_META[activeWindow]
    ? APP_META[activeWindow].name
    : "Finder";

  // Battery icon rendering
  const renderBatteryIcon = (): React.ReactNode => {
    const { level, charging } = batteryStatus;
    if (charging) {
      return <BatteryCharging className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />;
    }
    if (level > 75) return <BatteryFull className="w-3.5 h-3.5 text-current" />;
    if (level > 25) return <BatteryMedium className="w-3.5 h-3.5 text-current" />;
    if (level > 10) return <BatteryLow className="w-3.5 h-3.5 text-amber-500" />;
    return <BatteryWarning className="w-3.5 h-3.5 text-red-500 animate-pulse" />;
  };

  const renderVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-3.5 h-3.5" />;
    if (volume < 50) return <Volume1 className="w-3.5 h-3.5" />;
    return <Volume2 className="w-3.5 h-3.5" />;
  };

  // Spotlight search results
  const filteredSpotlightItems = [
    ...ALL_APPS.filter(
      (app) =>
        app.name.toLowerCase().includes(spotlightQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(spotlightQuery.toLowerCase())
    ).map((app) => ({
      type: "app",
      id: app.id,
      title: app.name,
      subtitle: app.category,
      badge: app.shortcut,
      action: () => toggleWindow?.(app.id),
    })),
    ...SKILLS.filter(
      (s) =>
        s.name.toLowerCase().includes(spotlightQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(spotlightQuery.toLowerCase())
    ).map((s) => ({
      type: "skill",
      id: s.appId,
      title: s.name,
      subtitle: `Skill • ${s.category}`,
      badge: "Open in Code",
      action: () => toggleWindow?.(s.appId),
    })),
    {
      type: "action",
      id: "wallpaper",
      title: "Change Wallpaper",
      subtitle: "System Settings • Display",
      badge: "Preferences",
      action: () => setIsWallpaperSelectorOpen(true),
    },
    {
      type: "action",
      id: "theme",
      title: `Switch to ${theme === "light" ? "Dark" : "Light"} Mode`,
      subtitle: "Appearance • Theme",
      badge: "Toggle",
      action: () => toggleTheme(),
    },
    {
      type: "action",
      id: "shortcuts",
      title: "Keyboard Shortcuts Cheat Sheet",
      subtitle: "Help • Shortcuts",
      badge: "⌘/",
      action: () => setIsShortcutsModalOpen(true),
    },
  ].filter(
    (item) =>
      spotlightQuery === "" ||
      item.title.toLowerCase().includes(spotlightQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(spotlightQuery.toLowerCase())
  );

  const handleSpotlightSelect = (index: number) => {
    const item = filteredSpotlightItems[index];
    if (item) {
      item.action();
      setIsSpotlightOpen(false);
    }
  };

  return (
    <>
      {/* Real-time Screen Brightness Overlay */}
      <div
        id="macos-brightness-overlay"
        className="fixed inset-0 bg-black pointer-events-none z-[45] transition-opacity duration-150"
        style={{ opacity: 0 }}
      />

      {/* Floating macOS HUD Pill Toast */}
      {hudMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[90] px-4 py-2 rounded-2xl apple-glass shadow-2xl border border-black/10 dark:border-white/10 flex items-center justify-center animate-fade-in">
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{hudMessage}</span>
        </div>
      )}

      {/* Main Top macOS Menu Bar */}
      <header
        ref={menuRef}
        className="apple-menubar fixed top-0 left-0 right-0 h-7 sm:h-8 flex items-center justify-between px-2 sm:px-3 z-50 text-[13px] text-black dark:text-white transition-colors duration-200 select-none"
      >
        {/* Left: Apple Logo, App Name, and Menus */}
        <div className="flex items-center space-x-0.5 sm:space-x-1">
          {/*  Apple Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("apple")}
              onMouseEnter={() => handleMenuMouseEnter("apple")}
              className={`px-2 py-0.5 rounded transition-colors flex items-center justify-center focus:outline-none ${
                activeMenu === "apple"
                  ? "bg-apple-blue text-white"
                  : "hover:bg-black/10 dark:hover:bg-white/15"
              }`}
              aria-label="Apple Menu"
            >
              <svg
                className={`w-3.5 h-[17px] transition-colors duration-150 shrink-0 ${
                  activeMenu === "apple" ? "fill-white" : "fill-current"
                }`}
                viewBox="0 0 814 1000"
              >
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
              </svg>
            </button>

            {/* Apple Menu Dropdown */}
            {activeMenu === "apple" && (
              <div className="absolute left-0 top-7 w-60 apple-glass rounded-xl shadow-2xl py-1.5 text-xs border border-black/10 dark:border-white/10 z-50 animate-menu-dropdown">
                <button
                  onClick={() => executeAction(() => toggleWindow?.("about"))}
                  className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                >
                  <span className="font-medium">About This Mac</span>
                  <span className="text-[10px] opacity-60">Sonoma 15</span>
                </button>
                <div className="my-1 border-t border-black/5 dark:border-white/10" />

                <button
                  onClick={() => executeAction(() => setIsWallpaperSelectorOpen(true))}
                  className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>System Settings...</span>
                  <span className="text-[10px] opacity-60">⌘,</span>
                </button>

                <button
                  onClick={() => executeAction(() => toggleWindow?.("projects"))}
                  className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>App Store (Projects)</span>
                  <span className="text-[10px] opacity-60">12 Apps</span>
                </button>

                <div className="my-1 border-t border-black/5 dark:border-white/10" />

                <button
                  onClick={() => executeAction(() => toggleWindow?.("terminal"))}
                  className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors"
                >
                  Developer Terminal
                </button>

                <button
                  onClick={() => executeAction(() => toggleWindow?.("resume"))}
                  className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors"
                >
                  View Resume (PDF)
                </button>

                <div className="my-1 border-t border-black/5 dark:border-white/10" />

                <button
                  onClick={() => executeAction(() => setIsLocked(true))}
                  className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Lock Screen / Sleep</span>
                  <span className="text-[10px] opacity-60">⌃⌘Q</span>
                </button>

                <button
                  onClick={() => executeAction(() => setIsRestartModalOpen(true))}
                  className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors"
                >
                  Restart...
                </button>

                <button
                  onClick={() => executeAction(() => setIsRestartModalOpen(true))}
                  className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors"
                >
                  Shut Down...
                </button>
              </div>
            )}
          </div>

          {/* Active App Title */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("app")}
              onMouseEnter={() => handleMenuMouseEnter("app")}
              className={`px-2 py-0.5 rounded font-bold text-xs sm:text-[13px] transition-colors ${
                activeMenu === "app"
                  ? "bg-apple-blue text-white"
                  : "hover:bg-black/10 dark:hover:bg-white/15"
              }`}
            >
              {activeAppLabel}
            </button>

            {/* App Menu Dropdown */}
            {activeMenu === "app" && (
              <div className="absolute left-0 top-7 w-52 apple-glass rounded-xl shadow-2xl py-1.5 text-xs border border-black/10 dark:border-white/10 z-50 animate-menu-dropdown">
                <div className="px-3 py-1 font-semibold text-gray-500 text-[11px]">
                  {activeAppLabel} Portfolio Suite
                </div>
                <div className="my-1 border-t border-black/5 dark:border-white/10" />
                <button
                  onClick={() => executeAction(() => setIsWallpaperSelectorOpen(true))}
                  className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors"
                >
                  Settings & Wallpaper...
                </button>
                <button
                  onClick={() => executeAction(() => showHud("App hidden"))}
                  className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Hide {activeAppLabel}</span>
                  <span className="text-[10px] opacity-60">⌘H</span>
                </button>
                {activeWindow && (
                  <button
                    onClick={() => executeAction(() => toggleWindow?.(activeWindow))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between text-red-500 hover:text-white"
                  >
                    <span>Quit {activeAppLabel}</span>
                    <span className="text-[10px] opacity-60">⌘Q</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Menus: File, Edit, View, Window, Help */}
          <div className="hidden md:flex items-center space-x-0.5">
            {/* File Menu */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("file")}
                onMouseEnter={() => handleMenuMouseEnter("file")}
                className={`px-2 py-0.5 rounded text-xs sm:text-[13px] transition-colors ${
                  activeMenu === "file"
                    ? "bg-apple-blue text-white"
                    : "hover:bg-black/10 dark:hover:bg-white/15"
                }`}
              >
                File
              </button>

              {activeMenu === "file" && (
                <div className="absolute left-0 top-7 w-56 apple-glass rounded-xl shadow-2xl py-1.5 text-xs border border-black/10 dark:border-white/10 z-50 animate-menu-dropdown">
                  <button
                    onClick={() => executeAction(() => toggleWindow?.("terminal"))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>New Terminal Window</span>
                    <span className="text-[10px] opacity-60">⌘T</span>
                  </button>
                  <button
                    onClick={() => executeAction(() => toggleWindow?.("vscode"))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Open VS Code</span>
                    <span className="text-[10px] opacity-60">⌥C</span>
                  </button>
                  <button
                    onClick={() => executeAction(() => toggleWindow?.("browser"))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Open Safari</span>
                    <span className="text-[10px] opacity-60">⌥S</span>
                  </button>
                  <button
                    onClick={() => executeAction(() => toggleWindow?.("resume"))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Open Resume</span>
                    <span className="text-[10px] opacity-60">⌥R</span>
                  </button>
                  <div className="my-1 border-t border-black/5 dark:border-white/10" />
                  <button
                    onClick={() =>
                      executeAction(() => {
                        if (activeWindow) toggleWindow?.(activeWindow);
                        else showHud("No active window to close");
                      })
                    }
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Close Active Window</span>
                    <span className="text-[10px] opacity-60">⌘W</span>
                  </button>
                  <button
                    onClick={() =>
                      executeAction(() => {
                        closeAllWindows?.();
                        showHud("All windows closed");
                      })
                    }
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Close All Windows</span>
                    <span className="text-[10px] opacity-60">⌥⌘W</span>
                  </button>
                </div>
              )}
            </div>

            {/* Edit Menu */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("edit")}
                onMouseEnter={() => handleMenuMouseEnter("edit")}
                className={`px-2 py-0.5 rounded text-xs sm:text-[13px] transition-colors ${
                  activeMenu === "edit"
                    ? "bg-apple-blue text-white"
                    : "hover:bg-black/10 dark:hover:bg-white/15"
                }`}
              >
                Edit
              </button>

              {activeMenu === "edit" && (
                <div className="absolute left-0 top-7 w-48 apple-glass rounded-xl shadow-2xl py-1.5 text-xs border border-black/10 dark:border-white/10 z-50 animate-menu-dropdown">
                  <button
                    onClick={() => executeAction(() => showHud("Undo"))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Undo</span>
                    <span className="text-[10px] opacity-60">⌘Z</span>
                  </button>
                  <button
                    onClick={() => executeAction(() => showHud("Redo"))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Redo</span>
                    <span className="text-[10px] opacity-60">⇧⌘Z</span>
                  </button>
                  <div className="my-1 border-t border-black/5 dark:border-white/10" />
                  <button
                    onClick={() => executeAction(() => showHud("Cut to clipboard"))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Cut</span>
                    <span className="text-[10px] opacity-60">⌘X</span>
                  </button>
                  <button
                    onClick={() => executeAction(() => showHud("Copied to clipboard"))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Copy</span>
                    <span className="text-[10px] opacity-60">⌘C</span>
                  </button>
                  <button
                    onClick={() => executeAction(() => showHud("Pasted"))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Paste</span>
                    <span className="text-[10px] opacity-60">⌘V</span>
                  </button>
                  <button
                    onClick={() => executeAction(() => showHud("All elements selected"))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Select All</span>
                    <span className="text-[10px] opacity-60">⌘A</span>
                  </button>
                </div>
              )}
            </div>

            {/* View Menu */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("view")}
                onMouseEnter={() => handleMenuMouseEnter("view")}
                className={`px-2 py-0.5 rounded text-xs sm:text-[13px] transition-colors ${
                  activeMenu === "view"
                    ? "bg-apple-blue text-white"
                    : "hover:bg-black/10 dark:hover:bg-white/15"
                }`}
              >
                View
              </button>

              {activeMenu === "view" && (
                <div className="absolute left-0 top-7 w-60 apple-glass rounded-xl shadow-2xl py-1.5 text-xs border border-black/10 dark:border-white/10 z-50 animate-menu-dropdown">
                  <button
                    onClick={() => executeAction(handleFullscreenToggle)}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{isFullscreen ? "Exit Full Screen" : "Enter Full Screen"}</span>
                    <span className="text-[10px] opacity-60">⌃⌘F</span>
                  </button>
                  <button
                    onClick={() => executeAction(toggleTheme)}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Toggle {theme === "light" ? "Dark" : "Light"} Mode</span>
                    <span className="text-[10px] opacity-60">⌥T</span>
                  </button>
                  <button
                    onClick={() => executeAction(() => setIsWallpaperSelectorOpen(true))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors"
                  >
                    Change Desktop Wallpaper...
                  </button>
                  <div className="my-1 border-t border-black/5 dark:border-white/10" />
                  <button
                    onClick={() =>
                      executeAction(() => {
                        closeAllWindows?.();
                        showHud("Desktop shown");
                      })
                    }
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors"
                  >
                    Show Desktop (Hide All)
                  </button>
                </div>
              )}
            </div>

            {/* Window Menu */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("window")}
                onMouseEnter={() => handleMenuMouseEnter("window")}
                className={`px-2 py-0.5 rounded text-xs sm:text-[13px] transition-colors ${
                  activeMenu === "window"
                    ? "bg-apple-blue text-white"
                    : "hover:bg-black/10 dark:hover:bg-white/15"
                }`}
              >
                Window
              </button>

              {activeMenu === "window" && (
                <div className="absolute left-0 top-7 w-64 apple-glass rounded-xl shadow-2xl py-1.5 text-xs border border-black/10 dark:border-white/10 z-50 animate-menu-dropdown">
                  <button
                    onClick={() =>
                      executeAction(() => {
                        if (activeWindow) toggleWindow?.(activeWindow);
                      })
                    }
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Minimize</span>
                    <span className="text-[10px] opacity-60">⌘M</span>
                  </button>
                  <button
                    onClick={() => executeAction(handleFullscreenToggle)}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors"
                  >
                    Zoom Window
                  </button>
                  <div className="my-1 border-t border-black/5 dark:border-white/10" />
                  <div className="px-3 py-1 font-semibold text-[11px] text-gray-500">Open Applications</div>
                  {ALL_APPS.map((app) => {
                    const isOpen = openWindows.includes(app.id);
                    const isActive = activeWindow === app.id;
                    return (
                      <button
                        key={app.id}
                        onClick={() => executeAction(() => toggleWindow?.(app.id))}
                        className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center space-x-2">
                          <span className="w-3 text-center">{isOpen ? "✓" : ""}</span>
                          <span className={isActive ? "font-bold" : ""}>{app.name}</span>
                        </span>
                        {isActive && <span className="text-[10px] opacity-60">Front</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Help Menu */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("help")}
                onMouseEnter={() => handleMenuMouseEnter("help")}
                className={`px-2 py-0.5 rounded text-xs sm:text-[13px] transition-colors ${
                  activeMenu === "help"
                    ? "bg-apple-blue text-white"
                    : "hover:bg-black/10 dark:hover:bg-white/15"
                }`}
              >
                Help
              </button>

              {activeMenu === "help" && (
                <div className="absolute left-0 top-7 w-60 apple-glass rounded-xl shadow-2xl py-1.5 text-xs border border-black/10 dark:border-white/10 z-50 animate-menu-dropdown">
                  <button
                    onClick={() => executeAction(() => setIsShortcutsModalOpen(true))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Keyboard Shortcuts</span>
                    <span className="text-[10px] opacity-60">⌘/</span>
                  </button>
                  <button
                    onClick={() => executeAction(() => toggleWindow?.("about"))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors"
                  >
                    Portfolio Tour & Information
                  </button>
                  <button
                    onClick={() => executeAction(() => toggleWindow?.("contact"))}
                    className="w-full text-left px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors"
                  >
                    Contact Developer
                  </button>
                  <div className="my-1 border-t border-black/5 dark:border-white/10" />
                  <a
                    href="https://github.com/usp13"
                    target="_blank"
                    rel="noreferrer"
                    className="block px-3 py-1.5 hover:bg-apple-blue hover:text-white transition-colors"
                  >
                    View Source on GitHub ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Status Indicators, Control Center, Settings & Clock */}
        <div className="flex items-center space-x-1 sm:space-x-1.5">
          {/* Battery Status */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("battery")}
              className={`flex items-center space-x-1 px-1.5 py-0.5 rounded transition-colors ${
                activeMenu === "battery"
                  ? "bg-apple-blue text-white"
                  : "hover:bg-black/10 dark:hover:bg-white/15"
              }`}
              aria-label="Battery Status"
            >
              {renderBatteryIcon()}
              <span className="text-[11px] sm:text-xs font-medium">{batteryStatus.level}%</span>
            </button>

            {/* Battery Dropdown */}
            {activeMenu === "battery" && (
              <div className="absolute right-0 top-7 w-64 apple-glass rounded-2xl shadow-2xl p-3.5 z-50 text-xs border border-black/10 dark:border-white/10 animate-menu-dropdown-right">
                <div className="flex items-center justify-between pb-2.5 border-b border-black/5 dark:border-white/10">
                  <span className="font-semibold text-sm">Battery</span>
                  <span className="text-apple-blue font-bold text-sm">{batteryStatus.level}%</span>
                </div>
                <div className="py-2.5 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Power Source:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {batteryStatus.charging ? "Power Adapter" : "Battery"}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Battery Health:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Normal (98%)</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-black/5 dark:border-white/10">
                  <button
                    onClick={() => {
                      setLowPowerMode(!lowPowerMode);
                      showHud(`Low Power Mode ${!lowPowerMode ? "Enabled" : "Disabled"}`);
                    }}
                    className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <span>Low Power Mode</span>
                    <span
                      className={`w-8 h-4.5 rounded-full flex items-center p-0.5 transition-colors ${
                        lowPowerMode ? "bg-emerald-500 justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsWallpaperSelectorOpen(true);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left py-1 px-2 text-[11px] text-gray-500 hover:text-apple-blue transition-colors mt-1"
                  >
                    Energy & Display Settings...
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wi-Fi Indicator */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("wifi")}
              className={`p-1 rounded transition-colors hidden xs:flex items-center justify-center ${
                activeMenu === "wifi"
                  ? "bg-apple-blue text-white"
                  : "hover:bg-black/10 dark:hover:bg-white/15"
              }`}
              aria-label="Wi-Fi Settings"
            >
              {wifiEnabled ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 text-red-500" />}
            </button>

            {/* Wi-Fi Dropdown */}
            {activeMenu === "wifi" && (
              <div className="absolute right-0 top-7 w-64 apple-glass rounded-2xl shadow-2xl p-3.5 z-50 text-xs border border-black/10 dark:border-white/10 animate-menu-dropdown-right">
                <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
                  <span className="font-semibold text-sm">Wi-Fi</span>
                  <button
                    onClick={() => {
                      setWifiEnabled(!wifiEnabled);
                      showHud(`Wi-Fi ${!wifiEnabled ? "Turned On" : "Turned Off"}`);
                    }}
                    className={`w-8 h-4.5 rounded-full flex items-center p-0.5 transition-colors ${
                      wifiEnabled ? "bg-apple-blue justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
                {wifiEnabled ? (
                  <div className="py-2 space-y-1">
                    <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider px-1">Known Networks</div>
                    {["Utsav_Fiber_5G", "Apple_Guest", "Starlink_Orbit"].map((net) => (
                      <button
                        key={net}
                        onClick={() => {
                          setCurrentWifiNetwork(net);
                          showHud(`Connected to ${net}`);
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${
                          currentWifiNetwork === net
                            ? "bg-apple-blue/15 text-apple-blue font-semibold"
                            : "hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <Wifi className="w-3.5 h-3.5" />
                          <span>{net}</span>
                        </span>
                        {currentWifiNetwork === net && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-3 text-center text-xs text-gray-500">Wi-Fi is turned off</div>
                )}
              </div>
            )}
          </div>

          {/* Spotlight Search Button */}
          <button
            onClick={() => {
              setIsSpotlightOpen(true);
              setActiveMenu(null);
            }}
            aria-label="Spotlight Search (⌘K)"
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors focus:outline-none"
            title="Spotlight Search (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Control Center Toggle */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("control-center")}
              aria-label="Control Center"
              className={`p-1 rounded transition-colors ${
                activeMenu === "control-center"
                  ? "bg-apple-blue text-white"
                  : "hover:bg-black/10 dark:hover:bg-white/15"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>

            {/* macOS Sonoma Control Center Dropdown */}
            {activeMenu === "control-center" && (
              <div className="absolute right-0 top-8 w-80 apple-glass rounded-2xl shadow-2xl p-3.5 z-50 text-xs border border-black/10 dark:border-white/10 animate-menu-dropdown-right space-y-3">
                {/* 2x2 Network & Connection Tiles */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Wi-Fi Card */}
                  <button
                    onClick={() => {
                      setWifiEnabled(!wifiEnabled);
                      showHud(`Wi-Fi ${!wifiEnabled ? "On" : "Off"}`);
                    }}
                    className={`p-2.5 rounded-xl border flex items-center space-x-2.5 transition-all text-left ${
                      wifiEnabled
                        ? "bg-white/80 dark:bg-gray-800/80 border-black/5 dark:border-white/10 shadow-sm"
                        : "bg-black/5 dark:bg-white/5 opacity-60 border-transparent"
                    }`}
                  >
                    <div className={`p-2 rounded-full transition-colors ${wifiEnabled ? "bg-apple-blue text-white" : "bg-gray-400 text-white"}`}>
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-xs leading-none">Wi-Fi</p>
                      <p className="text-[10px] text-gray-500 mt-1 truncate">{wifiEnabled ? currentWifiNetwork : "Off"}</p>
                    </div>
                  </button>

                  {/* Bluetooth Card */}
                  <button
                    onClick={() => {
                      setBluetoothEnabled(!bluetoothEnabled);
                      showHud(`Bluetooth ${!bluetoothEnabled ? "On" : "Off"}`);
                    }}
                    className={`p-2.5 rounded-xl border flex items-center space-x-2.5 transition-all text-left ${
                      bluetoothEnabled
                        ? "bg-white/80 dark:bg-gray-800/80 border-black/5 dark:border-white/10 shadow-sm"
                        : "bg-black/5 dark:bg-white/5 opacity-60 border-transparent"
                    }`}
                  >
                    <div className={`p-2 rounded-full transition-colors ${bluetoothEnabled ? "bg-apple-blue text-white" : "bg-gray-400 text-white"}`}>
                      <Bluetooth className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-xs leading-none">Bluetooth</p>
                      <p className="text-[10px] text-gray-500 mt-1 truncate">{bluetoothEnabled ? "AirPods Pro" : "Off"}</p>
                    </div>
                  </button>

                  {/* AirDrop Card */}
                  <button
                    onClick={() => {
                      const nextMode = airdropMode === "Contacts" ? "Everyone" : airdropMode === "Everyone" ? "Off" : "Contacts";
                      setAirdropMode(nextMode);
                      showHud(`AirDrop: ${nextMode}`);
                    }}
                    className="p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-black/5 dark:border-white/10 flex items-center space-x-2.5 text-left"
                  >
                    <div className={`p-2 rounded-full ${airdropMode !== "Off" ? "bg-apple-blue text-white" : "bg-gray-400 text-white"}`}>
                      <Radio className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-xs leading-none">AirDrop</p>
                      <p className="text-[10px] text-gray-500 mt-1 truncate">{airdropMode}</p>
                    </div>
                  </button>

                  {/* Focus / Do Not Disturb */}
                  <button
                    onClick={() => {
                      setFocusMode(!focusMode);
                      showHud(`Focus Mode ${!focusMode ? "Enabled" : "Disabled"}`);
                    }}
                    className={`p-2.5 rounded-xl border flex items-center space-x-2.5 transition-all text-left ${
                      focusMode
                        ? "bg-purple-600 text-white border-purple-500"
                        : "bg-white/80 dark:bg-gray-800/80 border-black/5 dark:border-white/10"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${focusMode ? "bg-white/20 text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"}`}>
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-xs leading-none">Focus</p>
                      <p className={`text-[10px] mt-1 ${focusMode ? "text-purple-200" : "text-gray-500"}`}>{focusMode ? "On" : "Off"}</p>
                    </div>
                  </button>
                </div>

                {/* Display Brightness Slider */}
                <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-black/5 dark:border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Display</span>
                    <span className="text-[10px] text-gray-500 font-normal">{brightness}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-gray-500 shrink-0" />
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-apple-blue h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Sound Volume Slider */}
                <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-black/5 dark:border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Sound</span>
                    <span className="text-[10px] text-gray-500 font-normal">{volume}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setVolume(volume === 0 ? 80 : 0)}
                      className="text-gray-500 hover:text-apple-blue transition-colors"
                    >
                      {renderVolumeIcon()}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full accent-apple-blue h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Now Playing Widget */}
                <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-black/5 dark:border-white/10 flex items-center justify-between">
                  <div
                    className="flex items-center space-x-2.5 cursor-pointer flex-1 mr-2"
                    onClick={() => {
                      toggleWindow?.("music-player");
                      setActiveMenu(null);
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Music className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-xs leading-none truncate">Starboy — Coding Mix</p>
                      <p className="text-[10px] text-gray-500 mt-1 truncate">Spotify • Utsav Playlist</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => showHud("Previous Track")}
                      className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <SkipBack className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsPlayingMusic(!isPlayingMusic);
                        showHud(isPlayingMusic ? "Paused" : "Playing");
                      }}
                      className="p-1.5 bg-apple-blue text-white rounded-full shadow-sm hover:scale-105 active:scale-95 transition-transform"
                    >
                      {isPlayingMusic ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => showHud("Next Track")}
                      className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              toggleTheme();
              showHud(`${theme === "light" ? "Dark" : "Light"} Mode Enabled`);
            }}
            aria-label="Toggle Theme"
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-transform active:rotate-45"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          {/* Wallpaper & Appearance Settings */}
          <button
            onClick={() => {
              setIsWallpaperSelectorOpen(true);
              setActiveMenu(null);
            }}
            aria-label="Wallpaper Settings"
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
            title="System Settings — Wallpapers"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Clock & Calendar Trigger */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("calendar")}
              className={`px-1.5 py-0.5 rounded font-medium text-[11px] sm:text-xs transition-colors ${
                activeMenu === "calendar"
                  ? "bg-apple-blue text-white"
                  : "hover:bg-black/10 dark:hover:bg-white/15"
              }`}
            >
              {dateTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
                "  " +
                dateTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}
            </button>

            {/* Calendar Widget Dropdown */}
            {activeMenu === "calendar" && (
              <div className="absolute top-8 right-0 z-50">
                <Calendar />
              </div>
            )}
          </div>

          {/* Fullscreen Button (Desktop) */}
          <button
            onClick={handleFullscreenToggle}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/15 transition-colors hidden lg:block"
            title="Toggle Fullscreen (⌃⌘F)"
          >
            {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        </div>
      </header>

      {/* Spotlight Search Modal Overlay */}
      {isSpotlightOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-center items-start pt-[12vh] p-4 select-none animate-fade-in"
          onClick={() => setIsSpotlightOpen(false)}
        >
          <div
            className="w-full max-w-xl apple-glass rounded-2xl shadow-2xl border border-black/15 dark:border-white/15 overflow-hidden animate-spotlight"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Spotlight Input Header */}
            <div className="h-14 px-4 flex items-center space-x-3 border-b border-black/10 dark:border-white/10">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                ref={spotlightInputRef}
                type="text"
                value={spotlightQuery}
                onChange={(e) => {
                  setSpotlightQuery(e.target.value);
                  setSpotlightSelectedIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSpotlightSelectedIndex((prev) =>
                      Math.min(filteredSpotlightItems.length - 1, prev + 1)
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSpotlightSelectedIndex((prev) => Math.max(0, prev - 1));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    handleSpotlightSelect(spotlightSelectedIndex);
                  }
                }}
                placeholder="Spotlight Search applications, skills, actions..."
                className="w-full bg-transparent text-sm sm:text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
              />
              <span className="text-[11px] font-semibold text-gray-400 bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-md shrink-0">
                ESC to close
              </span>
            </div>

            {/* Spotlight Results List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-black/5 dark:divide-white/5">
              {filteredSpotlightItems.length > 0 ? (
                filteredSpotlightItems.map((item, index) => {
                  const isSelected = index === spotlightSelectedIndex;
                  return (
                    <div
                      key={`${item.id}-${index}`}
                      onClick={() => handleSpotlightSelect(index)}
                      onMouseEnter={() => setSpotlightSelectedIndex(index)}
                      className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-apple-blue text-white"
                          : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`p-2 rounded-lg ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-apple-blue/10 text-apple-blue dark:text-blue-400"
                          }`}
                        >
                          {item.type === "app" ? (
                            <Command className="w-4 h-4" />
                          ) : item.type === "skill" ? (
                            <Code className="w-4 h-4" />
                          ) : (
                            <Zap className="w-4 h-4" />
                          )}
                        </span>
                        <div>
                          <p className="font-semibold text-xs sm:text-[13px] leading-tight">{item.title}</p>
                          <p className={`text-[11px] ${isSelected ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-white/25 text-white" : "bg-black/5 dark:bg-white/10 text-gray-500"
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-gray-500">No matching apps or skills found</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lock Screen / Sleep Simulation Modal */}
      {isLocked && (
        <div
          className="fixed inset-0 z-[110] bg-cover bg-center flex flex-col items-center justify-center select-none animate-fade-in"
          style={{
            backgroundImage: `url(${currentWallpaper || "/wallpaper3.jpg"})`,
            backdropFilter: "blur(40px)",
          }}
          onClick={() => {
            setIsLocked(false);
            showHud("System Unlocked");
          }}
        >
          {/* Frosted Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl" />

          <div className="relative z-10 flex flex-col items-center space-y-6 text-white text-center">
            {/* Big Lock Clock */}
            <div className="space-y-1">
              <h1 className="text-6xl sm:text-7xl font-light tracking-tight drop-shadow-lg">
                {dateTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: false })}
              </h1>
              <p className="text-sm sm:text-base font-medium opacity-90 drop-shadow">
                {dateTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>

            {/* Profile Avatar */}
            <div className="flex flex-col items-center space-y-3 pt-6">
              <div className="w-20 h-20 rounded-full border-2 border-white/60 overflow-hidden shadow-2xl bg-apple-blue flex items-center justify-center text-white text-2xl font-bold">
                UP
              </div>
              <h2 className="text-lg font-semibold drop-shadow">Utsav Panchal</h2>
              <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md cursor-pointer transition-all">
                <Lock className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Click anywhere to unlock</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restart / Shut Down Confirmation Modal */}
      {isRestartModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[105] flex items-center justify-center p-4 select-none animate-fade-in"
          onClick={() => setIsRestartModalOpen(false)}
        >
          <div
            className="w-full max-w-sm apple-glass rounded-2xl p-5 shadow-2xl border border-black/10 dark:border-white/10 text-center space-y-4 animate-modal-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-apple-blue/15 text-apple-blue flex items-center justify-center">
              <RotateCcw className="w-6 h-6 animate-spin" style={{ animationDuration: "6s" }} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                Are you sure you want to restart?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Your open applications and desktop windows will be restored.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setIsRestartModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-1.5 rounded-xl bg-apple-blue text-white text-xs font-semibold hover:bg-blue-600 shadow-md transition-colors"
              >
                Restart Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      {isShortcutsModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[105] flex items-center justify-center p-4 select-none animate-fade-in"
          onClick={() => setIsShortcutsModalOpen(false)}
        >
          <div
            className="w-full max-w-md apple-glass rounded-2xl p-5 shadow-2xl border border-black/10 dark:border-white/10 space-y-4 animate-modal-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <Command className="w-4 h-4 text-apple-blue" />
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">macOS Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={() => setIsShortcutsModalOpen(false)}
                className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/15 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { label: "Spotlight Search", key: "⌘K / Ctrl+K" },
                { label: "Open Terminal", key: "⌘T / Ctrl+T" },
                { label: "Close Active Window", key: "⌘W / Ctrl+W" },
                { label: "Close All Windows", key: "⌥⌘W / Alt+Ctrl+W" },
                { label: "Toggle Fullscreen", key: "⌃⌘F" },
                { label: "Keyboard Shortcuts", key: "⌘/ / Ctrl+/" },
                { label: "Close Menus & Modals", key: "Escape" },
              ].map((sc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-black/5 dark:bg-white/5"
                >
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{sc.label}</span>
                  <kbd className="px-2 py-0.5 rounded bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 font-mono text-[11px] font-semibold shadow-xs">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-[11px] text-gray-500">
              Press Escape or click outside to dismiss
            </div>
          </div>
        </div>
      )}

      {/* Wallpaper Selector Window */}
      {isWallpaperSelectorOpen && (
        <WallpaperSelector
          currentWallpaper={currentWallpaper}
          onSelectWallpaper={(src) => {
            switchWallpaper(src);
            setIsWallpaperSelectorOpen(false);
            showHud("Wallpaper Updated");
          }}
          closeWindow={() => setIsWallpaperSelectorOpen(false)}
        />
      )}
    </>
  );
};

export default MenuBar;
