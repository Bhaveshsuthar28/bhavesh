"use client";

import React, { useState, useEffect, RefObject } from "react";
import { projects, skillCategories, experiences, socialLinks, bioData } from "@/data/portfolio";
import { AsciiBanner } from "@/components/AsciiArt";

export interface LogItem {
  path: string;
  command: string;
  output: React.ReactNode;
}

const projectIndexMap: Record<string, string> = {
  "1": "feesbook",
  "2": "signallab",
  "3": "smartride",
  "4": "aai-entry-pass",
  "5": "supplylens",
  "6": "gsvconnect",
};

// Tree Node Interface for Virtual FileSystem
interface FSNode {
  name: string;
  type: "directory" | "file";
  children?: Record<string, FSNode>;
  action?: string;
  content?: React.ReactNode;
}

// Tree Traversal Algorithm
const findNode = (tree: FSNode, stack: string[]): FSNode | null => {
  let curr = tree;
  for (let i = 1; i < stack.length; i++) {
    const part = stack[i];
    if (curr.children && curr.children[part]) {
      curr = curr.children[part];
    } else {
      return null;
    }
  }
  return curr;
};

// Global helper for section layouts
const getSectionContent = (name: string): React.ReactNode => {
  switch (name.toLowerCase()) {
    case "about":
    case "about.md":
      return (
        <div className="font-mono text-xs text-text-primary leading-relaxed space-y-2 pl-2 border-l border-accent/20">
          <p className="text-white font-bold">{bioData.fullName}</p>
          <p className="text-white">B.Tech, Artificial Intelligence & Data Science</p>
          <p>Gati Shakti Vishwavidyalaya (GSV), Vadodara — Class of 2028 (3rd year)</p>
          <p className="text-text-primary/95 mt-2">
            I build production systems — from BCAS-compliant infra at Airports Authority of India to real-time video intelligence pipelines. Focused on backend engineering, systems performance, and applied ML.
          </p>
        </div>
      );
    case "experience":
    case "experience.md":
      return (
        <div className="font-mono text-xs text-text-primary space-y-3 pl-2">
          {experiences.map((exp) => (
            <div key={exp.company}>
              <p className="text-white font-bold">{exp.company} — {exp.role}</p>
              <p className="text-[10px] text-text-muted font-bold mb-1">Period: {exp.period}</p>
              <p className="text-text-primary/95 pl-3 border-l border-accent/30 mt-1 whitespace-pre-line">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      );
    case "skills":
    case "skills.md":
      return (
        <div className="font-mono text-xs text-text-primary space-y-1.5 pl-2">
          {skillCategories.map((cat) => (
            <div key={cat.category} className="flex flex-col sm:flex-row sm:items-start gap-1">
              <span className="text-white font-bold w-32 shrink-0">{cat.category.padEnd(14)}:</span>
              <span className="text-text-primary">{cat.skills.join(", ")}</span>
            </div>
          ))}
        </div>
      );
    case "contact":
    case "contact.md":
      return (
        <div className="font-mono text-xs text-text-primary space-y-1.5 pl-2">
          <div className="flex gap-2">
            <span className="w-20 font-bold text-white">Email:</span>
            <a href={`mailto:${socialLinks.email}`} className="terminal-link">{socialLinks.email}</a>
          </div>
          <div className="flex gap-2">
            <span className="w-20 font-bold text-white">GitHub:</span>
            <a href={socialLinks.github} target="_blank" rel="noreferrer" className="terminal-link">github.com/Bhaveshsuthar28</a>
          </div>
          <div className="flex gap-2">
            <span className="w-20 font-bold text-white">LinkedIn:</span>
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="terminal-link">linkedin.com/in/bhaveshjangid</a>
          </div>
          <div className="flex gap-2">
            <span className="w-20 font-bold text-white">LeetCode:</span>
            <a href={socialLinks.leetcode} target="_blank" rel="noreferrer" className="terminal-link">leetcode.com/u/Bhavesh_s_k</a>
          </div>
          <div className="flex gap-2">
            <span className="w-20 font-bold text-white">Codolio:</span>
            <a href={socialLinks.codolio} target="_blank" rel="noreferrer" className="terminal-link">codolio.com/profile/Bhavesh_S_K28</a>
          </div>
        </div>
      );
    case "resume":
    case "resume.pdf":
      if (typeof window !== "undefined") {
        window.open(socialLinks.resume, "_blank");
      }
      return <div className="font-mono text-xs text-accent pl-2">Opening resume document (PDF)...</div>;
    default:
      return null;
  }
};

// Build Virtual FileSystem Tree statically from imported portfolio data
const buildVirtualFS = (): FSNode => {
  const projectsChildren: Record<string, FSNode> = {};
  
  projects.forEach((p) => {
    projectsChildren[p.id] = {
      name: p.id,
      type: "directory",
      children: {
        "problem.txt": {
          name: "problem.txt",
          type: "file",
          content: (
            <div className="font-mono text-xs pl-2 space-y-1">
              <span className="text-terminal-red font-bold">// {p.title} - Problem:</span>
              <p className="text-text-primary/95">{p.problem}</p>
            </div>
          )
        },
        "approach.txt": {
          name: "approach.txt",
          type: "file",
          content: (
            <div className="font-mono text-xs pl-2 space-y-1">
              <span className="text-accent font-bold">// {p.title} - Approach:</span>
              <p className="text-text-primary/95">{p.approach}</p>
            </div>
          )
        },
        "stack.json": {
          name: "stack.json",
          type: "file",
          content: (
            <div className="font-mono text-xs pl-2 space-y-1">
              <span className="text-terminal-cyan font-bold">// {p.title} - Tech Stack:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {p.stack.map((s) => (
                  <span key={s} className="px-1.5 py-0.5 rounded bg-bg-tertiary text-terminal-cyan border border-border-terminal text-[10px]">{s}</span>
                ))}
              </div>
            </div>
          )
        },
        "outcome.log": {
          name: "outcome.log",
          type: "file",
          content: (
            <div className="font-mono text-xs pl-2 space-y-1">
              <span className="text-terminal-purple font-bold">// {p.title} - Outcome / Metrics:</span>
              <p className="text-text-primary/95">{p.outcome}</p>
            </div>
          )
        }
      }
    };
  });

  return {
    name: "~",
    type: "directory",
    children: {
      "projects": {
        name: "projects",
        type: "directory",
        children: projectsChildren
      },
      "about.md": { name: "about.md", type: "file", action: "about" },
      "experience.md": { name: "experience.md", type: "file", action: "experience" },
      "skills.md": { name: "skills.md", type: "file", action: "skills" },
      "contact.md": { name: "contact.md", type: "file", action: "contact" },
      "resume.pdf": { name: "resume.pdf", type: "file", action: "resume" }
    }
  };
};

