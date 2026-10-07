'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import Desktop from "./components/Desktop";
import Dock from "./components/Dock";
import MenuBar from "./components/MenuBar";
import Window from "./components/Window";
import { ThemeProvider } from "./contexts/ThemeContext";
import VSCodeEditor from "./components/VSCodeEditor";
import GeminiChat from "./components/BrowserWindow";
import Terminal from "./components/Terminal";
import ResumeWindow from "./components/ResumeWindow";
import wallpaper from "@/public/wallpaper3.jpg";
import MusicPlayer from "./components/MusicPlayer";
import ProfileCard from "./components/AboutMe";
import ConnectWithMe from "./components/Social";
import Projects from "./components/Project";
import FlappyBird from "./components/PacManGame";
import WorkExperience from "./components/WorkExperience";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [windowZIndices, setWindowZIndices] = useState<Record<string, number>>({});
  const [highestZ, setHighestZ] = useState<number>(30);
  const [windowCascadeIndex, setWindowCascadeIndex] = useState<Record<string, number>>({});
  const nextCascadeSlot = useRef<number>(0);
  const [wallpaper1, setWallpaper] = useState<string>(wallpaper.src);

  // Wallpapers are managed via WallpaperSelector; stored wallpaper src in state and localStorage

  useEffect(() => {
    setIsMounted(true);

    const savedWindows = localStorage.getItem("openWindows");
    if (savedWindows) {
      try {
        const parsed = JSON.parse(savedWindows);
        setOpenWindows(parsed);
        if (parsed.length > 0) {
          setActiveWindow(parsed[parsed.length - 1]);
          const initialCascade: Record<string, number> = {};
          parsed.forEach((wId: string, idx: number) => {
            initialCascade[wId] = idx % 5;
          });
          setWindowCascadeIndex(initialCascade);
          nextCascadeSlot.current = parsed.length % 5;
        }
      } catch {
        // Ignore parse error
      }
    }

    const savedWallpaper = localStorage.getItem("wallpaper");
    if (savedWallpaper) setWallpaper(savedWallpaper);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("openWindows", JSON.stringify(openWindows));
  }, [openWindows, isMounted]);

  const switchWallpaper = (wallpaperSrc: string) => {
    setWallpaper(wallpaperSrc);
    localStorage.setItem("wallpaper", wallpaperSrc);
  };

  const bringToFront = useCallback((id: string) => {
    setActiveWindow(id);
    setHighestZ((prevZ) => {
      const nextZ = prevZ + 1;
      setWindowZIndices((prev) => ({ ...prev, [id]: nextZ }));
      return nextZ;
    });
  }, []);

  const toggleWindow = useCallback((id: string) => {
    setOpenWindows((prev) => {
      if (!prev.includes(id)) {
        // Assign cascading slot so new window opens slightly offset in front
        setWindowCascadeIndex((prevMap) => {
          if (prevMap[id] !== undefined) return prevMap;
          const slot = nextCascadeSlot.current;
          nextCascadeSlot.current = (slot + 1) % 5;
          return { ...prevMap, [id]: slot };
        });
        bringToFront(id);
        return [...prev, id];
      } else {
        // Window is currently open
        if (activeWindow === id) {
          // It's the active front window - minimize/close it
          const nextWindows = prev.filter((w) => w !== id);
          setActiveWindow(nextWindows.length > 0 ? nextWindows[nextWindows.length - 1] : null);
          return nextWindows;
        } else {
          // It's behind another window - bring it up to the front!
          bringToFront(id);
          return prev;
        }
      }
    });
  }, [activeWindow, bringToFront]);

  const closeAllWindows = useCallback(() => {
    setOpenWindows([]);
    setActiveWindow(null);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "t") {
      event.preventDefault();
      toggleWindow("terminal");
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "w" && activeWindow) {
      event.preventDefault();
      toggleWindow(activeWindow);
    }
  }, [toggleWindow, activeWindow]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!isMounted) return null;

  return (
    <ThemeProvider>
      <div
        className="min-h-screen min-w-full overflow-hidden bg-cover bg-center bg-no-repeat text-black dark:text-white transition-colors duration-300 relative"
        style={{ backgroundImage: `url(${wallpaper1})` }}
      >
        <MenuBar
          switchWallpaper={switchWallpaper}
          currentWallpaper={wallpaper1}
          toggleWindow={toggleWindow}
          openWindows={openWindows}
          activeWindow={activeWindow}
          closeAllWindows={closeAllWindows}
          bringToFront={bringToFront}
        />
        <Desktop toggleWindow={toggleWindow} />

        {openWindows.includes("about") && (
          <Window
            id="about"
            title="About Me"
            zIndex={windowZIndices["about"] || 30}
            onFocus={() => bringToFront("about")}
            isActive={activeWindow === "about"}
            cascadeIndex={windowCascadeIndex["about"] ?? 0}
            onClose={() => toggleWindow("about")}
          >
            <ProfileCard />
          </Window>
        )}
        {openWindows.includes("work-experience") && (
          <Window
            id="work-experience"
            title="Work Experience"
            zIndex={windowZIndices["work-experience"] || 30}
            onFocus={() => bringToFront("work-experience")}
            isActive={activeWindow === "work-experience"}
            cascadeIndex={windowCascadeIndex["work-experience"] ?? 1}
            onClose={() => toggleWindow("work-experience")}
          >
            <WorkExperience />
          </Window>
        )}
        {openWindows.includes("projects") && (
          <Window
            id="projects"
            title="My Projects"
            zIndex={windowZIndices["projects"] || 30}
            onFocus={() => bringToFront("projects")}
            isActive={activeWindow === "projects"}
            cascadeIndex={windowCascadeIndex["projects"] ?? 2}
            onClose={() => toggleWindow("projects")}
          >
            <Projects />
          </Window>
        )}
        {openWindows.includes("contact") && (
          <Window
            id="contact"
            title="Contact Me"
            zIndex={windowZIndices["contact"] || 30}
            onFocus={() => bringToFront("contact")}
            isActive={activeWindow === "contact"}
            cascadeIndex={windowCascadeIndex["contact"] ?? 3}
            onClose={() => toggleWindow("contact")}
          >
            <ConnectWithMe />
          </Window>
        )}
        {openWindows.includes("vscode") && (
          <Window
            id="vscode"
            title="VS Code"
            zIndex={windowZIndices["vscode"] || 30}
            onFocus={() => bringToFront("vscode")}
            isActive={activeWindow === "vscode"}
            cascadeIndex={windowCascadeIndex["vscode"] ?? 0}
            onClose={() => toggleWindow("vscode")}
          >
            <VSCodeEditor />
          </Window>
        )}
        {openWindows.includes("browser") && (
          <Window
            id="browser"
            title="Browser"
            zIndex={windowZIndices["browser"] || 30}
            onFocus={() => bringToFront("browser")}
            isActive={activeWindow === "browser"}
            cascadeIndex={windowCascadeIndex["browser"] ?? 1}
            onClose={() => toggleWindow("browser")}
          >
            <GeminiChat />
          </Window>
        )}
        {openWindows.includes("terminal") && (
          <Window
            id="terminal"
            title="Terminal"
            zIndex={windowZIndices["terminal"] || 30}
            onFocus={() => bringToFront("terminal")}
            isActive={activeWindow === "terminal"}
            cascadeIndex={windowCascadeIndex["terminal"] ?? 2}
            onClose={() => toggleWindow("terminal")}
          >
            <Terminal />
          </Window>
        )}
        {openWindows.includes("music-player") && (
          <Window
            id="music-player"
            title="Spotify"
            zIndex={windowZIndices["music-player"] || 30}
            onFocus={() => bringToFront("music-player")}
            isActive={activeWindow === "music-player"}
            cascadeIndex={windowCascadeIndex["music-player"] ?? 3}
            onClose={() => toggleWindow("music-player")}
          >
            <MusicPlayer />
          </Window>
        )}
        {openWindows.includes("resume") && (
          <ResumeWindow
            zIndex={windowZIndices["resume"] || 30}
            onFocus={() => bringToFront("resume")}
            isActive={activeWindow === "resume"}
            cascadeIndex={windowCascadeIndex["resume"] ?? 4}
            onClose={() => toggleWindow("resume")}
          />
        )}
        {openWindows.includes("flappy-bird") && (
          <Window
            id="flappy-bird"
            title="Flappy Bird"
            zIndex={windowZIndices["flappy-bird"] || 30}
            onFocus={() => bringToFront("flappy-bird")}
            isActive={activeWindow === "flappy-bird"}
            cascadeIndex={windowCascadeIndex["flappy-bird"] ?? 1}
            onClose={() => toggleWindow("flappy-bird")}
          >
            <FlappyBird />
          </Window>
        )}

        <Dock
          toggleWindow={toggleWindow}
          openWindows={openWindows}
          activeWindow={activeWindow}
        />
      </div>
    </ThemeProvider>
  );
}
