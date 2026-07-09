"use client";

import { useState } from "react";
import { Search, Terminal } from "lucide-react";
import { skillCategories } from "@/data/portfolio";

export default function SkillsSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section id="skills" className="py-12 border-b border-border-terminal relative">
      {/* Prompt Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-accent">
          <span className="text-text-muted select-none">~/portfolio</span>
          <span>$</span>
          <h2 className="font-bold text-lg tracking-wider text-glow">grep -ri &quot;{searchQuery || "*"}&quot; skills/</h2>
        </div>

        {/* Live Grep Input */}
        <div className="relative max-w-xs w-full font-mono text-sm">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted">
            <Search size={14} />
          </div>
          <input
            type="text"
            id="skills-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills (e.g., PyTorch, Docker)"
            className="w-full bg-bg-secondary text-accent border border-border-terminal focus:border-accent focus:outline-none rounded pl-9 pr-3 py-1.5 font-mono text-xs placeholder-text-muted/60 transition-colors"
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
        {skillCategories.map((cat) => {
          // Filter matching skills or show all if search is empty
          const matchingSkills = cat.skills.filter((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          );

          // If search is not empty and no skills match in this category, we can dim it
          const hasMatches = matchingSkills.length > 0;
          const isFiltering = searchQuery.trim() !== "";
          const isCategoryVisible = !isFiltering || hasMatches;

          return (
            <div
              key={cat.category}
              className={`p-4 border border-border-terminal rounded-lg bg-bg-tabs/50 transition-opacity duration-300 ${
                isCategoryVisible ? "opacity-100" : "opacity-30"
              }`}
            >
              {/* Category Label */}
              <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3 font-semibold select-none border-b border-border-terminal/40 pb-1">
                <span>skills/</span>
                <span className="text-white">{cat.category.toLowerCase().replace(/\s+/g, "")}.json</span>
              </div>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => {
                  const isHighlighted =
                    isFiltering &&
                    skill.toLowerCase().includes(searchQuery.toLowerCase());
                  
                  return (
                    <span
                      key={skill}
                      className={`text-xs px-2.5 py-1 rounded border transition-all duration-200 select-none ${
                        isHighlighted
                          ? "bg-accent/15 border-accent text-accent text-glow shadow-[0_0_10px_rgba(57,255,136,0.1)]"
                          : isFiltering
                          ? "bg-bg-primary/20 border-border-terminal/40 text-text-primary/40"
                          : "bg-bg-primary border-border-terminal text-text-primary hover:border-accent/40"
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
