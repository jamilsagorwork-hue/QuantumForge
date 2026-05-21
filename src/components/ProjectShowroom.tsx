import React, { useState } from "react";
import { ExternalLink, Layers, ArrowUpRight, CheckCircle2, ChevronRight, ShoppingCart, Briefcase, FileCode2, Cpu, Globe } from "lucide-react";
import { Project } from "../types";

interface ProjectShowroomProps {
  projects: Project[];
}

export default function ProjectShowroom({ projects }: ProjectShowroomProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const categories = ["All", "E-Commerce", "Creative Portfolios", "Custom Web Apps", "AI Automation Systems"];

  const filteredProjects = selectedFilter === "All" 
    ? projects 
    : projects.filter((p) => p.category === selectedFilter);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "E-Commerce": return <ShoppingCart className="w-4 h-4 text-sky-400" />;
      case "Creative Portfolios": return <Briefcase className="w-4 h-4 text-purple-400" />;
      case "Custom Web Apps": return <FileCode2 className="w-4 h-4 text-emerald-400" />;
      case "AI Automation Systems": return <Cpu className="w-4 h-4 text-indigo-400" />;
      default: return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div id="project-showroom-workspace" className="space-y-8 pt-4 max-w-7xl mx-auto px-1 text-left relative">
      
      {/* Category Selection Filter pills */}
      <div className="flex flex-wrap gap-2.5 items-center justify-start border-b border-slate-900 pb-5">
        <span className="font-mono text-xs text-slate-500 tracking-wider mr-2 uppercase">FILTER WORKSPACE NODE:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelectedFilter(cat)}
            className={`py-1.5 px-3.5 rounded-lg border font-mono text-xs transition-all uppercase tracking-wider ${
              selectedFilter === cat
                ? "bg-gradient-to-r from-sky-950 to-indigo-950 border-sky-400/80 text-sky-300 shadow-md shadow-sky-450/10"
                : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of 3D Styled Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            id={`project-card-${project.id}`}
            className={`group rounded-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-6 flex flex-col justify-between shadow-2xl transition-all duration-500 cursor-default ${project.depthOffset}`}
          >
            <div>
              {/* Header Info */}
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-2 py-1 px-3 rounded-full bg-slate-950/90 border border-slate-800">
                  {getCategoryIcon(project.category)}
                  <span className="font-mono text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
                <div className="text-emerald-400 font-mono text-xs font-semibold bg-emerald-950/30 border border-emerald-900/60 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  {project.metrics}
                </div>
              </div>

              {/* Title */}
              <h3 className="font-sans font-bold text-white text-xl md:text-2xl tracking-tight leading-snug group-hover:text-sky-300 transition-colors">
                {project.title}
              </h3>
              
              {/* Description */}
              <p className="text-slate-300 text-sm mt-3 leading-relaxed font-sans font-normal">
                {project.description}
              </p>

              {/* features bullets */}
              <div className="mt-5 space-y-2 bg-slate-950/30 p-4 rounded-xl border border-slate-800/30">
                <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">Key Architectural Deliverables:</span>
                <ul className="space-y-1.5 mt-2">
                  {project.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-sans leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-400/90 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tech Stack & Assignment details */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="py-1 px-2 rounded font-mono text-[10px] text-indigo-300 bg-slate-950 border border-slate-800/60 transition-colors group-hover:border-sky-800/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between font-mono text-xs text-slate-500">
                <span className="text-indigo-200.text-slate-400 font-bold">{project.roleAssigned}</span>
                <div className="flex items-center gap-1.5 font-medium text-sky-400 group-hover:text-sky-300 transition-colors">
                  <span className="text-[11px] uppercase tracking-wider">SYSTEM SPECIFICATIONS</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Quote Segment */}
      <div className="bg-slate-900/20 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-4 flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
        <div>
          <h4 className="font-sans font-semibold text-white text-base">Want a project tailored exactly to your business model?</h4>
          <p className="text-sm text-slate-400 font-sans mt-1">QuantumForge designs high-throughput digital frameworks featuring zero latency bottlenecks, with every line written natively in modern TypeScript & Go.</p>
        </div>
        <a
          href="#request-forms-portal"
          className="shrink-0 flex items-center gap-2 py-2 px-5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-sky-500/10 active:scale-95 text-center"
          onClick={(e) => {
            // Smooth navigate to request form
            const elem = document.getElementById("client-portal-tab-trigger");
            if (elem) elem.click();
          }}
        >
          <Globe className="w-4 h-4" /> INITIATE CORRESPONDENCE
        </a>
      </div>

    </div>
  );
}
