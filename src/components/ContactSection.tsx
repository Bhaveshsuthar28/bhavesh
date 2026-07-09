"use client";

import { useState } from "react";
import { Copy, Check, Terminal, ExternalLink, ArrowRight } from "lucide-react";
import { socialLinks } from "@/data/portfolio";

export default function ContactSection() {
  const [emailCopied, setEmailCopied] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText(socialLinks.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const contactCommands = [
    {
      script: "./email.sh",
      actionLabel: "Copy to Clipboard & Email",
      action: copyEmail,
      displayVal: socialLinks.email,
      isCopy: true,
    },
    {
      script: "./github.sh",
      actionLabel: "Visit Github Profile",
      action: () => window.open(socialLinks.github, "_blank", "noopener,noreferrer"),
      displayVal: "github.com/Bhaveshsuthar28",
      isCopy: false,
    },
    {
      script: "./linkedin.sh",
      actionLabel: "Connect on LinkedIn",
      action: () => window.open(socialLinks.linkedin, "_blank", "noopener,noreferrer"),
      displayVal: "linkedin.com/in/bhaveshjangid",
      isCopy: false,
    },
    {
      script: "./resume.sh",
      actionLabel: "Open / Download Resume PDF",
      action: () => window.open(socialLinks.resume, "_blank", "noopener,noreferrer"),
      displayVal: "View Resume Document",
      isCopy: false,
    },
  ];

  return (
    <section id="contact" className="py-12 border-b border-border-terminal relative">
      {/* Prompt Header */}
      <div className="flex items-center gap-2 mb-6 text-accent">
        <span className="text-text-muted select-none">~/portfolio</span>
        <span>$</span>
        <h2 className="font-bold text-lg tracking-wider text-glow">./contact.sh</h2>
      </div>

      <div className="border border-border-terminal rounded-lg bg-bg-tabs font-mono text-sm overflow-hidden max-w-2xl">
        {/* Terminal Header Bar */}
        <div className="bg-bg-secondary px-4 py-2 border-b border-border-terminal flex items-center justify-between text-xs text-text-muted select-none">
          <div className="flex items-center gap-1.5">
            <Terminal size={12} className="text-accent" />
            <span>bash - ./contact.sh</span>
          </div>
          <span>UTF-8</span>
        </div>

        {/* Terminal Panel Content */}
        <div className="p-4 space-y-4">
          <div className="text-text-muted text-xs select-none">
            # Select a script to execute action:
          </div>

          <div className="space-y-3">
            {contactCommands.map((cmd) => (
              <div
                key={cmd.script}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded border border-transparent hover:border-accent-dim hover:bg-bg-primary/50 transition-all group"
                onMouseEnter={() => setActiveHover(cmd.script)}
                onMouseLeave={() => setActiveHover(null)}
              >
                <button
                  onClick={cmd.action}
                  className="flex items-center gap-2 text-accent hover:text-accent focus:outline-none text-left"
                >
                  <span className="text-text-muted select-none select-none group-hover:text-accent transition-colors">
                    $
                  </span>
                  <span className="font-bold underline decoration-dotted group-hover:no-underline">
                    {cmd.script}
                  </span>
                  {cmd.isCopy ? (
                    emailCopied ? (
                      <Check size={12} className="text-accent animate-ping" />
                    ) : (
                      <Copy size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                    )
                  ) : (
                    <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>

                <div className="flex items-center gap-2 text-xs sm:text-right pl-5 sm:pl-0">
                  <span className="text-text-muted select-none">→</span>
                  <span className="text-text-primary group-hover:text-white font-mono break-all">
                    {cmd.isCopy && emailCopied ? (
                      <span className="text-accent font-semibold">
                        [copied to clipboard]
                      </span>
                    ) : (
                      cmd.displayVal
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action explanation tooltip bar */}
          <div className="mt-4 pt-3 border-t border-border-terminal/40 h-8 flex items-center justify-between text-xs text-text-muted select-none">
            <div className="flex items-center gap-1.5">
              <span>STATUS:</span>
              <span className={activeHover ? "text-accent" : ""}>
                {activeHover
                  ? `Ready to execute ${activeHover}`
                  : "Awaiting execution..."}
              </span>
            </div>
            {activeHover && (
              <div className="flex items-center gap-1 text-accent-glow">
                <span>{contactCommands.find((c) => c.script === activeHover)?.actionLabel}</span>
                <ArrowRight size={10} className="animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
