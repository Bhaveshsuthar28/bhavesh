"use client";

import React, { useEffect, useState } from "react";

export const bannerLines = [
  "    ____  __  __ ___ _    __ ______ _____ __  __",
  "   / __ )/ / / //   | |  / // ____// ___// / / /",
  "  / __  / /_/ // /| | | / // __/   \\__ \\/ /_/ / ",
  " / /_/ / __  // ___ | |/ // /___  ___/ / __  /  ",
  "/_____/_/ /_//_/  |_|___//_____/ /____/_/ /_/   "
];

interface AsciiBannerProps {
  onComplete?: () => void;
}

export function AsciiBanner({ onComplete }: AsciiBannerProps) {
  const [linesCount, setLinesCount] = useState(0);

  useEffect(() => {
    setLinesCount(0);
    const interval = setInterval(() => {
      setLinesCount((prev) => {
        if (prev < bannerLines.length) {
          return prev + 1;
        }
        clearInterval(interval);
        if (onComplete) onComplete();
        return prev;
      });
    }, 60); // Animate top-to-bottom line loading
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="relative">
      <pre 
        style={{
          backgroundImage: "linear-gradient(90deg, var(--accent-amber), var(--accent-green))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}
        className="font-mono text-[6px] sm:text-[9px] md:text-[11px] leading-tight select-none mt-2 overflow-x-auto whitespace-pre font-bold"
      >
        {bannerLines.slice(0, linesCount).join("\n")}
        {linesCount < bannerLines.length && (
          <span 
            style={{ 
              WebkitTextFillColor: "initial",
              background: "var(--accent-amber)"
            }}
            className="terminal-block-cursor ml-1 inline-block w-1.5 h-3 align-middle"
          ></span>
        )}
      </pre>
    </div>
  );
}

export default function AsciiArt() {
  return <AsciiBanner />;
}
