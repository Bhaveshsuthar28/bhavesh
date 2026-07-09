"use client";

import { useEffect, useRef, useState } from "react";
import { 
  FaTerminal, 
  FaChevronRight,
  FaArrowLeft,
  FaArrowRight,
  FaSyncAlt,
  FaGlobe,
  FaCheck
} from "react-icons/fa";
import { TbGitBranch } from "react-icons/tb";
import { useTerminal } from "@/hooks/useTerminal";
import PixelatedImage from "@/components/PixelatedImage";

export default function Home() {
  const [imageTrigger, setImageTrigger] = useState(0);
  const [isImageVisible, setIsImageVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const triggerImageAnimation = () => {
    setImageTrigger((prev) => prev + 1);
  };

  const {
    input,
    setInput,
    caretIndex,
    setCaretIndex,
    ghostText,
    history,
    currentPath,
    handleCtrlC,
    handleCtrlL,
    handleUpArrow,
    handleDownArrow,
    handleTabCompletion,
    acceptGhostSuggestion,
    executeCommand,
    resetTabCycle,
  } = useTerminal(triggerImageAnimation, inputRef);

  // Focus input on console panel click
  const focusConsole = () => {
    inputRef.current?.focus();
  };

  // Run start command on mount
  useEffect(() => {
    executeCommand("start");
    focusConsole();
  }, []);

  // Auto scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    const start = e.target.selectionStart || 0;
    setCaretIndex(start);
    resetTabCycle();
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const start = inputRef.current?.selectionStart;
    if (start !== null && start !== undefined) {
      setCaretIndex(start);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      handleUpArrow();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleDownArrow();
    } else if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      handleCtrlC();
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      handleCtrlL();
    } else if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(input);
    } else if (e.key === "ArrowLeft") {
      // Let browser move selection, selection change triggers handleSelect
      resetTabCycle();
    } else if (e.key === "ArrowRight") {
      if (caretIndex === input.length && ghostText) {
        e.preventDefault();
        acceptGhostSuggestion();
      } else {
        resetTabCycle();
      }
    } else if (e.key === "Home") {
      resetTabCycle();
    } else if (e.key === "End") {
      resetTabCycle();
    }
  };

  // Render mock caret block position in input line
  const textBefore = input.slice(0, caretIndex);
  const charAtCursor = input.charAt(caretIndex) || " ";
  const textAfter = input.slice(caretIndex + 1);

  return (
    <div className="flex flex-col h-screen select-none bg-bg-primary text-text-primary p-2 sm:p-4 overflow-hidden">
      {/* Mock Browser Frame Shell */}
      <div className="flex flex-col flex-1 border border-border-terminal rounded-lg bg-bg-tabs shadow-2xl overflow-hidden">
        
        {/* Browser Tabs Chrome Bar */}
        <div className="bg-bg-window-chrome border-b border-border-terminal px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 w-1/3">
            {/* macOS Chrome Dots */}
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>

          {/* Browser Tab */}
          <div className="w-1/3 flex justify-center">
            <div className="bg-bg-primary border border-border-terminal px-4 py-1 rounded-t-md text-xs text-white font-mono select-none flex items-center gap-2 truncate max-w-xs">
              <FaTerminal size={11} className="text-accent" />
              <span>Bhavesh&apos;s Bash Portfolio</span>
            </div>
          </div>

          <div className="w-1/3 text-right">
            {isImageVisible ? (
              <span className="text-[10px] text-text-muted font-mono hidden sm:inline">localhost:3000</span>
            ) : (
              <button 
                onClick={() => setIsImageVisible(true)} 
                className="terminal-link text-[10px] font-bold font-mono"
              >
                ➜ Show Feed
              </button>
            )}
          </div>
        </div>

        {/* Browser URL & Action Controls Bar */}
        <div className="bg-bg-window-chrome border-b border-border-terminal px-4 py-2 flex items-center gap-4 shrink-0 select-none">
          <div className="flex items-center gap-2.5 text-text-muted">
            <FaArrowLeft size={11} className="cursor-pointer hover:text-white" />
            <FaArrowRight size={11} className="cursor-pointer hover:text-white" />
            <FaSyncAlt size={10} className="cursor-pointer hover:text-white" />
          </div>
          
          {/* Address Input URL Bar */}
          <div className="flex-1 bg-bg-address-pill border border-border-terminal/80 rounded px-3 py-1 flex items-center gap-2 text-xs font-mono text-text-muted select-none">
            <FaGlobe size={11} />
            <span className="text-white">localhost:3000</span>
          </div>
        </div>

        {/* Main Multiplexer Pane Work Area (Grid paper background) */}
        <div 
          className="flex-1 flex flex-col md:flex-row overflow-hidden relative"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.006) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.006) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
          onClick={focusConsole}
        >
          {/* Hidden Input field (native text capturing) */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onSelect={handleSelect}
            className="fixed opacity-0 pointer-events-none w-0 h-0 border-0 p-0 m-0"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {/* Left Panel: Active Console Shell Stream */}
          <div className="flex-1 flex flex-col p-4 overflow-y-auto scrollbar-thin select-text relative">
            <div className="space-y-4">
              {history.map((entry, idx) => (
                <div key={idx} className="space-y-2">
                  {/* Prompt Output Header */}
                  <div className="flex items-center gap-1 font-mono text-xs select-none">
                    <span className="text-accent-amber font-bold">visitor</span>
                    <span className="text-accent-green font-bold">@bhavesh-dev</span>
                    <span className="text-text-muted font-bold">:{entry.path === "~" ? "~" : `/${entry.path}`}$</span>
                    <span className="text-text-primary font-mono ml-1.5">{entry.command}</span>
                  </div>

                  {/* Stderr/Stdout Print block */}
                  {entry.output && (
                    <div className="text-text-primary text-xs leading-relaxed">
                      {entry.output}
                    </div>
                  )}
                </div>
              ))}

              {/* Prompt Input Line */}
              <div className="flex items-center gap-1 font-mono text-xs select-none pt-2">
                <span className="text-accent-amber font-bold">visitor</span>
                <span className="text-accent-green font-bold">@bhavesh-dev</span>
                <span className="text-text-muted font-bold">:{currentPath === "~" ? "~" : `/${currentPath}`}$</span>
                
                {/* Custom visually rendered caret positioning */}
                <div className="flex-1 flex items-center font-mono text-xs text-text-primary break-all whitespace-pre-wrap select-none ml-1.5">
                  <span>{textBefore}</span>
                  <span className="terminal-block-cursor select-none font-bold">
                    {charAtCursor === " " ? "\u00A0" : charAtCursor}
                  </span>
                  <span>{textAfter}</span>
                  {caretIndex === input.length && ghostText && (
                    <span className="text-text-muted select-none font-mono">{ghostText}</span>
                  )}
                </div>
              </div>

              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Right Panel: Portrait Decode Canvas */}
          {isImageVisible && (
            <div 
              className="shrink-0 p-4 border-t md:border-t-0 md:border-l border-border-terminal flex items-center justify-center bg-[#16161e]/40 shrink-0 select-none"
              onClick={(e) => e.stopPropagation()} // Prevent focus shift when clicking inside canvas card
            >
              <PixelatedImage trigger={imageTrigger} onHide={() => setIsImageVisible(false)} />
            </div>
          )}

        </div>

        {/* Bottom Status bar */}
        <div className="bg-bg-secondary border-t border-border-terminal px-4 py-1 flex items-center justify-between text-[11px] select-none font-mono text-text-muted shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-accent-dim text-accent px-1.5 py-0.5 rounded text-[10px] select-none">
              <TbGitBranch size={11} />
              <span>main</span>
            </div>
            <div className="hidden sm:block">Guest Session</div>
          </div>

          <div className="text-[10px] tracking-wider uppercase font-semibold hidden md:block">
            Bhavesh Suthar // Terminal Workspace
          </div>

          <div className="flex items-center gap-4 text-[10px]">
            <div>zsh</div>
            <div>UTF-8</div>
            <div className="text-accent flex items-center gap-1 font-bold">
              <FaCheck size={10} />
              <span>Turbopack</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
