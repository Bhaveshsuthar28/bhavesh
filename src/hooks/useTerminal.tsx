"use client";

import React, { useState, useEffect, RefObject } from "react";
import { projects, skillCategories, education, experiences, socialLinks, bioData } from "@/data/portfolio";
import { AsciiBanner } from "@/components/AsciiArt";

export interface LogItem {
  path: string;
  command: string;
  output: React.ReactNode;
}

const projectIndexMap: Record<string, string> = {
  "1": "feesbook",
  "2": "visionboard-ai",
  "3": "trinetra",
  "4": "aai-entry-pass",
  "5": "supplylens",
};

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

  // Autocomplete tab state
  const [tabSuggestions, setTabSuggestions] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(-1);
  const [tabOriginalInput, setTabOriginalInput] = useState("");

  const currentPath = pathStack.join("/");

  const formatPath = (stack: string[]) => {
    return stack.join("/");
  };

  const getCommandsForContext = () => {
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
    ];

    if (pathStack.length === 2 && pathStack[1] === "projects") {
      return [...baseCommands, ...projects.map((p) => p.id)];
    }
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

    const trimmed = input.toLowerCase();
    const args = trimmed.split(/\s+/);
    const cmd = args[0];

    if (args.length === 1 && !trimmed.endsWith(" ")) {
      const avail = getCommandsForContext();
      const match = avail.find((c) => c.startsWith(cmd) && c !== cmd);
      if (match) {
        setGhostText(match.slice(cmd.length));
        return;
      }
    } else if (cmd === "cd" && args.length === 2) {
      const folderArg = args[1];
      const isAtRoot = pathStack.length === 1;
      const availSuggestions = isAtRoot
        ? ["projects", "about", "experience", "skills", "contact", "help"]
        : projects.map((p) => p.id);
      const match = availSuggestions.find((s) => s.startsWith(folderArg) && s !== folderArg);
      if (match) {
        setGhostText(match.slice(folderArg.length));
        return;
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

  const resetTabCycle = () => {
    setTabSuggestions([]);
    setTabIndex(-1);
    setTabOriginalInput("");
  };

  const handleCtrlC = () => {
    setInput("");
    setCaretIndex(0);
    setHistory((prev) => [...prev, { path: currentPath, command: input, output: null }]);
    resetTabCycle();
  };

  const handleCtrlL = () => {
    setHistory([]);
    resetTabCycle();
  };

  const handleUpArrow = () => {
    if (cmdHistory.length === 0) return;
    const nextIndex = historyIndex + 1;
    if (nextIndex < cmdHistory.length) {
      setHistoryIndex(nextIndex);
      const recalled = cmdHistory[cmdHistory.length - 1 - nextIndex];
      setInput(recalled);
      setCaretIndex(recalled.length);
      setNativeCursor(recalled.length);
      resetTabCycle();
    }
  };

  const handleDownArrow = () => {
    const nextIndex = historyIndex - 1;
    if (nextIndex >= 0) {
      setHistoryIndex(nextIndex);
      const recalled = cmdHistory[cmdHistory.length - 1 - nextIndex];
      setInput(recalled);
      setCaretIndex(recalled.length);
      setNativeCursor(recalled.length);
      resetTabCycle();
    } else {
      setHistoryIndex(-1);
      setInput("");
      setCaretIndex(0);
      setNativeCursor(0);
      resetTabCycle();
    }
  };

  const handleTabCompletion = () => {
    const isFirstTab = tabSuggestions.length === 0;

    let targetInput = isFirstTab ? input : tabOriginalInput;
    const trimmed = targetInput.toLowerCase();
    const args = trimmed.split(/\s+/);
    const cmd = args[0];

    let matches: string[] = [];
    let isCommandAutocomplete = args.length === 1 && !trimmed.endsWith(" ");
    let isCdAutocomplete = (cmd === "cd" && args.length === 2) || (cmd === "cd" && args.length === 1 && targetInput.endsWith(" "));

    if (isCommandAutocomplete) {
      const avail = getCommandsForContext();
      matches = avail.filter((c) => c.startsWith(cmd));
    } else if (isCdAutocomplete) {
      const folderArg = args[1] || "";
      const isAtRoot = pathStack.length === 1;
      const availSuggestions = isAtRoot
        ? ["projects", "about", "experience", "skills", "contact", "help"]
        : projects.map((p) => p.id);
      matches = availSuggestions.filter((s) => s.startsWith(folderArg));
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
    let completed = "";
    if (isCmd) {
      completed = suggestion;
    } else {
      const parts = original.split(/\s+/);
      completed = `${parts[0]} ${suggestion}`;
    }
    setInput(completed);
    setCaretIndex(completed.length);
    setNativeCursor(completed.length);
  };

  const executeCommand = (commandLine: string) => {
    const trimmed = commandLine.trim();
    if (!trimmed) {
      setHistory((prev) => [...prev, { path: currentPath, command: "", output: null }]);
      return;
    }

    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const args = trimmed.split(/\s+/);
    const cmd = args[0].toLowerCase();
    const arg = args.slice(1).join(" ").toLowerCase();

    let output: React.ReactNode = null;
    let nextStack = [...pathStack];

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
              <div><span className="text-accent-green font-bold">cd &lt;dir&gt;</span>       - Change directory (e.g. cd projects, cd feesbook)</div>
              <div><button onClick={() => executeCommand("cd ..")} className="terminal-link font-bold text-left">cd ..</button>          - Move up one directory level</div>
              <div><button onClick={() => executeCommand("ls")} className="terminal-link font-bold text-left">ls</button>             - List contents of current directory</div>
              <div><button onClick={() => executeCommand("pwd")} className="terminal-link font-bold text-left">pwd</button>            - Print current path stack</div>
              <div><button onClick={() => executeCommand("github")} className="terminal-link font-bold text-left">github</button> / <button onClick={() => executeCommand("linkedin")} className="terminal-link font-bold text-left">linkedin</button> - Redirect to social platforms</div>
              <div><button onClick={() => executeCommand("contact")} className="terminal-link font-bold text-left">contact</button>        - Connect channels (email, social indexes)</div>
              <div><button onClick={() => executeCommand("resume")} className="terminal-link font-bold text-left">resume</button>         - Download resume document (PDF)</div>
              <div><button onClick={() => executeCommand("clear")} className="terminal-link font-bold text-left">clear</button>          - Clear terminal logs</div>
              <div><button onClick={() => executeCommand("restart")} className="terminal-link font-bold text-left">restart</button>        - Reload terminal and welcome screen</div>
              <div><button onClick={() => executeCommand("tree")} className="terminal-link font-bold text-left">tree</button>           - Graphic ASCII tree of workspace</div>
            </div>
            <p className="text-[10px] text-text-muted mt-2 pl-2">💡 Tip: Click on any command keyword above to execute it directly.</p>
          </div>
        );
        break;

      case "about":
        output = (
          <div className="font-mono text-xs text-text-primary leading-relaxed space-y-2 pl-2 border-l border-accent/20">
            <p className="text-white font-bold">{bioData.fullName}</p>
            <p className="text-white">B.Tech, Artificial Intelligence & Data Science</p>
            <p>Gati Shakti Vishwavidyalaya (GSV), Vadodara — Class of 2028 (3rd year)</p>
            <p className="text-text-primary/95 mt-2">
              I build production systems — from BCAS-compliant infra at Airports Authority of India to real-time video intelligence pipelines. Focused on backend engineering, systems performance, and applied ML.
            </p>
          </div>
        );
        break;

      case "experience":
        output = (
          <div className="font-mono text-xs text-text-primary space-y-3 pl-2">
            <div>
              <p className="text-white font-bold">AAI Varanasi (Airports Authority of India) — Internship</p>
              <p className="text-text-primary/95 pl-3 border-l border-accent/30 mt-1">
                Built and deployed a production BCAS-compliant Aerodrome Entry Pass system: passwordless auth (FingerprintJS), PDF pass generation (pdf-lib), multi-step approval workflow.
                <br />
                <span className="text-terminal-purple">Stack: Node.js, Fastify, Prisma, PostgreSQL</span>
              </p>
            </div>
            <div>
              <p className="text-white font-bold">DRM Vadodara (Indian Railways) — Internship (1st year)</p>
            </div>
          </div>
        );
        break;

      case "skills":
        output = (
          <div className="font-mono text-xs text-text-primary space-y-1.5 pl-2">
            {skillCategories.map((cat) => (
              <div key={cat.category} className="flex flex-col sm:flex-row sm:items-start gap-1">
                <span className="text-white font-bold w-32 shrink-0">{cat.category.padEnd(14)}:</span>
                <span className="text-text-primary">{cat.skills.join(", ")}</span>
              </div>
            ))}
          </div>
        );
        break;

      case "projects":
        if (currentPath === "~") {
          output = (
            <div className="font-mono text-xs text-text-primary space-y-3 pl-2">
              <div className="space-y-1.5">
                {projects.map((p, idx) => (
                  <div key={p.id} className="flex items-start gap-1.5">
                    <span className="text-text-muted select-none">[{idx + 1}]</span>
                    <button 
                      onClick={() => executeCommand(`cd ${p.id}`)}
                      className="terminal-link font-bold font-mono"
                    >
                      {p.id}
                    </button>
                    <span className="text-text-muted select-none">-</span>
                    <span className="text-text-primary">{p.problem.slice(0, 100)}...</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-text-muted font-mono mt-2">
                Type <span className="text-white">&quot;cd &lt;project-name&gt;&quot;</span> or <span className="text-white">&quot;cd &lt;number&gt;&quot;</span> to view details.
              </p>
            </div>
          );
        } else {
          output = <div className="text-text-primary pl-2">Already inside directory tree. Type &quot;ls&quot; to see files.</div>;
        }
        break;

      case "cd":
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
          // Support sub-directory slash path, e.g. cd projects/feesbook
          const parts = sanitizedArg.split("/");
          if (parts[0] === "projects" && parts.length === 2) {
            let targetId = parts[1];
            if (projectIndexMap[parts[1]]) {
              targetId = projectIndexMap[parts[1]];
            }
            const p = projects.find((x) => x.id === targetId);
            if (p) {
              nextStack = ["~", "projects", p.id];
              output = formatProjectDetail(p);
            } else {
              output = <div className="text-terminal-red pl-2">bash: cd: {sanitizedArg}: No such file or directory.</div>;
            }
          } else {
            // Check if matches a project (by ID or index number)
            let targetId = sanitizedArg;
            if (projectIndexMap[sanitizedArg]) {
              targetId = projectIndexMap[sanitizedArg];
            }
            const p = projects.find((x) => x.id === targetId);

            if (p) {
              // Block direct cd to project if we are at root level (~)
              if (pathStack.length === 1) {
                output = <div className="text-terminal-red pl-2">bash: cd: {sanitizedArg}: No such file or directory.</div>;
              } else {
                nextStack = ["~", "projects", p.id];
                output = formatProjectDetail(p);
              }
            } else if (sanitizedArg === "projects") {
              nextStack = ["~", "projects"];
              output = <div className="text-text-muted pl-2">Navigated to ~/projects. Type &quot;ls&quot; to list directories.</div>;
            }
          } else if (["about", "experience", "skills", "contact", "help", "commands"].includes(sanitizedArg)) {
            nextStack = ["~"];
            if (sanitizedArg === "about") {
              output = (
                <div className="font-mono text-xs text-text-primary leading-relaxed space-y-2 pl-2 border-l border-accent/20">
                  <p className="text-white font-bold">{bioData.fullName}</p>
                  <p className="text-white">B.Tech, Artificial Intelligence & Data Science</p>
                  <p>Gati Shakti Vishwavidyalaya (GSV), Vadodara — Class of 2028 (3rd year)</p>
                  <p className="text-text-primary/95 mt-2">
                    I build production systems — from BCAS-compliant infra at Airports Authority of India to real-time video intelligence pipelines. Focused on backend engineering, systems performance, and applied ML.
                  </p>
                </div>
              );
            } else if (sanitizedArg === "experience") {
              output = (
                <div className="font-mono text-xs text-text-primary space-y-3 pl-2">
                  <div>
                    <p className="text-white font-bold">AAI Varanasi (Airports Authority of India) — Internship</p>
                    <p className="text-text-primary/95 pl-3 border-l border-accent/30 mt-1">
                      Built and deployed a production BCAS-compliant Aerodrome Entry Pass system: passwordless auth (FingerprintJS), PDF pass generation (pdf-lib), multi-step approval workflow.
                      <br />
                      <span className="text-terminal-purple">Stack: Node.js, Fastify, Prisma, PostgreSQL</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-bold">DRM Vadodara (Indian Railways) — Internship (1st year)</p>
                  </div>
                </div>
              );
            } else if (sanitizedArg === "skills") {
              output = (
                <div className="font-mono text-xs text-text-primary space-y-1.5 pl-2">
                  {skillCategories.map((cat) => (
                    <div key={cat.category} className="flex flex-col sm:flex-row sm:items-start gap-1">
                      <span className="text-white font-bold w-32 shrink-0">{cat.category.padEnd(14)}:</span>
                      <span className="text-text-primary">{cat.skills.join(", ")}</span>
                    </div>
                  ))}
                </div>
              );
            } else if (sanitizedArg === "contact") {
              output = (
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
            } else {
              output = (
                <div className="space-y-2 text-text-primary font-mono text-xs leading-relaxed">
                  <p className="text-white font-bold mb-1">Available commands in terminal:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pl-2">
                    <div><button onClick={() => executeCommand("about")} className="terminal-link font-bold text-left">about</button>          - Short B.Tech profile bio</div>
                    <div><button onClick={() => executeCommand("experience")} className="terminal-link font-bold text-left">experience</button>     - Log of internships</div>
                    <div><button onClick={() => executeCommand("skills")} className="terminal-link font-bold text-left">skills</button>         - Grouped tech stack tag list</div>
                    <div><button onClick={() => executeCommand("projects")} className="terminal-link font-bold text-left">projects</button>       - List all virtual project directories</div>
                    <div><span className="text-accent-green font-bold">cd &lt;dir&gt;</span>       - Change directory (e.g. cd projects, cd feesbook)</div>
                    <div><button onClick={() => executeCommand("cd ..")} className="terminal-link font-bold text-left">cd ..</button>          - Move up one directory level</div>
                    <div><button onClick={() => executeCommand("ls")} className="terminal-link font-bold text-left">ls</button>             - List contents of current directory</div>
                    <div><button onClick={() => executeCommand("pwd")} className="terminal-link font-bold text-left">pwd</button>            - Print current path stack</div>
                    <div><button onClick={() => executeCommand("github")} className="terminal-link font-bold text-left">github</button> / <button onClick={() => executeCommand("linkedin")} className="terminal-link font-bold text-left">linkedin</button> - Redirect to social platforms</div>
                    <div><button onClick={() => executeCommand("contact")} className="terminal-link font-bold text-left">contact</button>        - Connect channels (email, social indexes)</div>
                    <div><button onClick={() => executeCommand("resume")} className="terminal-link font-bold text-left">resume</button>         - Download resume document (PDF)</div>
                    <div><button onClick={() => executeCommand("clear")} className="terminal-link font-bold text-left">clear</button>          - Clear terminal logs</div>
                    <div><button onClick={() => executeCommand("restart")} className="terminal-link font-bold text-left">restart</button>        - Reload terminal and welcome screen</div>
                  </div>
                  <p className="text-[10px] text-text-muted mt-2 pl-2">💡 Tip: Click on any command keyword above to execute it directly.</p>
                </div>
              );
            }
          } else {
            output = <div className="text-terminal-red pl-2">bash: cd: {arg}: No such file or directory.</div>;
          }
        }
        break;

      case "ls":
        if (currentPath === "~") {
          output = (
            <div className="font-mono text-xs flex flex-wrap gap-x-6 gap-y-1 pl-2">
              <button onClick={() => executeCommand("cd projects")} className="text-accent-green font-bold hover:underline">projects/</button>
              <button onClick={() => executeCommand("about")} className="terminal-link">about.md</button>
              <button onClick={() => executeCommand("experience")} className="terminal-link">experience.md</button>
              <button onClick={() => executeCommand("skills")} className="terminal-link">skills.md</button>
              <button onClick={() => executeCommand("contact")} className="terminal-link">contact.md</button>
              <button onClick={() => executeCommand("resume")} className="terminal-link">resume.pdf</button>
            </div>
          );
        } else if (currentPath === "~/projects") {
          output = (
            <div className="font-mono text-xs text-accent flex flex-wrap gap-x-8 gap-y-1 pl-2">
              {projects.map((p) => (
                <button 
                  key={p.id}
                  onClick={() => executeCommand(`cd ${p.id}`)}
                  className="terminal-link text-left font-bold font-mono"
                >
                  {p.id}/
                </button>
              ))}
            </div>
          );
        } else {
          const targetId = pathStack[2];
          const p = projects.find((x) => x.id === targetId);
          if (p) {
            output = (
              <div className="font-mono text-xs text-white flex gap-6 pl-2">
                <span>problem.txt</span>
                <span>approach.txt</span>
                <span>stack.json</span>
                <span>outcome.log</span>
              </div>
            );
          }
        }
        break;

      case "pwd":
        output = <div className="font-mono text-xs text-text-primary pl-2">{currentPath}</div>;
        break;

      case "github":
        window.open(socialLinks.github, "_blank", "noopener,noreferrer");
        output = <div className="font-mono text-xs text-accent pl-2">Redirecting to GitHub profile...</div>;
        break;

      case "linkedin":
        window.open(socialLinks.linkedin, "_blank", "noopener,noreferrer");
        output = <div className="font-mono text-xs text-accent pl-2">Redirecting to LinkedIn profile...</div>;
        break;

      case "contact":
        output = (
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
        break;

      case "resume":
        window.open(socialLinks.resume, "_blank", "noopener,noreferrer");
        output = <div className="font-mono text-xs text-accent pl-2">Opening resume.pdf in new tab...</div>;
        break;

      case "clear":
        setHistory([]);
        setInput("");
        setCaretIndex(0);
        resetTabCycle();
        return;

      case "restart":
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
              {"│   ├── "}
              <button onClick={() => executeCommand("cd projects/feesbook")} className="terminal-link font-bold">feesbook/</button>
              {"\n"}
              {"│   │   ├── problem.txt\n"}
              {"│   │   ├── approach.txt\n"}
              {"│   │   ├── stack.json\n"}
              {"│   │   └── outcome.log\n"}
              {"│   ├── "}
              <button onClick={() => executeCommand("cd projects/visionboard-ai")} className="terminal-link font-bold">visionboard-ai/</button>
              {"\n"}
              {"│   │   ├── problem.txt\n"}
              {"│   │   ├── approach.txt\n"}
              {"│   │   ├── stack.json\n"}
              {"│   │   └── outcome.log\n"}
              {"│   ├── "}
              <button onClick={() => executeCommand("cd projects/trinetra")} className="terminal-link font-bold">trinetra/</button>
              {"\n"}
              {"│   │   ├── problem.txt\n"}
              {"│   │   ├── approach.txt\n"}
              {"│   │   ├── stack.json\n"}
              {"│   │   └── outcome.log\n"}
              {"│   ├── "}
              <button onClick={() => executeCommand("cd projects/aai-entry-pass")} className="terminal-link font-bold">aai-entry-pass/</button>
              {"\n"}
              {"│   │   ├── problem.txt\n"}
              {"│   │   ├── approach.txt\n"}
              {"│   │   ├── stack.json\n"}
              {"│   │   └── outcome.log\n"}
              {"│   └── "}
              <button onClick={() => executeCommand("cd projects/supplylens")} className="terminal-link font-bold">supplylens/</button>
              {"\n"}
              {"│       ├── problem.txt\n"}
              {"│       ├── approach.txt\n"}
              {"│       ├── stack.json\n"}
              {"│       └── outcome.log\n"}
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

    setHistory((prev) => [...prev, { path: formatPath(pathStack), command: commandLine, output }]);
    setPathStack(nextStack);
    setInput("");
    setCaretIndex(0);
    resetTabCycle();
  };

  const formatProjectDetail = (p: typeof projects[0]) => {
    return (
      <div className="font-mono text-xs text-text-primary space-y-3 pl-2 border-l border-accent/20">
        <div className="flex items-center justify-between border-b border-border-terminal/50 pb-1.5 mb-2">
          <span className="text-white font-bold">{p.title} File Specifications:</span>
          <span className="text-[10px] text-terminal-orange uppercase font-bold">[{p.status}]</span>
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
  };
}
