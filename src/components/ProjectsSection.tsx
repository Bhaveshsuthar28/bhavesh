"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode, ChevronDown, ChevronRight, ExternalLink, Activity } from "lucide-react";
import { projects, Project } from "@/data/portfolio";

export default function ProjectsSection() {
  const [expandedId, setExpandedId] = useState<string | null>("feesbook"); // Default first open

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="projects" className="py-12 border-b border-border-terminal relative">
      {/* Prompt Header */}
      <div className="flex items-center gap-2 mb-6 text-accent">
        <span className="text-text-muted select-none">~/portfolio</span>
        <span>$</span>
        <h2 className="font-bold text-lg tracking-wider text-glow">ls -la ~/projects</h2>
      </div>

      <div className="mb-6 font-mono text-xs text-text-muted select-none hidden md:block">
        total 5 items
        <br />
        drwxr-xr-x  5 bhavesh staff  160 Jul  9 10:53 .
        <br />
        drwxr-xr-x  8 bhavesh staff  256 Jul  9 10:53 ..
      </div>

      {/* Directory-listing cards grid */}
      <div className="space-y-4">
        {projects.map((project, index) => {
          const isExpanded = expandedId === project.id;
          // Generate artificial Unix permissions & size metadata for aesthetic
          const sizeKb = (project.problem.length + project.approach.length) / 100;
          const sizeFormatted = `${sizeKb.toFixed(1)}k`;

          return (
            <div
              key={project.id}
              className={`border border-border-terminal rounded-lg overflow-hidden transition-all ${
                isExpanded ? "border-accent bg-bg-secondary" : "hover:border-accent/40 bg-bg-primary"
              }`}
            >
              {/* Card Header (Executable/File metadata layout) */}
              <button
                onClick={() => toggleExpand(project.id)}
                className="w-full text-left p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono select-none"
                aria-expanded={isExpanded}
                id={`project-btn-${project.id}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-text-muted hidden md:inline text-xs select-none">
                    -rwxr-xr-x &nbsp;&nbsp; {sizeFormatted} &nbsp;&nbsp; bhavesh &nbsp;&nbsp; staff
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-accent" />
                    ) : (
                      <ChevronRight size={16} className="text-text-muted" />
                    )}
                    <FileCode size={16} className={isExpanded ? "text-accent" : "text-text-muted"} />
                    <span className={`font-semibold tracking-wide text-sm md:text-base ${isExpanded ? "text-accent" : "text-white"}`}>
                      {project.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  {/* Status Indicator */}
                  <span className="text-xs px-2 py-0.5 rounded border border-border-terminal bg-bg-tertiary flex items-center gap-1.5 text-text-muted">
                    <Activity size={10} className={project.status.toLowerCase().includes("live") || project.status.toLowerCase().includes("production") ? "text-accent animate-pulse" : "text-yellow-500"} />
                    {project.status}
                  </span>
                  <span className="text-xs text-text-muted select-none">
                    [0{index + 1}]
                  </span>
                </div>
              </button>

              {/* Card Expanded Body */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="p-5 border-t border-border-terminal/50 bg-bg-tabs font-mono text-sm space-y-6">
                      
                      {/* Problem Block */}
                      <div>
                        <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
                          <span>//</span>
                          <span className="text-yellow-500 font-semibold">PROBLEM STATEMENT</span>
                        </div>
                        <p className="text-text-primary leading-relaxed pl-4 border-l-2 border-yellow-500/50">
                          {project.problem}
                        </p>
                      </div>

                      {/* Architecture / Approach Block */}
                      <div>
                        <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
                          <span>//</span>
                          <span className="text-accent font-semibold">ARCHITECTURE & APPROACH</span>
                        </div>
                        <p className="text-text-primary leading-relaxed pl-4 border-l-2 border-accent/50">
                          {project.approach}
                        </p>
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <div className="text-xs text-text-muted mb-2 flex items-center gap-1">
                          <span>//</span>
                          <span className="text-cyan-400 font-semibold">TECH STACK UTILIZED</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-4">
                          {project.stack.map((tech) => (
                            <span
                              key={tech}
                              className="text-xs px-2.5 py-1 rounded-md border border-border-terminal bg-bg-secondary text-cyan-400 font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Outcome & Metrics */}
                      <div>
                        <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
                          <span>//</span>
                          <span className="text-green-400 font-semibold">OUTCOME & METRICS</span>
                        </div>
                        <p className="text-text-primary leading-relaxed pl-4 border-l-2 border-green-400/50">
                          {project.outcome}
                        </p>
                      </div>

                      {/* URL Actions */}
                      {project.url && (
                        <div className="pt-2 flex justify-end">
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 border border-accent bg-accent-dim text-accent hover:bg-accent/20 transition-all rounded text-xs"
                          >
                            <span>Launch Live App</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
