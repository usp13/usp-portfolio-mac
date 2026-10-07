import React from "react";
import Window from "./Window";
import { Download, ExternalLink, FileText } from "lucide-react";

export default function ResumeWindow({
  onClose,
  zIndex = 30,
  onFocus,
  isActive = true,
  cascadeIndex = 0,
}: {
  onClose: () => void;
  zIndex?: number;
  onFocus?: () => void;
  isActive?: boolean;
  cascadeIndex?: number;
}) {
  return (
    <Window
      id="resume"
      title="Preview — Utsav_Panchal_Resume.pdf"
      onClose={onClose}
      zIndex={zIndex}
      onFocus={onFocus}
      isActive={isActive}
      cascadeIndex={cascadeIndex}
    >
      <div className="flex flex-col h-full bg-apple-parchment dark:bg-apple-tile-2">
        {/* Apple Preview Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/70 dark:bg-apple-tile-1/70 border-b border-apple-hairline dark:border-white/10 backdrop-blur-md">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <FileText className="w-4 h-4 text-apple-blue" />
            <span className="font-medium text-apple-ink dark:text-white">Utsav_Panchal_Resume.pdf</span>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="/resume.pdf"
              download="Utsav_Panchal_Resume.pdf"
              className="apple-press inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-apple-blue text-white text-xs font-medium hover:bg-apple-blue-focus transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="apple-press inline-flex items-center space-x-1 px-2.5 py-1 rounded-full border border-apple-hairline dark:border-white/15 text-xs text-apple-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in Tab</span>
            </a>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 p-2 sm:p-4 overflow-hidden flex items-center justify-center">
          <iframe
            src="/resume.pdf"
            width="100%"
            height="100%"
            title="Utsav Panchal Resume"
            className="w-full h-full rounded-lg border border-apple-hairline dark:border-white/10 shadow-sm bg-white"
          />
        </div>
      </div>
    </Window>
  );
}
