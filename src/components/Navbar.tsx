"use client";

import { useEffect, useState } from "react";
import { FileCode, FileText, Settings, X } from "lucide-react";

interface Tab {
  id: string;
  name: string;
  type: "markdown" | "shell" | "json" | "python";
}

const tabs: Tab[] = [
  { id: "whoami", name: "whoami.md", type: "markdown" },
  { id: "projects", name: "projects.sh", type: "shell" },
  { id: "experience", name: "experience.log", type: "markdown" },
  { id: "skills", name: "skills.json", type: "json" },
  { id: "contact", name: "contact.py", type: "python" },
];

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("whoami");

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "-40% 0px -50% 0px", // Trigger when section occupies center area
      threshold: 0.1,
    });

    tabs.forEach((tab) => {
      const element = document.getElementById(tab.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      // Offset scroll for sticky tab bar
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 44;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "markdown":
        return <FileText size={13} className="text-blue-400" />;
      case "shell":
        return <FileCode size={13} className="text-accent" />;
      case "json":
        return <Settings size={13} className="text-yellow-500" />;
      case "python":
        return <FileCode size={13} className="text-cyan-400" />;
      default:
        return <FileText size={13} />;
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-bg-tabs border-b border-border-terminal flex items-center overflow-x-auto scrollbar-none select-none">
      {/* File Tabs */}
      <div className="flex flex-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs border-r border-border-terminal relative transition-colors group focus:outline-none ${
                isActive
                  ? "bg-bg-primary text-white border-t-2 border-t-accent"
                  : "bg-bg-tabs text-text-muted hover:text-text-primary hover:bg-bg-primary/30"
              }`}
              id={`tab-btn-${tab.id}`}
            >
              {getIcon(tab.type)}
              <span className={isActive ? "text-white" : "text-text-muted group-hover:text-text-primary"}>
                {tab.name}
              </span>
              
              {/* Fake close tab button */}
              <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 p-0.5 rounded-sm hover:bg-border-terminal/45 text-text-muted hover:text-white">
                <X size={10} />
              </span>

              {/* Bottom active indicator matching IDE */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Editor layout mode tag (aesthetic only) */}
      <div className="hidden md:flex items-center gap-2 px-4 text-xs font-mono text-text-muted">
        <span className="px-1.5 py-0.5 rounded border border-border-terminal/50 bg-bg-secondary text-[10px]">
          TypeScript
        </span>
        <span>JSX</span>
      </div>
    </div>
  );
}