const virtualFS = buildVirtualFS();

const resolveProjectName = (name: string): string => {
  const term = name.trim().toLowerCase();
  if (["feesbook", "fees", "feego", "1"].includes(term)) {
    return "feesbook";
  }
  if (["signallab", "signal", "2"].includes(term)) {
    return "signallab";
  }
  if (["smartride", "ride", "3"].includes(term)) {
    return "smartride";
  }
  if (["aai-entry-pass", "aai-pass", "aai pass", "aai", "pass system", "4"].includes(term)) {
    return "aai-entry-pass";
  }
  if (["supplylens", "supply", "5"].includes(term)) {
    return "supplylens";
  }
  if (["gsvconnect", "gsv", "6"].includes(term)) {
    return "gsvconnect";
  }
  if (projectIndexMap[term]) {
    return projectIndexMap[term];
  }
  return name;
};

interface ThemeConfig {
  name: string;
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgTabs: string;
  bgWindowChrome: string;
  bgAddressPill: string;
  accentAmber: string;
  accentGreen: string;
  accent: string;
  accentDim: string;
  accentGlow: string;
  borderColor: string;
  textMuted: string;
  textPrimary: string;
  textBright: string;
  asciiColor: string;
}

const themes: Record<string, ThemeConfig> = {
  default: {
    name: "default",
    bgPrimary: "#16212c",
    bgSecondary: "#1c2733",
    bgTertiary: "#26313d",
    bgTabs: "#16212c",
    bgWindowChrome: "#1c2733",
    bgAddressPill: "#26313d",
    accentAmber: "#e3a869",
    accentGreen: "#8fd08a",
    accent: "#e3a869",
    accentDim: "rgba(227, 168, 105, 0.08)",
    accentGlow: "rgba(227, 168, 105, 0.25)",
    borderColor: "#26313d",
    textMuted: "#7d8b99",
    textPrimary: "#d8dee9",
    textBright: "#f2f4f8",
    asciiColor: "#cdd3d9",
  },
  matrix: {
    name: "matrix",
    bgPrimary: "#050e05",
    bgSecondary: "#0a1a0a",
    bgTertiary: "#102610",
    bgTabs: "#050e05",
    bgWindowChrome: "#0a1a0a",
    bgAddressPill: "#102610",
    accentAmber: "#00ff00",
    accentGreen: "#33ff33",
    accent: "#33ff33",
    accentDim: "rgba(0, 255, 0, 0.08)",
    accentGlow: "rgba(0, 255, 0, 0.25)",
    borderColor: "#102610",
    textMuted: "#1b4d1b",
    textPrimary: "#33ff33",
    textBright: "#00ff00",
    asciiColor: "#33ff33",
  },
  dracula: {
    name: "dracula",
    bgPrimary: "#282a36",
    bgSecondary: "#21222c",
    bgTertiary: "#1e1f29",
    bgTabs: "#282a36",
    bgWindowChrome: "#21222c",
    bgAddressPill: "#1e1f29",
    accentAmber: "#ff79c6",
    accentGreen: "#bd93f9",
    accent: "#ff79c6",
    accentDim: "rgba(255, 121, 198, 0.08)",
    accentGlow: "rgba(255, 121, 198, 0.25)",
    borderColor: "#44475a",
    textMuted: "#6272a4",
    textPrimary: "#f8f8f2",
    textBright: "#ffffff",
    asciiColor: "#bd93f9",
  },
  nord: {
    name: "nord",
    bgPrimary: "#2e3440",
    bgSecondary: "#242933",
    bgTertiary: "#3b4252",
    bgTabs: "#2e3440",
    bgWindowChrome: "#242933",
    bgAddressPill: "#3b4252",
    accentAmber: "#88c0d0",
    accentGreen: "#8fbcbb",
    accent: "#88c0d0",
    accentDim: "rgba(136, 192, 208, 0.08)",
    accentGlow: "rgba(136, 192, 208, 0.25)",
    borderColor: "#3b4252",
    textMuted: "#4c566a",
    textPrimary: "#d8dee9",
    textBright: "#eceff4",
    asciiColor: "#88c0d0",
  },
  cyberpunk: {
    name: "cyberpunk",
    bgPrimary: "#100518",
    bgSecondary: "#1a0826",
    bgTertiary: "#250c36",
    bgTabs: "#100518",
    bgWindowChrome: "#1a0826",
    bgAddressPill: "#250c36",
    accentAmber: "#fcee0a",
    accentGreen: "#00f0ff",
    accent: "#fcee0a",
    accentDim: "rgba(252, 238, 10, 0.08)",
    accentGlow: "rgba(252, 238, 10, 0.25)",
    borderColor: "#250c36",
    textMuted: "#7a2e9e",
    textPrimary: "#00f0ff",
    textBright: "#ffffff",
    asciiColor: "#fcee0a",
  }
};

