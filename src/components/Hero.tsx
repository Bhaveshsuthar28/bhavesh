"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Mail, ExternalLink, Terminal, Download } from "lucide-react";
import { bioData, socialLinks } from "@/data/portfolio";

const GithubIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);


export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const fullText = bioData.tagline;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 15); // Fast typing speed
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <section id="whoami" className="py-12 border-b border-border-terminal relative">
      {/* Prompt Header */}
      <div className="flex items-center gap-2 mb-6 text-accent">
        <span className="text-text-muted select-none">~/portfolio</span>
        <span>$</span>
        <h1 className="font-bold text-lg tracking-wider text-glow">whoami</h1>
      </div>

      {/* Bio Details */}
      <div className="space-y-6 max-w-4xl">
        <div>
          <span className="text-text-muted block text-xs mb-1 font-mono">// Primary Identity</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            {bioData.name}
            <span className="text-accent">.</span>
          </h2>
        </div>

        <div className="min-h-[60px] md:min-h-[50px]">
          <span className="text-text-muted block text-xs mb-1 font-mono">// Focus Area</span>
          <p className="text-base md:text-lg text-text-primary font-mono leading-relaxed">
            {typedText}
            {typedText.length < fullText.length && (
              <span className="terminal-caret"></span>
            )}
          </p>
        </div>

        <div>
          <span className="text-text-muted block text-xs mb-1 font-mono">// Education</span>
          <p className="text-sm md:text-base text-text-primary opacity-90 font-mono">
            {bioData.educationShort}
          </p>
        </div>

        {/* CTA Buttons - Styled as Terminal Commands */}
        <div className="pt-6 flex flex-wrap gap-4">
          <motion.a
            href={`${socialLinks.resume}?ik-attachment=true`}
            download="Bhavesh_Suthar_Resume_SDE.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-accent/30 bg-accent-dim text-accent hover:border-accent hover:bg-accent/25 transition-all rounded font-mono text-sm group relative overflow-hidden cursor-pointer"
            variants={{
              rest: {
                scale: 1,
                boxShadow: "0 0 0px rgba(0,0,0,0)",
                borderColor: "rgba(227, 168, 105, 0.3)"
              },
              hover: { 
                scale: 1.02,
                boxShadow: "0 0 15px var(--accent-glow)",
                borderColor: "var(--accent)"
              }
            }}
            whileTap={{ scale: 0.98 }}
            initial="rest"
            animate="rest"
            whileHover="hover"
          >
            <span className="text-text-muted group-hover:text-accent transition-colors select-none">$</span>
            <span>cat resume.pdf</span>
            <motion.span
              variants={{
                rest: { y: 0 },
                hover: { 
                  y: [0, 3, 0],
                  transition: { 
                    repeat: Infinity,
                    duration: 0.8,
                    ease: "easeInOut"
                  } 
                }
              }}
              className="flex items-center"
            >
              <Download size={14} className="opacity-75" />
            </motion.span>
          </motion.a>

          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-border-terminal hover:border-accent hover:bg-accent-dim text-text-primary hover:text-accent transition-all rounded font-mono text-sm group"
          >
            <span className="text-text-muted group-hover:text-accent transition-colors select-none">$</span>
            <span>git checkout github</span>
            <GithubIcon size={14} className="opacity-75" />
          </a>

          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-border-terminal hover:border-accent hover:bg-accent-dim text-text-primary hover:text-accent transition-all rounded font-mono text-sm group"
          >
            <span className="text-text-muted group-hover:text-accent transition-colors select-none">$</span>
            <span>connect --linkedin</span>
            <LinkedinIcon size={14} className="opacity-75" />
          </a>
        </div>

        {/* Social / Competitive Programming Badges */}
        <div className="pt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-border-terminal/30 mt-8">
          <a
            href={`mailto:${socialLinks.email}`}
            className="text-xs text-text-muted hover:text-accent flex items-center gap-1.5 transition-colors font-mono"
          >
            <Mail size={12} />
            <span>{socialLinks.email}</span>
          </a>
          <a
            href={socialLinks.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-muted hover:text-accent flex items-center gap-1.5 transition-colors font-mono"
          >
            <Terminal size={12} />
            <span>leetcode/Bhavesh_s_k</span>
            <ExternalLink size={10} className="opacity-50" />
          </a>
          <a
            href={socialLinks.codolio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-muted hover:text-accent flex items-center gap-1.5 transition-colors font-mono"
          >
            <Terminal size={12} />
            <span>codolio/Bhavesh_S_K28</span>
            <ExternalLink size={10} className="opacity-50" />
          </a>
        </div>
      </div>
    </section>
  );
}
