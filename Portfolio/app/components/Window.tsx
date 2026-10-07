import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Minus, Maximize2 } from "lucide-react";

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  zIndex?: number;
  onFocus?: () => void;
  isActive?: boolean;
  cascadeIndex?: number;
}

export default function Window({
  title,
  children,
  onClose,
  zIndex = 30,
  onFocus,
  isActive = true,
  cascadeIndex = 0,
}: WindowProps) {
  const [position, setPosition] = useState({ x: 60, y: 60 });
  const [size, setSize] = useState({ width: 850, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevBounds, setPrevBounds] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeOffset, setResizeOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);
  const isPosInitialized = useRef(false);

  const updateDeviceType = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setIsMobile(width <= 768);

    const step = cascadeIndex % 5;
    const offsetX = step * 36;
    const offsetY = step * 30;
    
    if (width <= 480) {
      setSize({ width: width * 0.96, height: height * 0.82 });
      if (!isPosInitialized.current) {
        setPosition({ x: width * 0.02, y: 36 });
      }
    } else if (width <= 768) {
      setSize({ width: width * 0.92, height: height * 0.75 });
      if (!isPosInitialized.current) {
        setPosition({ x: width * 0.04, y: 44 });
      }
    } else if (width <= 1024) {
      setSize({ width: Math.min(740, width - 60), height: Math.min(520, height - 120) });
      if (!isPosInitialized.current) {
        setPosition({ x: Math.max(16, 36 + offsetX), y: Math.max(44, 48 + offsetY) });
      }
    } else {
      setSize({ width: Math.min(880, width - 120), height: Math.min(620, height - 140) });
      if (!isPosInitialized.current) {
        setPosition({ x: Math.max(24, 60 + offsetX), y: Math.max(48, 55 + offsetY) });
      }
    }
    isPosInitialized.current = true;
  }, [cascadeIndex]);

  useEffect(() => {
    updateDeviceType();
    const handleResize = () => updateDeviceType();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateDeviceType]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x)),
          y: Math.max(30, Math.min(window.innerHeight - 60, e.clientY - dragOffset.y)),
        });
      }
      if (isResizing && windowRef.current) {
        setSize({
          width: Math.max(380, e.clientX - windowRef.current.offsetLeft - resizeOffset.x),
          height: Math.max(260, e.clientY - windowRef.current.offsetTop - resizeOffset.y),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, isResizing, resizeOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    if ((e.target as HTMLElement).closest("button")) return;
    
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMaximize = () => {
    if (isMaximized && prevBounds) {
      setPosition({ x: prevBounds.x, y: prevBounds.y });
      setSize({ width: prevBounds.width, height: prevBounds.height });
      setIsMaximized(false);
    } else {
      setPrevBounds({ x: position.x, y: position.y, width: size.width, height: size.height });
      setPosition({ x: 8, y: 36 });
      setSize({
        width: window.innerWidth - 16,
        height: window.innerHeight - 100,
      });
      setIsMaximized(true);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return;
    e.stopPropagation();
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setResizeOffset({
        x: e.clientX - rect.right,
        y: e.clientY - rect.bottom,
      });
      setIsResizing(true);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div
      ref={windowRef}
      onMouseDown={() => onFocus?.()}
      className={`absolute flex flex-col apple-glass rounded-[14px] overflow-hidden select-none ${
        !isDragging && !isResizing ? "transition-[width,height,left,top,box-shadow,opacity] duration-200 ease-out" : ""
      } ${
        isClosing ? "animate-window-close" : "animate-window-open"
      } ${
        isActive
          ? "shadow-apple-window border border-black/15 dark:border-white/15"
          : "shadow-lg border border-black/10 dark:border-white/10 opacity-[0.98]"
      } ${isDragging ? "opacity-95" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        minWidth: isMobile ? "280px" : "380px",
        minHeight: isMobile ? "200px" : "260px",
        maxWidth: isMobile ? "98vw" : "96vw",
        maxHeight: isMobile ? "85vh" : "90vh",
        zIndex,
      }}
    >
      {/* Authentic macOS Window Header */}
      <div
        className={`h-9 flex items-center justify-between px-3.5 bg-white/40 dark:bg-apple-tile-1/70 backdrop-blur-md border-b border-black/10 dark:border-white/5 select-none ${
          isMobile ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleMaximize}
      >
        {/* Apple Traffic Lights */}
        <div className="apple-traffic-lights flex items-center space-x-2 group">
          {/* Close button (Red) */}
          <button
            onClick={handleClose}
            aria-label="Close Window"
            className="apple-traffic-light bg-[#ff5f56] hover:brightness-90 active:brightness-75"
          >
            <X className="w-2 h-2 text-[#4c0000]" strokeWidth={2.5} />
          </button>

          {/* Minimize button (Yellow) */}
          <button
            onClick={handleClose}
            aria-label="Minimize Window"
            className="apple-traffic-light bg-[#ffbd2e] hover:brightness-90 active:brightness-75"
          >
            <Minus className="w-2 h-2 text-[#5e3b00]" strokeWidth={2.5} />
          </button>

          {/* Maximize / Zoom button (Green) */}
          <button
            onClick={handleMaximize}
            aria-label="Maximize Window"
            className="apple-traffic-light bg-[#27c93f] hover:brightness-90 active:brightness-75"
          >
            <Maximize2 className="w-1.5 h-1.5 text-[#004d00]" strokeWidth={2.5} />
          </button>
        </div>

        {/* Centered Window Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none text-center">
          <span className="text-[13px] font-medium tracking-tight text-gray-800 dark:text-gray-200 truncate max-w-[250px] sm:max-w-[400px] inline-block">
            {title}
          </span>
        </div>

        {/* Right balance spacer */}
        <div className="w-14" />
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-auto bg-white/60 dark:bg-apple-tile-2/80 text-apple-ink dark:text-white backdrop-blur-md">
        {children}
      </div>

      {/* Resize Handle */}
      {!isMobile && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-40"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
}
