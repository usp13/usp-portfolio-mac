"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Search,
  Heart,
  Shuffle,
  Repeat,
  Compass,
  Radio,
  Loader2,
  ExternalLink,
  Flame,
  Music,
  Headphones,
  X as CloseIcon,
  Video,
  Clock,
} from "lucide-react";

interface YouTubePlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
  destroy: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  loadVideoById?: (options: { videoId: string; startSeconds?: number } | string) => void;
  cueVideoById?: (options: { videoId: string; startSeconds?: number } | string) => void;
  mute?: () => void;
  unMute?: () => void;
}

interface YTEvent {
  target: YouTubePlayerInstance;
  data: number;
}

interface YouTubeNamespace {
  Player: new (elementId: string | HTMLElement, options: Record<string, unknown>) => YouTubePlayerInstance;
  PlayerState: Record<string, number>;
}

declare global {
  interface Window {
    YT: YouTubeNamespace;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  previewUrl: string;
  durationMs: number;
}

interface GenreCategory {
  id: string;
  name: string;
  query: string;
  gradient: string;
  icon: string;
}

const genreCategories: GenreCategory[] = [
  { id: "global-top", name: "Global Top Hits", query: "The Weeknd Coldplay Dua Lipa", gradient: "from-emerald-600 to-teal-900", icon: "🌍" },
  { id: "bollywood", name: "Bollywood Hits", query: "Arijit Singh Pritam Shreya Ghoshal", gradient: "from-amber-500 to-orange-800", icon: "✨" },
  { id: "coding-flow", name: "Coding & Dev Flow", query: "Synthwave Instrumental Electronic Beats", gradient: "from-blue-600 to-indigo-950", icon: "💻" },
  { id: "chill-lofi", name: "Chill Lo-Fi Study", query: "Lofi Beats Chillhop Relax", gradient: "from-rose-500 to-purple-900", icon: "☕" },
  { id: "hip-hop", name: "Hip-Hop Essentials", query: "Eminem Kendrick Lamar Drake", gradient: "from-purple-600 to-pink-900", icon: "🎤" },
  { id: "rock-classics", name: "Rock Legends", query: "Queen Linkin Park AC/DC", gradient: "from-red-600 to-stone-900", icon: "🎸" },
  { id: "pop-rising", name: "Pop Rising", query: "Taylor Swift Bruno Mars Billie Eilish", gradient: "from-pink-500 to-rose-900", icon: "🔥" },
  { id: "edm-party", name: "EDM & Dance", query: "Avicii Martin Garrix Calvin Harris", gradient: "from-cyan-500 to-blue-900", icon: "⚡" },
];

const quickSearchTags = [
  "The Weeknd",
  "Arijit Singh",
  "Coldplay",
  "Eminem",
  "Taylor Swift",
  "Billie Eilish",
  "Diljit Dosanjh",
  "Dua Lipa",
];

export default function RealSpotifyPlayer() {
  const [activeView, setActiveView] = useState<"search" | "browse" | "embed">("search");
  const [showVideoCanvas, setShowVideoCanvas] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>("global-top");

  // Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(200); // Full length in seconds (default ~3:20)
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());

  // Player references
  const ytPlayerRef = useRef<YouTubePlayerInstance | null>(null);
  const isYtReady = useRef<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = playlist[currentTrackIndex] || null;

  // Resolve full song video ID via server API
  const resolveFullSongVideoId = async (track: Track): Promise<string | null> => {
    try {
      const res = await fetch(
        `/api/music/resolve?query=${encodeURIComponent(`${track.artist} ${track.title}`)}`
      );
      const data = await res.json();
      if (data.success && data.videoId) {
        return data.videoId;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Next song in playlist
  const handleNext = useCallback(() => {
    if (playlist.length === 0) return;
    let nextIdx = (currentTrackIndex + 1) % playlist.length;
    if (isShuffled) {
      nextIdx = Math.floor(Math.random() * playlist.length);
    }
    setCurrentTrackIndex(nextIdx);
    playTrack(playlist[nextIdx], playlist, nextIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist, currentTrackIndex, isShuffled]);

  const handlePrev = () => {
    if (playlist.length === 0) return;
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIdx);
    playTrack(playlist[prevIdx], playlist, prevIdx);
  };

  // Initialize YouTube Player
  useEffect(() => {
    let checkInterval: NodeJS.Timeout | null = null;

    const createPlayer = () => {
      if (ytPlayerRef.current || !window.YT || !window.YT.Player) return;

      const container = document.getElementById("spotify-main-yt-engine");
      if (!container) return;

      try {
        ytPlayerRef.current = new window.YT.Player("spotify-main-yt-engine", {
          height: "100%",
          width: "100%",
          videoId: "fHI8X4OXluQ", // The Weeknd - Blinding Lights (3:20)
          playerVars: {
            autoplay: 0,
            controls: 1,
            disablekb: 0,
            fs: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
          },
          events: {
            onReady: (event: YTEvent) => {
              isYtReady.current = true;
              event.target.setVolume(Math.round(volume * 100));
              const d = event.target.getDuration();
              if (d && d > 60) setDuration(d);
            },
            onStateChange: (event: YTEvent) => {
              // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING
              if (event.data === 1) {
                setIsPlaying(true);
                setIsLoadingAudio(false);
                const d = ytPlayerRef.current?.getDuration();
                if (d && d > 60) setDuration(d);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                setIsPlaying(false);
                if (isRepeat) {
                  ytPlayerRef.current?.seekTo(0);
                  ytPlayerRef.current?.playVideo();
                } else {
                  handleNext();
                }
              } else if (event.data === 3) {
                setIsLoadingAudio(true);
              }
            },
            onError: () => {
              setIsLoadingAudio(false);
            },
          },
        });
      } catch (e) {
        console.error("Failed to mount YouTube player:", e);
      }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      if (!document.getElementById("yt-iframe-api-script")) {
        const tag = document.createElement("script");
        tag.id = "yt-iframe-api-script";
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = () => {
          createPlayer();
        };
        document.body.appendChild(tag);
      } else {
        checkInterval = setInterval(() => {
          if (window.YT && window.YT.Player) {
            createPlayer();
            if (checkInterval) clearInterval(checkInterval);
          }
        }, 150);
      }
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [handleNext, isRepeat, volume]);

  // Live time tracking for full-length songs
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (ytPlayerRef.current && isYtReady.current) {
          try {
            const cur = ytPlayerRef.current.getCurrentTime();
            const dur = ytPlayerRef.current.getDuration();
            if (typeof cur === "number" && !isNaN(cur)) {
              setCurrentTime(cur);
            }
            if (typeof dur === "number" && dur > 60) {
              setDuration(dur);
            }
          } catch {}
        }
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Search API using direct global song catalog
  const fetchGlobalTracks = async (term: string): Promise<Track[]> => {
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=30`
      );
      const data = await res.json();
      if (!data.results) return [];

      return data.results
        .filter((r: { trackName?: string }) => r.trackName)
        .map((r: {
          trackId: number;
          trackName: string;
          artistName: string;
          collectionName: string;
          artworkUrl100: string;
          previewUrl: string;
          trackTimeMillis: number;
        }) => ({
          id: String(r.trackId),
          title: r.trackName,
          artist: r.artistName,
          album: r.collectionName || "Single",
          artwork: r.artworkUrl100 ? r.artworkUrl100.replace("100x100bb", "600x600bb") : "/icons/spotify-icon.png",
          previewUrl: r.previewUrl || "",
          durationMs: r.trackTimeMillis && r.trackTimeMillis > 60000 ? r.trackTimeMillis : 210000,
        }));
    } catch (e) {
      console.error("Failed to query global music:", e);
      return [];
    }
  };

  // Pre-load top global hits on initial mount
  useEffect(() => {
    let isCancelled = false;
    const initPlaylist = async () => {
      setIsSearching(true);
      const tracks = await fetchGlobalTracks("The Weeknd Coldplay Dua Lipa");
      if (!isCancelled && tracks.length > 0) {
        setPlaylist(tracks);
        setSearchResults(tracks);
        const initialDur = tracks[0].durationMs / 1000;
        setDuration(initialDur > 60 ? initialDur : 200);
      }
      if (!isCancelled) setIsSearching(false);
    };
    initPlaylist();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Handle live search
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setActiveView("search");

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!val.trim()) {
      setSearchResults(playlist);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      const results = await fetchGlobalTracks(val.trim());
      setSearchResults(results);
      setIsSearching(false);
    }, 350);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults(playlist);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setActiveView("search");
    setIsSearching(true);
    fetchGlobalTracks(tag).then((results) => {
      setSearchResults(results);
      if (results.length > 0) {
        setPlaylist(results);
        playTrack(results[0], results, 0);
      }
      setIsSearching(false);
    });
  };

  const handleCategoryClick = (category: GenreCategory) => {
    setActiveCategory(category.id);
    setActiveView("search");
    setSearchQuery(category.name);
    setIsSearching(true);
    fetchGlobalTracks(category.query).then((results) => {
      setSearchResults(results);
      if (results.length > 0) {
        setPlaylist(results);
        playTrack(results[0], results, 0);
      }
      setIsSearching(false);
    });
  };

  // Play Track in 100% FULL LENGTH
  const playTrack = async (track: Track, trackList?: Track[], index?: number) => {
    const list = trackList || playlist;
    setPlaylist(list);

    if (index !== undefined) {
      setCurrentTrackIndex(index);
    } else {
      const foundIdx = list.findIndex((t) => t.id === track.id);
      if (foundIdx !== -1) setCurrentTrackIndex(foundIdx);
    }

    setCurrentTime(0);
    const expectedDur = track.durationMs && track.durationMs > 60000 ? track.durationMs / 1000 : 210;
    setDuration(expectedDur);
    setIsLoadingAudio(true);

    // Resolve full-length song video ID
    const videoId = await resolveFullSongVideoId(track);

    if (videoId) {
      // If player is not yet ready, wait briefly for instance
      let attempts = 0;
      while ((!ytPlayerRef.current || !isYtReady.current) && attempts < 15) {
        await new Promise((r) => setTimeout(r, 100));
        attempts++;
      }

      if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === "function") {
        try {
          ytPlayerRef.current.loadVideoById(videoId);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          setIsLoadingAudio(false);
          return;
        } catch (err) {
          console.warn("Error playing video:", err);
        }
      }
    }
    setIsLoadingAudio(false);
  };

  // Toggle Play / Pause
  const togglePlayPause = () => {
    if (ytPlayerRef.current && isYtReady.current) {
      try {
        if (isPlaying) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        }
        return;
      } catch {}
    }

    if (currentTrack) {
      playTrack(currentTrack, playlist, currentTrackIndex);
    }
  };

  // Volume Updates
  useEffect(() => {
    const volPercent = isMuted ? 0 : Math.round(volume * 100);
    if (ytPlayerRef.current && isYtReady.current) {
      try {
        if (isMuted) {
          ytPlayerRef.current?.mute?.();
        } else {
          ytPlayerRef.current?.unMute?.();
          ytPlayerRef.current?.setVolume(volPercent);
        }
      } catch {}
    }
  }, [volume, isMuted]);

  // Like Toggle
  const toggleLike = (id: string) => {
    setLikedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const formatSeconds = (sec: number) => {
    if (!sec || isNaN(sec) || sec <= 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatDurationMs = (ms: number) => {
    if (!ms || isNaN(ms)) return "3:30";
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem.toString().padStart(2, "0")}`;
  };

  const handleSeek = (newVal: number) => {
    setCurrentTime(newVal);
    if (ytPlayerRef.current && isYtReady.current) {
      try {
        ytPlayerRef.current.seekTo(newVal, true);
      } catch {}
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#121212] text-white font-sans select-none overflow-hidden relative">
      {/* Main App Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Spotify Sidebar */}
        <div className="w-52 sm:w-60 bg-[#000000] p-3 flex flex-col justify-between shrink-0 border-r border-[#222222]">
          <div className="space-y-4">
            {/* Spotify Brand Header */}
            <div className="flex items-center space-x-2.5 px-2 py-1.5">
              <div className="w-8 h-8 rounded-full bg-[#1ed760] flex items-center justify-center text-black shadow-lg shadow-[#1ed760]/30 shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-white leading-tight">Spotify</span>
                <span className="text-[10px] text-[#1ed760] font-semibold tracking-wide uppercase">Full Length</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveView("search");
                  if (playlist.length > 0 && searchResults.length === 0) setSearchResults(playlist);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeView === "search" ? "bg-[#282828] text-white" : "text-[#b3b3b3] hover:text-white"
                }`}
              >
                <Search className="w-4 h-4 text-[#1ed760]" />
                <span>Search Global</span>
              </button>

              <button
                onClick={() => setActiveView("browse")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeView === "browse" ? "bg-[#282828] text-white" : "text-[#b3b3b3] hover:text-white"
                }`}
              >
                <Compass className="w-4 h-4 text-[#1ed760]" />
                <span>Browse Genres</span>
              </button>

              <button
                onClick={() => setActiveView("embed")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeView === "embed" ? "bg-[#282828] text-white" : "text-[#b3b3b3] hover:text-white"
                }`}
              >
                <Radio className="w-4 h-4 text-[#1ed760]" />
                <span>Spotify Web Embed</span>
              </button>
            </div>

            {/* Curated Stations */}
            <div className="pt-2 border-t border-[#222222]">
              <span className="px-3 text-[10px] uppercase font-bold text-[#888888] tracking-wider block mb-2">
                Curated Stations
              </span>
              <div className="space-y-1 overflow-y-auto max-h-52 no-scrollbar">
                {genreCategories.slice(0, 5).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs truncate transition-colors flex items-center space-x-2 ${
                      activeCategory === category.id && activeView === "search"
                        ? "text-[#1ed760] font-semibold bg-[#181818]"
                        : "text-[#b3b3b3] hover:text-white"
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span className="truncate">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Live Streaming Indicator */}
          <div className="pt-2 border-t border-[#222222] flex items-center justify-between text-[11px] text-[#888888]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse" />
              <span className="text-gray-300 font-medium">Full Audio Ready</span>
            </div>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#888888] hover:text-[#1ed760] transition-colors"
              title="Open Spotify Web"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Center Main Stage */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-[#1c1c1c] via-[#141414] to-[#121212] overflow-hidden">
          {/* Top Search & Filter Bar */}
          <div className="px-4 py-3 bg-[#121212]/80 backdrop-blur-md border-b border-[#282828] space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="What do you want to play? (Full length song, artist, album)..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#333333] text-xs text-white placeholder-gray-400 rounded-full pl-9 pr-9 py-2 border border-transparent focus:border-[#1ed760] focus:outline-none transition-all shadow-inner"
                />
                {searchQuery ? (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <CloseIcon className="w-3.5 h-3.5" />
                  </button>
                ) : isSearching ? (
                  <Loader2 className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#1ed760]" />
                ) : null}
              </div>

              {/* Mode indicator */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setShowVideoCanvas(!showVideoCanvas)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                    showVideoCanvas
                      ? "bg-[#1ed760] text-black"
                      : "bg-[#282828] text-gray-300 hover:text-white"
                  }`}
                  title="Toggle Music Video / Canvas Mode"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{showVideoCanvas ? "Show Artwork" : "Watch Video"}</span>
                </button>
              </div>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider shrink-0 mr-1">
                Quick:
              </span>
              {quickSearchTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-2.5 py-1 rounded-full bg-[#262626] hover:bg-[#383838] active:bg-[#1ed760] active:text-black text-[11px] text-gray-200 hover:text-white transition-all whitespace-nowrap shrink-0 border border-white/5 shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {activeView === "embed" ? (
              // Official Spotify Web Embed Frame
              <div className="h-full flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                  <span>Spotify Official Player</span>
                  <span>Login inside the embed to play with your Spotify account</span>
                </div>
                <iframe
                  src="https://open.spotify.com/embed/playlist/37i9dQZEVXbMDoHDwVN2tF?utm_source=generator&theme=0"
                  width="100%"
                  height="100%"
                  style={{ borderRadius: "12px", border: "0" }}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Spotify Player"
                  className="w-full flex-1 rounded-xl shadow-2xl"
                />
              </div>
            ) : activeView === "browse" ? (
              // Browse Genres Grid
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#1ed760]" /> Browse All Genres
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {genreCategories.map((genre) => (
                    <div
                      key={genre.id}
                      onClick={() => handleCategoryClick(genre)}
                      className={`relative h-28 sm:h-32 rounded-xl p-3.5 bg-gradient-to-br ${genre.gradient} cursor-pointer overflow-hidden shadow-lg transition-transform duration-200 hover:scale-[1.03] active:scale-95 group flex flex-col justify-between`}
                    >
                      <span className="font-bold text-base text-white leading-tight drop-shadow-md">
                        {genre.name}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl filter drop-shadow">{genre.icon}</span>
                        <div className="w-8 h-8 rounded-full bg-[#1ed760] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Search & Track Results View
              <>
                {/* Now Playing / Active Stage Card */}
                {currentTrack && (
                  <div className="bg-gradient-to-r from-[#1ed760]/20 via-[#1e1e1e] to-[#121212] p-4 rounded-xl border border-[#1ed760]/30 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 min-w-0 w-full md:w-auto">
                      {/* Media Screen with YouTube Engine */}
                      <div className="relative w-full sm:w-64 md:w-72 aspect-video rounded-xl overflow-hidden shadow-2xl bg-black shrink-0 border border-white/10 group">
                        {/* The Persistent Full-Song Audio & Video Engine */}
                        <div id="spotify-main-yt-engine" className="w-full h-full" />

                        {/* High-Res Album Cover Overlay when Video Canvas is Off */}
                        {!showVideoCanvas && (
                          <div className="absolute inset-0 bg-[#121212] z-10 flex items-center justify-center overflow-hidden">
                            <Image
                              src={currentTrack.artwork}
                              alt={currentTrack.title}
                              width={320}
                              height={320}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                            {/* Animated Equalizer Badge */}
                            {isPlaying && (
                              <div className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center space-x-1.5 border border-white/10">
                                <div className="flex items-end space-x-0.5 h-3 w-3">
                                  <span className="w-0.5 bg-[#1ed760] rounded-full animate-pulse h-full" />
                                  <span className="w-0.5 bg-[#1ed760] rounded-full animate-bounce h-3/4" />
                                  <span className="w-0.5 bg-[#1ed760] rounded-full animate-pulse h-1/2" />
                                </div>
                                <span className="text-[10px] text-[#1ed760] font-semibold tracking-wide">Playing Live</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Top-Right Toggle on the Media Box */}
                        <button
                          onClick={() => setShowVideoCanvas(!showVideoCanvas)}
                          className="absolute top-2 right-2 z-20 px-2 py-1 rounded-md bg-black/80 hover:bg-black text-[10px] font-semibold text-white/90 hover:text-white backdrop-blur-sm border border-white/10 transition-colors flex items-center space-x-1"
                        >
                          {showVideoCanvas ? (
                            <>
                              <Music className="w-3 h-3 text-[#1ed760]" />
                              <span>Cover</span>
                            </>
                          ) : (
                            <>
                              <Video className="w-3 h-3 text-[#1ed760]" />
                              <span>Video</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Song Details */}
                      <div className="space-y-1.5 min-w-0 flex-1 text-center sm:text-left">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#1ed760] flex items-center justify-center sm:justify-start gap-1">
                          <Flame className="w-3 h-3" /> Full Length Song
                        </span>
                        <h3 className="text-lg sm:text-2xl font-bold text-white truncate">
                          {currentTrack.title}
                        </h3>
                        <p className="text-xs text-gray-300 truncate">
                          {currentTrack.artist} &bull; {currentTrack.album}
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                          <span className="text-[11px] text-gray-300 bg-black/50 px-2.5 py-1 rounded-full font-mono flex items-center gap-1 border border-white/5">
                            <Clock className="w-3 h-3 text-[#1ed760]" />
                            Duration: {formatDurationMs(currentTrack.durationMs)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <button
                      onClick={togglePlayPause}
                      className="w-full md:w-auto px-7 py-3 rounded-full bg-[#1ed760] hover:bg-[#1db954] text-black font-bold text-xs shadow-xl transition-transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 shrink-0"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : isLoadingAudio ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Streaming Full Track...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                          <span>Play Full Song</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Tracklist Table */}
                <div className="space-y-1 pt-2">
                  <div className="grid grid-cols-12 px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-[#282828]">
                    <div className="col-span-1">#</div>
                    <div className="col-span-7 sm:col-span-5">Title</div>
                    <div className="hidden sm:block sm:col-span-4">Album</div>
                    <div className="col-span-4 sm:col-span-2 text-right">Duration</div>
                  </div>

                  {searchResults.map((track, idx) => {
                    const isCurrent = currentTrack?.id === track.id;
                    const isLiked = likedTrackIds.has(track.id);

                    return (
                      <div
                        key={track.id}
                        onClick={() => {
                          if (isCurrent) {
                            togglePlayPause();
                          } else {
                            playTrack(track, searchResults, idx);
                          }
                        }}
                        className={`grid grid-cols-12 items-center px-3 py-2 rounded-lg cursor-pointer transition-colors group ${
                          isCurrent
                            ? "bg-[#282828] text-[#1ed760]"
                            : "hover:bg-[#1a1a1a] text-gray-300 hover:text-white"
                        }`}
                      >
                        {/* Number / Equalizer or Play Icon */}
                        <div className="col-span-1 text-xs text-gray-400 group-hover:text-white flex items-center">
                          {isCurrent && isPlaying ? (
                            <div className="flex items-end space-x-0.5 h-3.5 w-3.5">
                              <span className="w-1 bg-[#1ed760] rounded-full animate-pulse h-full" />
                              <span className="w-1 bg-[#1ed760] rounded-full animate-bounce h-3/4" />
                              <span className="w-1 bg-[#1ed760] rounded-full animate-pulse h-1/2" />
                            </div>
                          ) : (
                            <>
                              <span className="group-hover:hidden">{idx + 1}</span>
                              <Play className="w-3.5 h-3.5 fill-current text-white hidden group-hover:inline ml-[-2px]" />
                            </>
                          )}
                        </div>

                        {/* Song Title & Artist with Album Thumbnail */}
                        <div className="col-span-7 sm:col-span-5 flex items-center space-x-3 min-w-0 pr-2">
                          <div className="relative w-9 h-9 rounded overflow-hidden shrink-0 bg-[#282828] shadow">
                            <Image
                              src={track.artwork}
                              alt={track.title}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="truncate min-w-0">
                            <p
                              className={`text-xs font-medium truncate ${
                                isCurrent ? "text-[#1ed760] font-semibold" : "text-white"
                              }`}
                            >
                              {track.title}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">{track.artist}</p>
                          </div>
                        </div>

                        {/* Album Name */}
                        <div className="hidden sm:block sm:col-span-4 text-xs text-gray-400 truncate pr-2">
                          {track.album}
                        </div>

                        {/* Heart & Duration */}
                        <div className="col-span-4 sm:col-span-2 flex items-center justify-end space-x-2.5 text-xs text-gray-400">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(track.id);
                            }}
                            className="p-1 hover:text-white transition-colors"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                isLiked ? "fill-[#1ed760] text-[#1ed760]" : "hover:text-white"
                              }`}
                            />
                          </button>
                          <span className="font-mono text-[11px] text-gray-300">
                            {formatDurationMs(track.durationMs)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Spotify Playback Controller */}
      <div className="h-20 bg-[#181818] border-t border-[#282828] px-3 sm:px-4 flex items-center justify-between shrink-0 select-none z-30">
        {/* Left: Active Song Artwork & Metadata */}
        <div className="flex items-center space-x-3 w-1/4 min-w-[130px] max-w-[260px]">
          {currentTrack ? (
            <>
              <div className="relative w-12 h-12 rounded overflow-hidden shadow-md shrink-0 bg-[#282828]">
                <Image
                  src={currentTrack.artwork}
                  alt={currentTrack.title}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{currentTrack.title}</p>
                <p className="text-[11px] text-gray-400 truncate">{currentTrack.artist}</p>
              </div>
              <button
                onClick={() => toggleLike(currentTrack.id)}
                className="p-1 text-gray-400 hover:text-white hidden sm:block"
              >
                <Heart
                  className={`w-4 h-4 ${
                    likedTrackIds.has(currentTrack.id) ? "fill-[#1ed760] text-[#1ed760]" : ""
                  }`}
                />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Headphones className="w-5 h-5 text-[#1ed760]" />
              <span>Select any song</span>
            </div>
          )}
        </div>

        {/* Center: Playback Controls & Audio Timeline Bar */}
        <div className="flex flex-col items-center justify-center space-y-1.5 flex-1 max-w-xl px-2">
          {/* Action Buttons */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`text-xs transition-colors ${
                isShuffled ? "text-[#1ed760]" : "text-gray-400 hover:text-white"
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handlePrev}
              className="text-gray-300 hover:text-white transition-colors"
              title="Previous"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-8 h-8 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center transition-transform shadow-md"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isLoadingAudio ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="text-gray-300 hover:text-white transition-colors"
              title="Next"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`text-xs transition-colors ${
                isRepeat ? "text-[#1ed760]" : "text-gray-400 hover:text-white"
              }`}
              title="Repeat"
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Time & Interactive Full-Length Progress Slider */}
          <div className="w-full flex items-center space-x-2 text-[11px] text-gray-400 font-mono">
            <span className="w-10 text-right">{formatSeconds(currentTime)}</span>
            <div className="flex-1 relative flex items-center group">
              <input
                type="range"
                min={0}
                max={duration > 0 ? duration : 210}
                step={0.5}
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#4d4d4d] group-hover:bg-[#5e5e5e] rounded-lg appearance-none cursor-pointer accent-[#1ed760]"
              />
            </div>
            <span className="w-10">{formatSeconds(duration > 0 ? duration : 210)}</span>
          </div>
        </div>

        {/* Right: Volume & Extra Controls */}
        <div className="flex items-center justify-end space-x-2.5 w-1/4 min-w-[100px] max-w-[180px]">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-16 sm:w-20 h-1 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer accent-[#1ed760]"
          />
        </div>
      </div>
    </div>
  );
}