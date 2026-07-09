"use client";

import { Briefcase, GraduationCap } from "lucide-react";
import { experiences, education } from "@/data/portfolio";

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-12 border-b border-border-terminal relative">
      {/* Experience Header */}
      <div className="flex items-center gap-2 mb-6 text-accent">
        <span className="text-text-muted select-none">~/portfolio</span>
        <span>$</span>
        <h2 className="font-bold text-lg tracking-wider text-glow">cat experience.log</h2>
      </div>

      {/* Editor Line-number Simulation layout */}
      <div className="flex gap-4 font-mono text-sm leading-relaxed mb-12">
        {/* Fake editor line numbers */}
        <div className="text-text-muted select-none text-right hidden sm:block w-8 border-r border-border-terminal/40 pr-2">
          {Array.from({ length: experiences.length * 6 }).map((_, i) => (
            <div key={i}>{String(i + 1).padStart(2, "0")}</div>
          ))}
        </div>

        {/* Experience log items */}
        <div className="flex-1 space-y-8">
          {experiences.map((exp, index) => (
            <div key={exp.company} className="relative group">
              {/* Connector Dot */}
              <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full bg-accent border border-accent hidden sm:block group-hover:scale-125 transition-transform" />
              
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-accent" />
                    <h3 className="font-bold text-white text-base">
                      {exp.company}
                    </h3>
                  </div>
                  <span className="text-xs text-text-muted bg-bg-secondary px-2 py-0.5 border border-border-terminal rounded self-start sm:self-auto">
                    {exp.period}
                  </span>
                </div>

                <div className="text-xs text-accent/80 font-semibold tracking-wide">
                  ROLE: {exp.role.toUpperCase()}
                </div>

                <p className="text-text-primary text-sm opacity-90 leading-relaxed font-mono">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Header */}
      <div className="flex items-center gap-2 mb-6 text-accent">
        <span className="text-text-muted select-none">~/portfolio</span>
        <span>$</span>
        <h2 className="font-bold text-lg tracking-wider text-glow">cat education.log</h2>
      </div>

      {/* Education Line-number Simulation Layout */}
      <div className="flex gap-4 font-mono text-sm leading-relaxed">
        {/* Fake editor line numbers */}
        <div className="text-text-muted select-none text-right hidden sm:block w-8 border-r border-border-terminal/40 pr-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>{String(i + 1).padStart(2, "0")}</div>
          ))}
        </div>

        {/* Education items */}
        <div className="flex-1 space-y-6">
          {education.map((edu) => (
            <div key={edu.institution} className="relative group">
              {/* Connector Dot */}
              <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full bg-accent border border-accent hidden sm:block group-hover:scale-125 transition-transform" />
              
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <GraduationCap size={15} className="text-accent" />
                    <h3 className="font-bold text-white text-base">
                      {edu.institution}
                    </h3>
                  </div>
                  <span className="text-xs text-text-muted bg-bg-secondary px-2 py-0.5 border border-border-terminal rounded self-start sm:self-auto">
                    {edu.period}
                  </span>
                </div>

                <div className="text-xs text-accent/80 font-semibold tracking-wide">
                  DEGREE: {edu.degree.toUpperCase()}
                </div>

                <p className="text-text-primary text-sm opacity-90 leading-relaxed font-mono">
                  {edu.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
