"use client";

import { useEffect, useRef, useState } from "react";

interface PixelatedImageProps {
  trigger?: number; // Change value to trigger re-animation
  onHide?: () => void;
}

export default function PixelatedImage({ trigger = 0, onHide }: PixelatedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [statusText, setStatusText] = useState("AWAITING FEED...");
  const [logs, setLogs] = useState<string[]>([]);
  const [blurAmount, setBlurAmount] = useState(16);
  const [canvasHeight, setCanvasHeight] = useState(320);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Bounding box coordinates for the face lock
  const faceBox = { x: 70, y: 55, w: 180, h: 195 };

  useEffect(() => {
    const terminalLogs = [
      "[SYS] CONNECTING TO DEV_STREAM_0...",
      "[SYS] VIDEO FEED SECURED. ESTABLISHED 512x512",
      "[MODEL] INITIATING YOLOv8 OBJECT DETECTOR...",
      "[MODEL] LOADING DINOv2 VISION EMBEDDINGS...",
      "[INFERENCE] DETECTED: HUMAN TARGET (99.8%)",
      "[INFERENCE] TARGET COORDINATES LOCKED: [70, 55, 250, 250]",
      "[MODEL] LOADED SEGMENT ANYTHING MODEL (SAM)...",
      "[INFERENCE] RECOGNIZED TARGET: BHAVESH SUTHAR",
      "[SYS] PIPELINE STABLE. LOCKED ACTIVE STREAM.",
    ];

    setLogs([]);
    let logIndex = 0;
    
    // Gradual console log entries
    const logInterval = setInterval(() => {
      if (logIndex < terminalLogs.length) {
        const nextLog = terminalLogs[logIndex];
        setLogs((prev) => [...prev, nextLog].slice(-4));
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 350);

    return () => clearInterval(logInterval);
  }, [trigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let scanY = 0;
    let scanDirection = 1;
    let radarRotation = 0;

    const runDecoder = (img: HTMLImageElement) => {
      const width = canvas.width;
      const height = canvas.height;
      
      const startTime = Date.now();
      
      const render = () => {
        const elapsed = Date.now() - startTime;
        ctx.clearRect(0, 0, width, height);

        let phase: "connecting" | "decoding" | "locked" = "connecting";
        let currentBlur = 16;
        let blockSize = 64;

        if (elapsed < 1200) {
          // Phase 1: Connecting (Blurred, rotating radar, no image details)
          phase = "connecting";
          currentBlur = 16;
          setStatusText("CONNECTING FEED...");
        } else if (elapsed < 3200) {
          // Phase 2: Decoding (Reducing blur, reducing block size, active scanning)
          phase = "decoding";
          const ratio = (elapsed - 1200) / 2000; // 0 to 1
          currentBlur = 16 * (1 - ratio);
          
          if (ratio < 0.15) blockSize = 64;
          else if (ratio < 0.3) blockSize = 48;
          else if (ratio < 0.45) blockSize = 32;
          else if (ratio < 0.6) blockSize = 24;
          else if (ratio < 0.75) blockSize = 16;
          else if (ratio < 0.85) blockSize = 8;
          else if (ratio < 0.95) blockSize = 4;
          else blockSize = 2;
          
          setStatusText("DECODING PATHS...");
        } else {
          // Phase 3: Locked (Fully resolved, no blur, clear detail lock)
          phase = "locked";
          currentBlur = 0;
          blockSize = 1;
          setStatusText("ACTIVE LOCK");
        }

        setBlurAmount(currentBlur);

        // 1. Draw Image (Hide completely during Phase 1 connecting to prevent pre-reveal)
        if (phase === "connecting") {
          // Draw a black screen with faint grid lines
          ctx.fillStyle = "#080c10";
          ctx.fillRect(0, 0, width, height);
        } else if (phase === "decoding") {
          // Canvas pixelated scaling
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = Math.max(1, width / blockSize);
          tempCanvas.height = Math.max(1, height / blockSize);
          const tempCtx = tempCanvas.getContext("2d");
          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, width, height);
          }

          // Green digital camera filter overlay
          ctx.fillStyle = "rgba(57, 255, 136, 0.18)";
          ctx.fillRect(0, 0, width, height);
        } else {
          // Sharp image in full color
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(img, 0, 0, width, height);
        }

        // 2. Draw HUD graphics overlay
        if (phase === "connecting") {
          // Radar grid lines
          ctx.strokeStyle = "rgba(57, 255, 136, 0.15)";
          ctx.lineWidth = 1;
          ctx.strokeRect(20, 20, width - 40, height - 40);
          ctx.beginPath();
          ctx.moveTo(width / 2, 0);
          ctx.lineTo(width / 2, height);
          ctx.moveTo(0, height / 2);
          ctx.lineTo(width, height / 2);
          ctx.stroke();

          // Rotating radar circle in center
          ctx.save();
          ctx.translate(width / 2, height / 2);
          ctx.rotate(radarRotation);
          ctx.strokeStyle = "#39ff88";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 60, 0, Math.PI * 0.5);
          ctx.stroke();
          ctx.restore();
          
          radarRotation += 0.05;

          ctx.fillStyle = "#39ff88";
          ctx.font = "10px monospace";
          ctx.fillText("ESTABLISHING TCP SECURE CONNECTION...", 50, height / 2 + 85);
        } 
        
        else if (phase === "decoding") {
          // Active face Bounding Box
          ctx.strokeStyle = "#39ff88";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(faceBox.x, faceBox.y, faceBox.w, faceBox.h);

          ctx.fillStyle = "#39ff88";
          ctx.font = "10px monospace";
          ctx.fillText(`ANALYZE: ${Math.min(99.8, 40 + (1 - currentBlur/16) * 60).toFixed(1)}%`, faceBox.x, faceBox.y - 6);

          // Corner HUD stats
          ctx.fillStyle = "rgba(57, 255, 136, 0.75)";
          ctx.fillText("FPS: 30.0", 10, 20);
          ctx.fillText("SOURCE: B_FEED_0", 10, 35);
          ctx.fillText(`DEC_RATIO: ${blockSize}px`, width - 120, 20);
          ctx.fillText("YOLOv8 / SAM", width - 120, 35);

          // Sweeping scanner line
          ctx.beginPath();
          ctx.strokeStyle = "rgba(57, 255, 136, 0.45)";
          ctx.lineWidth = 2.5;
          ctx.moveTo(0, scanY);
          ctx.lineTo(width, scanY);
          ctx.stroke();

          scanY += 3.5 * scanDirection;
          if (scanY >= height || scanY <= 0) {
            scanDirection *= -1;
          }
        } 
        
        else {
          // Phase 3: Locked Corner HUD
          ctx.strokeStyle = "rgba(57, 255, 136, 0.85)";
          ctx.lineWidth = 2.5;
          ctx.setLineDash([]);
          
          // Face lock corners
          ctx.beginPath();
          // Top Left
          ctx.moveTo(faceBox.x, faceBox.y + 15);
          ctx.lineTo(faceBox.x, faceBox.y);
          ctx.lineTo(faceBox.x + 15, faceBox.y);
          // Top Right
          ctx.moveTo(faceBox.x + faceBox.w - 15, faceBox.y);
          ctx.lineTo(faceBox.x + faceBox.w, faceBox.y);
          ctx.lineTo(faceBox.x + faceBox.w, faceBox.y + 15);
          // Bottom Left
          ctx.moveTo(faceBox.x, faceBox.y + faceBox.h - 15);
          ctx.lineTo(faceBox.x, faceBox.y + faceBox.h);
          ctx.lineTo(faceBox.x + 15, faceBox.y + faceBox.h);
          // Bottom Right
          ctx.moveTo(faceBox.x + faceBox.w - 15, faceBox.y + faceBox.h);
          ctx.lineTo(faceBox.x + faceBox.w, faceBox.y + faceBox.h);
          ctx.lineTo(faceBox.x + faceBox.w, faceBox.y + faceBox.h - 15);
          ctx.stroke();

          ctx.fillStyle = "rgba(57, 255, 136, 0.9)";
          ctx.font = "9px monospace";
          ctx.fillText("TARGET DETECTED: BHAVESH SUTHAR (100%)", faceBox.x, faceBox.y - 6);
        }

        animationFrameId = requestAnimationFrame(render);
      };

      render();
    };

    // Load Image
    if (!imageRef.current) {
      const img = new Image();
      img.src = "/bhavesh.png";
      img.onload = () => {
        imageRef.current = img;
        runDecoder(img);
      };
    } else {
      runDecoder(imageRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [trigger]);

  return (
    <div className="flex flex-col items-center bg-bg-secondary border border-border-terminal p-4 rounded-lg font-mono w-[352px] shadow-lg shrink-0">
      {/* Title Header Bar */}
      <div className="flex items-center justify-between w-full border-b border-border-terminal pb-2 mb-3 text-xs select-none">
        <div className="flex items-center gap-1.5 text-accent">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          <span>CV_PIPELINE.sh</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-muted">IMAGE_DEC_v2.0</span>
          {onHide && (
            <button 
              onClick={onHide} 
              className="text-text-muted hover:text-terminal-red font-bold ml-1 transition-colors cursor-pointer"
              title="Hide feed"
            >
              [×]
            </button>
          )}
        </div>
      </div>

      {/* Canvas Wrapper */}
      <div 
        className="relative border border-border-terminal bg-black overflow-hidden rounded mb-4 w-[320px] transition-all duration-150"
        style={{ height: `${canvasHeight}px` }}
      >
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="block w-[320px] transition-all duration-150"
          style={{ filter: `blur(${blurAmount}px)`, height: `${canvasHeight}px` }}
        />

        {/* Scan lines CRT static */}
        <div className="absolute inset-0 pointer-events-none crt-line opacity-25" />
      </div>

      {/* Status Indicators */}
      <div className="w-full text-left space-y-1.5 text-[11px] leading-relaxed select-none">
        <div className="flex justify-between border-b border-border-terminal/45 pb-1 mb-1">
          <span className="text-text-muted">PIPELINE STATUS:</span>
          <span className={blurAmount > 0 ? "text-yellow-500 animate-pulse font-bold" : "text-accent font-bold"}>
            {statusText}
          </span>
        </div>
        
        {/* Real-time console logs box */}
        <div className="bg-[#080c10] border border-border-terminal/60 p-2 rounded h-[76px] flex flex-col justify-end overflow-hidden font-mono text-[9px] text-text-primary leading-tight select-text">
          {logs.map((log, index) => {
            if (!log) return null;
            let color = "text-text-primary";
            if (log.includes("[SYS]")) color = "text-text-muted";
            if (log.includes("[MODEL]")) color = "text-terminal-cyan";
            if (log.includes("[INFERENCE]")) color = "text-accent";
            return (
              <div key={index} className={`${color} truncate`}>
                {log}
              </div>
            );
          })}
        </div>

        {/* Dynamic Image Height Stretch Slider */}
        <div className="flex flex-col gap-1 border-t border-border-terminal/45 pt-1.5 mt-1.5">
          <div className="flex justify-between items-center text-[10px] text-text-muted">
            <span>STRETCH HEIGHT:</span>
            <span className="text-accent font-bold">{canvasHeight}px</span>
          </div>
          <input 
            type="range" 
            min="200" 
            max="480" 
            value={canvasHeight} 
            onChange={(e) => setCanvasHeight(Number(e.target.value))}
            className="w-full accent-accent-amber h-1 bg-[#1a232e] rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