const baseCommands = [
  "help",
  "about",
  "experience",
  "skills",
  "projects",
  "cd",
  "ls",
  "pwd",
  "github",
  "linkedin",
  "contact",
  "resume",
  "clear",
  "restart",
  "tree",
  "cat",
  "theme"
];

export function useTerminal(
  triggerImageAnimation: () => void,
  inputRef: RefObject<HTMLInputElement | null>
) {
  const [pathStack, setPathStack] = useState<string[]>(["~"]);
  const [history, setHistory] = useState<LogItem[]>([]);
  const [input, setInput] = useState("");
  const [caretIndex, setCaretIndex] = useState(0);
  
  // Ghost suggestion
  const [ghostText, setGhostText] = useState("");
  
  // History recall
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Active theme state
  const [theme, setThemeState] = useState<string>("default");

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  // Load saved theme on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme && themes[savedTheme]) {
        setThemeState(savedTheme);
      }
    }
  }, []);

  const applyThemeVariables = (themeName: string) => {
    const t = themes[themeName];
    if (!t) return;
    const root = document.documentElement;
    root.style.setProperty("--bg-primary", t.bgPrimary);
    root.style.setProperty("--bg-secondary", t.bgSecondary);
    root.style.setProperty("--bg-tertiary", t.bgTertiary);
    root.style.setProperty("--bg-tabs", t.bgTabs);
    root.style.setProperty("--bg-window-chrome", t.bgWindowChrome);
    root.style.setProperty("--bg-address-pill", t.bgAddressPill);
    root.style.setProperty("--accent-amber", t.accentAmber);
    root.style.setProperty("--accent-green", t.accentGreen);
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent-dim", t.accentDim);
    root.style.setProperty("--accent-glow", t.accentGlow);
    root.style.setProperty("--border-color", t.borderColor);
    root.style.setProperty("--text-muted", t.textMuted);
    root.style.setProperty("--text-primary", t.textPrimary);
    root.style.setProperty("--text-bright", t.textBright);
    root.style.setProperty("--ascii-color", t.asciiColor);
  };

  useEffect(() => {
    applyThemeVariables(theme);
  }, [theme]);

  // Autocomplete tab state
  const [tabSuggestions, setTabSuggestions] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(-1);
  const [tabOriginalInput, setTabOriginalInput] = useState("");

  const currentPath = pathStack.join("/");

  const formatPath = (stack: string[]) => {
    return stack.join("/");
  };

  // Mount effect to start terminal session
  useEffect(() => {
    executeCommand("start");
  }, []);

  // Simulate previous commands to find active path stack context
  const simulatePathStack = (inputLine: string, currentStack: string[]): string[] => {
    const segments = inputLine.split(";");
    if (segments.length <= 1) return [...currentStack];

    let simStack = [...currentStack];
    for (let i = 0; i < segments.length - 1; i++) {
      const seg = segments[i].trim();
      if (!seg) continue;

      const args = seg.split(/\s+/);
      const cmd = args[0].toLowerCase();
      const arg = args.slice(1).join(" ").toLowerCase().replace(/\/+$/, "");

      if (cmd === "cd") {
        if (!arg || arg === "~") {
          simStack = ["~"];
        } else if (arg === "..") {
          if (simStack.length > 1) {
            simStack.pop();
          }
        } else {
          const parts = arg.split("/");
          if (parts[0] === "projects" && parts.length === 2) {
            const targetId = resolveProjectName(parts[1]);
            const p = projects.find((x) => x.id === targetId);
            if (p) {
              simStack = ["~", "projects", p.id];
            }
          } else {
            const targetId = resolveProjectName(arg);
            const p = projects.find((x) => x.id === targetId);
            if (p) {
              if (simStack.length > 1) {
                simStack = ["~", "projects", p.id];
              }
            } else if (arg === "projects") {
              simStack = ["~", "projects"];
            }
          }
        }
      }
    }
    return simStack;
  };

  const getCommandsForContext = (stack: string[] = pathStack) => {
    return baseCommands;
  };

  // Sync cursor selection range natively
  const setNativeCursor = (pos: number) => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(pos, pos);
      }
    }, 0);
  };

  // Calculate inline ghost suggestions
  useEffect(() => {
    if (tabSuggestions.length > 0) return;

    if (!input) {
      setGhostText("");
      return;
    }

    const segments = input.split(";");
    const activeSegment = segments[segments.length - 1];
    const activeTrimmed = activeSegment.trimStart();

    if (!activeTrimmed) {
      setGhostText("");
      return;
    }

    const trimmed = activeTrimmed.toLowerCase();
    const args = trimmed.split(/\s+/);
    const cmd = args[0];
    const activeStack = simulatePathStack(input, pathStack);
    const activeNode = findNode(virtualFS, activeStack);



    if (args.length === 1 && !trimmed.endsWith(" ")) {
      const avail = getCommandsForContext(activeStack);
      const match = avail.find((c) => c.startsWith(cmd) && c !== cmd);
      if (match) {
        setGhostText(match.slice(cmd.length));
        return;
      }
    } else if (cmd === "cd" && args.length === 2 && args[1].length > 0) {
      const folderArg = args[1];
      const pathParts = folderArg.split("/");
      const typing = pathParts.pop() || "";
      
      let parentStack = [...activeStack];
      let validParent = true;
      
      for (const p of pathParts) {
        let name = p;
        if (parentStack.length === 2 && parentStack[1] === "projects") {
          name = resolveProjectName(p);
        }
        const node = findNode(virtualFS, parentStack);
        if (node && node.children && node.children[name] && node.children[name].type === "directory") {
          parentStack.push(name);
        } else {
          validParent = false;
          break;
        }
      }

      if (validParent) {
        const targetNode = findNode(virtualFS, parentStack);
        const children = targetNode?.children || {};
        const availDirs = Object.keys(children).filter((k) => children[k].type === "directory");
        const match = availDirs.find((s) => s.startsWith(typing) && s !== typing);
        if (match) {
          setGhostText(match.slice(typing.length));
          return;
        }
      }
    } else if (cmd === "cat" && args.length === 2 && args[1].length > 0) {
      const fileArg = args[1];
      const pathParts = fileArg.split("/");
      const typing = pathParts.pop() || "";
      
      let parentStack = [...activeStack];
      let validParent = true;
      
      for (const p of pathParts) {
        let name = p;
        if (parentStack.length === 2 && parentStack[1] === "projects") {
          name = resolveProjectName(p);
        }
        const node = findNode(virtualFS, parentStack);
        if (node && node.children && node.children[name] && node.children[name].type === "directory") {
          parentStack.push(name);
        } else {
          validParent = false;
          break;
        }
      }

      if (validParent) {
        const targetNode = findNode(virtualFS, parentStack);
        const children = targetNode?.children || {};
        const availFiles = Object.keys(children).filter((k) => children[k].type === "file");
        const match = availFiles.find((s) => s.startsWith(typing) && s !== typing);
        if (match) {
          setGhostText(match.slice(typing.length));
          return;
        }
      }
    }

    setGhostText("");
  }, [input, pathStack, tabSuggestions]);

  const acceptGhostSuggestion = () => {
    if (!ghostText) return;
    const completedText = input + ghostText;
    setInput(completedText);
    setCaretIndex(completedText.length);
    setNativeCursor(completedText.length);
    setGhostText("");
    resetTabCycle();
  };

  const handleCtrlC = () => {
    setHistory((prev) => [...prev, { path: formatPath(pathStack), command: input, output: null }]);
    setInput("");
    setCaretIndex(0);
    setGhostText("");
    resetTabCycle();
  };

  const handleCtrlL = () => {
    setHistory([]);
    setGhostText("");
    resetTabCycle();
  };

  const handleUpArrow = () => {
    if (cmdHistory.length === 0) return;
    let nextIndex = historyIndex === -1 ? cmdHistory.length - 1 : historyIndex - 1;
    if (nextIndex < 0) nextIndex = 0;
    setHistoryIndex(nextIndex);
    const selected = cmdHistory[nextIndex];
    setInput(selected);
    setCaretIndex(selected.length);
    setNativeCursor(selected.length);
    setGhostText("");
    resetTabCycle();
  };

  const handleDownArrow = () => {
    if (historyIndex === -1) return;
    let nextIndex = historyIndex + 1;
    if (nextIndex >= cmdHistory.length) {
      setHistoryIndex(-1);
      setInput("");
      setCaretIndex(0);
    } else {
      setHistoryIndex(nextIndex);
      const selected = cmdHistory[nextIndex];
      setInput(selected);
      setCaretIndex(selected.length);
      setNativeCursor(selected.length);
    }
    setGhostText("");
    resetTabCycle();
  };

  const resetTabCycle = () => {
    setTabSuggestions([]);
    setTabIndex(-1);
    setTabOriginalInput("");
  };

  const handleTabCompletion = () => {
    const isFirstTab = tabSuggestions.length === 0;

    let targetInput = isFirstTab ? input : tabOriginalInput;
    const segments = targetInput.split(";");
    const activeSegment = segments[segments.length - 1];
    const activeTrimmed = activeSegment.trimStart();
    const trimmed = activeTrimmed.toLowerCase();
    const args = trimmed.split(/\s+/);
    const cmd = args[0];
    const activeStack = simulatePathStack(targetInput, pathStack);
    const activeNode = findNode(virtualFS, activeStack);



    let matches: string[] = [];
    let isCommandAutocomplete = args.length === 1 && !trimmed.endsWith(" ");
    let isCdAutocomplete = (cmd === "cd" && args.length === 2) || (cmd === "cd" && args.length === 1 && activeSegment.endsWith(" "));
    let isCatAutocomplete = (cmd === "cat" && args.length === 2) || (cmd === "cat" && args.length === 1 && activeSegment.endsWith(" "));

    if (isCommandAutocomplete) {
      const avail = getCommandsForContext(activeStack);
      matches = avail.filter((c) => c.startsWith(cmd));
    } else if (isCdAutocomplete) {
      const folderArg = args[1] || "";
      const pathParts = folderArg.split("/");
      const typing = pathParts.pop() || "";
      
      let parentStack = [...activeStack];
      let validParent = true;
      
      for (const p of pathParts) {
        let name = p;
        if (parentStack.length === 2 && parentStack[1] === "projects") {
          name = resolveProjectName(p);
        }
        const node = findNode(virtualFS, parentStack);
        if (node && node.children && node.children[name] && node.children[name].type === "directory") {
          parentStack.push(name);
        } else {
          validParent = false;
          break;
        }
      }

      if (validParent) {
        const targetNode = findNode(virtualFS, parentStack);
        const children = targetNode?.children || {};
        const availDirs = Object.keys(children).filter((k) => children[k].type === "directory");
        matches = availDirs.filter((s) => s.startsWith(typing)).map((s) => {
          const prefix = pathParts.length > 0 ? pathParts.join("/") + "/" : "";
          return prefix + s;
        });
      }
    } else if (isCatAutocomplete) {
      const fileArg = args[1] || "";
      const pathParts = fileArg.split("/");
      const typing = pathParts.pop() || "";
      
      let parentStack = [...activeStack];
      let validParent = true;
      
      for (const p of pathParts) {
        let name = p;
        if (parentStack.length === 2 && parentStack[1] === "projects") {
          name = resolveProjectName(p);
        }
        const node = findNode(virtualFS, parentStack);
        if (node && node.children && node.children[name] && node.children[name].type === "directory") {
          parentStack.push(name);
        } else {
          validParent = false;
          break;
        }
      }

      if (validParent) {
        const targetNode = findNode(virtualFS, parentStack);
        const children = targetNode?.children || {};
        const availFiles = Object.keys(children).filter((k) => children[k].type === "file");
        matches = availFiles.filter((s) => s.startsWith(typing)).map((s) => {
          const prefix = pathParts.length > 0 ? pathParts.join("/") + "/" : "";
          return prefix + s;
        });
      }
    }

    if (matches.length === 0) return;

    if (isFirstTab) {
      setTabOriginalInput(input);
      setTabSuggestions(matches);
      setTabIndex(0);
      applyTabSuggestion(targetInput, matches[0], isCommandAutocomplete);
    } else {
      const nextIndex = (tabIndex + 1) % tabSuggestions.length;
      setTabIndex(nextIndex);
      applyTabSuggestion(targetInput, tabSuggestions[nextIndex], isCommandAutocomplete);
    }
  };

  const applyTabSuggestion = (original: string, suggestion: string, isCmd: boolean) => {
    const segments = original.split(";");
    const activeSegment = segments[segments.length - 1];
    const leadingSpaces = activeSegment.match(/^\s*/)?.[0] || "";
    const activeTrimmed = activeSegment.trimStart();
    
    let completedActive = "";
    if (isCmd) {
      completedActive = suggestion;
    } else {
      const parts = activeTrimmed.split(/\s+/);
      completedActive = `${parts[0]} ${suggestion}`;
    }
    
    segments[segments.length - 1] = leadingSpaces + completedActive;
    const completedLine = segments.join(";");

    setInput(completedLine);
    setCaretIndex(completedLine.length);
    setNativeCursor(completedLine.length);
  };

  const executeCommand = (commandLine: string) => {
    const trimmed = commandLine.trim();
    if (!trimmed) {
      setHistory((prev) => [...prev, { path: currentPath, command: "", output: null }]);
      return;
    }

    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const subCommands = trimmed.split(/;/).map((c) => c.trim()).filter(Boolean);
    let nextStack = [...pathStack];
    const outputs: React.ReactNode[] = [];

    for (let i = 0; i < subCommands.length; i++) {
      const sub = subCommands[i];
      const args = sub.split(/\s+/);
      const cmd = args[0].toLowerCase();
      const arg = args.slice(1).join(" ").toLowerCase();

      let output: React.ReactNode = null;

      // Handle direct project command execution (by ID, index, or common aliases)
      let directProjectId = "";
      const resFull = resolveProjectName(sub);
      const resCmd = resolveProjectName(cmd);
      if (projects.find((p) => p.id === resFull)) {
        directProjectId = resFull;
      } else if (projects.find((p) => p.id === resCmd)) {
        directProjectId = resCmd;
      }

      if (directProjectId) {
        const p = projects.find((x) => x.id === directProjectId);
        if (p) {
          nextStack = ["~", "projects", p.id];
          output = formatProjectDetail(p);
        }
      } else {
        switch (cmd) {
        case "start":
          triggerImageAnimation();
          output = (
            <div className="space-y-4 p-2 font-mono text-xs text-text-primary leading-relaxed">
              <AsciiBanner />
              <div className="space-y-2 mt-4">
                <p className="text-white font-bold text-sm">Welcome to my interactive terminal portfolio!</p>
                <p className="text-text-primary">
                  Hi, I&apos;m <span className="text-accent-amber font-bold">Bhavesh Suthar</span>, an AI/ML Engineer and Backend Developer.
                  Currently pursuing B.Tech in AI & Data Science (Class of 2028). I build production systems, computer vision pipelines, and high-performance backends.
                </p>
                <p className="text-text-muted text-[10px]">
                  Explore the terminal by typing commands or clicking the shortcuts below.
                </p>
              </div>
              <div className="space-y-1.5 pt-2">
                <p className="text-white font-bold">Quick Shortcuts:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pl-2 max-w-sm">
                  <button onClick={() => executeCommand("about")} className="terminal-link text-left">➜ about</button>
                  <button onClick={() => executeCommand("experience")} className="terminal-link text-left">➜ experience</button>
                  <button onClick={() => executeCommand("projects")} className="terminal-link text-left">➜ projects</button>
                  <button onClick={() => executeCommand("skills")} className="terminal-link text-left">➜ skills</button>
                  <button onClick={() => executeCommand("contact")} className="terminal-link text-left">➜ contact</button>
                  <button onClick={() => executeCommand("help")} className="terminal-link text-left">➜ help</button>
                </div>
              </div>
            </div>
          );
          break;

        case "about":
        case "experience":
        case "skills":
        case "contact":
        case "resume":
          output = getSectionContent(cmd);
          break;

        case "projects":
          output = formatProjectsList();
          break;

        case "help":
        case "commands":
          output = (
            <div className="space-y-2 text-text-primary font-mono text-xs leading-relaxed">
              <p className="text-white font-bold mb-1">Available commands in terminal:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pl-2">
                <div><button onClick={() => executeCommand("about")} className="terminal-link font-bold text-left">about</button>          - Short B.Tech profile bio</div>
                <div><button onClick={() => executeCommand("experience")} className="terminal-link font-bold text-left">experience</button>     - Log of internships</div>
                <div><button onClick={() => executeCommand("skills")} className="terminal-link font-bold text-left">skills</button>         - Grouped tech stack tag list</div>
                <div><button onClick={() => executeCommand("projects")} className="terminal-link font-bold text-left">projects</button>       - List all virtual project directories</div>
                <div><span className="text-accent-green font-bold">cd &lt;dir&gt;</span>       - Change directory (e.g. cd projects, cd projects/feesbook)</div>
                <div><button onClick={() => executeCommand("cd ..")} className="terminal-link font-bold text-left">cd ..</button>          - Move up one directory level</div>
                <div><button onClick={() => executeCommand("ls")} className="terminal-link font-bold text-left">ls</button>             - List contents of current directory</div>
                <div><button onClick={() => executeCommand("cat <file>")} className="terminal-link font-bold text-left">cat</button>            - View file content (e.g. cat problem.txt)</div>
                <div><button onClick={() => executeCommand("pwd")} className="terminal-link font-bold text-left">pwd</button>            - Print current path stack</div>
                <div><button onClick={() => executeCommand("github")} className="terminal-link font-bold text-left">github</button> / <button onClick={() => executeCommand("linkedin")} className="terminal-link font-bold text-left">linkedin</button> - Redirect to social platforms</div>
                <div><button onClick={() => executeCommand("contact")} className="terminal-link font-bold text-left">contact</button>        - Connect channels (email, social indexes)</div>
                <div><button onClick={() => executeCommand("resume")} className="terminal-link font-bold text-left">resume</button>         - Download resume document (PDF)</div>
                <div><button onClick={() => executeCommand("clear")} className="terminal-link font-bold text-left">clear</button>          - Clear terminal logs</div>
                <div><button onClick={() => executeCommand("restart")} className="terminal-link font-bold text-left">restart</button>        - Reload terminal and welcome screen</div>
                <div><button onClick={() => executeCommand("theme")} className="terminal-link font-bold text-left">theme</button>          - Switch color theme in real time</div>
              </div>
              <p className="text-[10px] text-text-muted mt-2 pl-2">💡 Tip: Click on any command keyword above to execute it directly.</p>
            </div>
          );
          break;

        case "theme": {
          const themeName = arg.trim();
          if (!themeName) {
            output = (
              <div className="font-mono text-xs text-text-primary pl-2 space-y-2">
                <p className="text-white font-bold">// Theme Selection Panel</p>
                <p>Usage: <span className="text-accent-amber">theme &lt;name&gt;</span></p>
                <div className="space-y-1.5 pl-2">
                  <p className="text-white">Available Themes (click to apply):</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 max-w-md pt-1">
                    {Object.keys(themes).map((k) => (
                      <button 
                        key={k} 
                        onClick={() => executeCommand(`theme ${k}`)}
                        className={`text-left font-mono hover:underline ${theme === k ? "text-accent-green font-bold" : "text-terminal-cyan"}`}
                      >
                        ➜ {k.padEnd(11)} : {themes[k].name === "default" ? "Slate-navy (default)" : k === "matrix" ? "Hacker green" : k === "dracula" ? "Dracula dark" : k === "nord" ? "Arctic nord" : "Neon yellow-cyan"}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-text-muted mt-2">Active theme: <span className="text-white font-bold">{theme}</span>. Theme transitions are animated smoothly.</p>
              </div>
            );
          } else if (themes[themeName]) {
            setTheme(themeName);
            output = (
              <div className="font-mono text-xs text-accent-green pl-2 font-bold">
                ➜ Theme switched to &quot;{themeName}&quot; successfully!
              </div>
            );
          } else {
            output = (
              <div className="font-mono text-xs text-terminal-red pl-2">
                bash: theme: &quot;{themeName}&quot; is not a valid theme. Type <button onClick={() => executeCommand("theme")} className="terminal-link">theme</button> to see the list.
              </div>
            );
          }
          break;
        }

        case "cd": {
          const sanitizedArg = arg.trim().replace(/\/+$/, "");
          if (!sanitizedArg || sanitizedArg === "~") {
            nextStack = ["~"];
            output = <div className="text-text-muted pl-2">Navigated to ~</div>;
          } else if (sanitizedArg === "..") {
            if (nextStack.length > 1) {
              nextStack.pop();
              output = <div className="text-text-muted pl-2">Navigated back to {formatPath(nextStack)}</div>;
            } else {
              output = <div className="text-text-muted pl-2">Already at root level (~)</div>;
            }
          } else {
            const segments = sanitizedArg.split("/").filter(Boolean);
            let tempStack = [...nextStack];
            let valid = true;

            for (const seg of segments) {
              if (seg === "..") {
                if (tempStack.length > 1) tempStack.pop();
              } else if (seg === ".") {
                // do nothing
              } else {
                let targetName = seg;
                if (tempStack.length === 2 && tempStack[1] === "projects" && projectIndexMap[seg]) {
                  targetName = projectIndexMap[seg];
                }

                const parentNode = findNode(virtualFS, tempStack);
                if (parentNode && parentNode.children && parentNode.children[targetName]) {
                  const childNode = parentNode.children[targetName];
                  if (childNode.type === "directory") {
                    tempStack.push(targetName);
                  } else {
                    valid = false;
                    output = <div className="text-terminal-red pl-2">bash: cd: {sanitizedArg}: Not a directory</div>;
                    break;
                  }
                } else {
                  if (tempStack.length === 1 && Object.values(projectIndexMap).includes(targetName)) {
                    valid = false;
                    output = <div className="text-terminal-red pl-2">bash: cd: {sanitizedArg}: No such file or directory.</div>;
                    break;
                  }
                  valid = false;
                  output = <div className="text-terminal-red pl-2">bash: cd: {sanitizedArg}: No such file or directory.</div>;
                  break;
                }
              }
            }

            if (valid) {
              nextStack = tempStack;
              if (nextStack.length === 3) {
                const projectId = nextStack[2];
                const p = projects.find((x) => x.id === projectId);
                if (p) {
                  output = formatProjectDetail(p);
                }
              } else {
                output = <div className="text-text-muted pl-2">Navigated to {formatPath(nextStack)}. Type &quot;ls&quot; to list contents.</div>;
              }
            }
          }
          break;
        }

        case "ls": {
          const node = findNode(virtualFS, nextStack);
          if (node && node.children) {
            const keys = Object.keys(node.children);
            output = (
              <div className="font-mono text-xs flex flex-wrap gap-x-6 gap-y-1 pl-2">
                {keys.map((key) => {
                  const child = node.children![key];
                  const isDir = child.type === "directory";
                  
                  let clickCmd = "";
                  if (isDir) {
                    // Navigate to directories
                    // Special case if clicked from root for projects:
                    if (nextStack.length === 1 && key === "projects") {
                      clickCmd = "cd projects";
                    } else {
                      // Construct path from current location
                      clickCmd = `cd ${formatPath([...nextStack.slice(1), key])}`;
                    }
                  } else {
                    clickCmd = child.action || `cat ${key}`;
                  }

                  return (
                    <button 
                      key={key}
                      onClick={() => executeCommand(clickCmd)}
                      className={isDir ? "text-accent-green font-bold hover:underline text-left font-mono" : "terminal-link text-left font-mono"}
                    >
                      {key}{isDir ? "/" : ""}
                    </button>
                  );
                })}
              </div>
            );
          } else {
            output = <div className="text-terminal-red pl-2">bash: ls: cannot open directory</div>;
          }
          break;
        }

        case "cat": {
          const filename = arg.trim();
          if (!filename) {
            output = <div className="text-terminal-red pl-2">cat: missing operand</div>;
          } else {
            const currNode = findNode(virtualFS, nextStack);
            if (currNode && currNode.children && currNode.children[filename]) {
              const fileNode = currNode.children[filename];
              if (fileNode.type === "file") {
                if (fileNode.content) {
                  output = fileNode.content;
                } else if (fileNode.action) {
                  output = getSectionContent(fileNode.action);
                }
              } else {
                output = <div className="text-terminal-red pl-2">cat: {filename}: Is a directory</div>;
              }
            } else {
              output = <div className="text-terminal-red pl-2">cat: {filename}: No such file or directory</div>;
            }
          }
          break;
        }

        case "pwd":
          output = <div className="font-mono text-xs text-text-primary pl-2">/{formatPath(nextStack)}</div>;
          break;

        case "github":
          window.open(socialLinks.github, "_blank", "noopener,noreferrer");
          output = <div className="font-mono text-xs text-accent pl-2">Redirecting to GitHub profile...</div>;
          break;

        case "linkedin":
          window.open(socialLinks.linkedin, "_blank", "noopener,noreferrer");
          output = <div className="font-mono text-xs text-accent pl-2">Redirecting to LinkedIn profile...</div>;
          break;

        case "clear":
          setHistory([]);
          setInput("");
          setCaretIndex(0);
          resetTabCycle();
          return;

        case "restart":
          setTheme("default");
          applyThemeVariables("default");
          setHistory([]);
          resetTabCycle();
          setInput("");
          setCaretIndex(0);
          setPathStack(["~"]);
          
          setTimeout(() => {
            executeCommand("start");
          }, 10);
          return;

        case "tree":
          output = (
            <div className="font-mono text-xs text-text-primary pl-2 space-y-1">
              <p className="text-white font-bold">~/ (Bhavesh Portfolio Workspace)</p>
              <div className="pl-2 leading-tight whitespace-pre font-mono">
                {"├── "}
                <button onClick={() => executeCommand("cd projects")} className="terminal-link font-bold">projects/</button>
                {"\n"}
                {projects.map((p, idx) => {
                  const isLastProject = idx === projects.length - 1;
                  const projectPrefix = isLastProject ? "└── " : "├── ";
                  const childPrefix = isLastProject ? "    " : "│   ";
                  return (
                    <React.Fragment key={p.id}>
                      {`│   ${projectPrefix}`}
                      <button onClick={() => executeCommand(`cd projects/${p.id}`)} className="terminal-link font-bold">{p.id}/</button>
                      {"\n"}
                      {`${`│   ${childPrefix}`}├── problem.txt\n`}
                      {`${`│   ${childPrefix}`}├── approach.txt\n`}
                      {`${`│   ${childPrefix}`}├── stack.json\n`}
                      {`${`│   ${childPrefix}`}└── outcome.log\n`}
                    </React.Fragment>
                  );
                })}
                {"├── "}
                <button onClick={() => executeCommand("about")} className="terminal-link">about.md</button>
                {"\n"}
                {"├── "}
                <button onClick={() => executeCommand("experience")} className="terminal-link">experience.md</button>
                {"\n"}
                {"├── "}
                <button onClick={() => executeCommand("skills")} className="terminal-link">skills.md</button>
                {"\n"}
                {"├── "}
                <button onClick={() => executeCommand("contact")} className="terminal-link">contact.md</button>
                {"\n"}
                {"└── "}
                <button onClick={() => executeCommand("resume")} className="terminal-link">resume.pdf</button>
              </div>
            </div>
          );
          break;

        default:
          output = (
            <div className="font-mono text-xs text-terminal-red pl-2">
              bash: {cmd}: command not found. Type <button onClick={() => executeCommand("help")} className="terminal-link font-bold">help</button> to see list of valid commands.
            </div>
          );
      }

      }

      outputs.push(output);
    }

    setHistory((prev) => [
      ...prev,
      {
        path: formatPath(pathStack),
        command: commandLine,
        output: (
          <div className="space-y-3">
            {outputs.map((out, idx) => out && (
              <div key={idx}>{out}</div>
            ))}
          </div>
        )
      }
    ]);
    setPathStack(nextStack);
    setInput("");
    setCaretIndex(0);
    resetTabCycle();
  };

  const formatProjectsList = () => {
    return (
      <div className="space-y-2 font-mono text-xs pl-2">
        <p className="text-white font-bold">Bhavesh Suthar Projects Directory:</p>
        <div className="space-y-1 pl-2">
          {projects.map((p, idx) => (
            <div key={p.id} className="flex gap-2 items-center">
              <span className="text-accent-amber w-4 text-right shrink-0">{idx + 1}.</span>
              <button 
                onClick={() => executeCommand(`cd projects/${p.id}`)}
                className="text-accent-green font-bold hover:underline font-mono"
              >
                {p.id}/
              </button>
              <span className="text-text-muted select-none">-</span>
              <span className="text-text-primary">{p.problem.slice(0, 100)}...</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-text-muted font-mono mt-2">
          Type <span className="text-white">&quot;cd projects/&lt;project-name&gt;&quot;</span> to view details.
        </p>
      </div>
    );
  };

  const formatProjectDetail = (p: typeof projects[0]) => {
    return (
      <div className="font-mono text-xs text-text-primary space-y-3 pl-2 border-l border-accent/20">
        <div className="flex items-center justify-between border-b border-border-terminal/50 pb-1.5 mb-2">
          <span className="text-white font-bold">{p.title} File Specifications:</span>
          <span className="text-[10px] text-accent-amber uppercase font-bold">[{p.status}]</span>
        </div>
        <div>
          <span className="text-terminal-red font-bold block">// Problem:</span>
          <p className="text-text-primary/95">{p.problem}</p>
        </div>
        <div>
          <span className="text-accent font-bold block">// Approach:</span>
          <p className="text-text-primary/95">{p.approach}</p>
        </div>
        <div>
          <span className="text-terminal-cyan font-bold block">// Tech Stack:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {p.stack.map((s) => (
              <span key={s} className="px-1.5 py-0.5 rounded bg-bg-tertiary text-terminal-cyan border border-border-terminal text-[10px]">{s}</span>
            ))}
          </div>
        </div>
        <div>
          <span className="text-terminal-purple font-bold block">// Outcome / Metrics:</span>
          <p className="text-text-primary/95">{p.outcome}</p>
        </div>
      </div>
    );
  };

  return {
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
    theme,
    setTheme
  };
}
