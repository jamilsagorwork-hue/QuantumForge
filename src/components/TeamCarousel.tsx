import React, { useState } from "react";
import { TeamMember, Skill } from "../types";
import { Shield, Calendar, MapPin, Award, Terminal, Code, Cpu, Edit, Save, Plus, Trash } from "lucide-react";

interface TeamCarouselProps {
  members: TeamMember[];
  onUpdateMember: (updatedMember: TeamMember) => Promise<boolean>;
  isAdmin: boolean;
}

export default function TeamCarousel({ members, onUpdateMember, isAdmin }: TeamCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<TeamMember | null>(null);

  if (members.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        <Cpu className="animate-spin mr-2" /> Loading team data...
      </div>
    );
  }

  const activeMember = members[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % members.length);
    setEditing(false);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + members.length) % members.length);
    setEditing(false);
  };

  const startEdit = () => {
    setEditForm(JSON.parse(JSON.stringify(activeMember))); // Deep copy
    setEditing(true);
  };

  const handleSave = async () => {
    if (!editForm) return;
    const success = await onUpdateMember(editForm);
    if (success) {
      setEditing(false);
    }
  };

  const updateField = (field: keyof TeamMember, value: any) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [field]: value });
  };

  const handleSkillChange = (idx: number, prop: keyof Skill, val: any) => {
    if (!editForm) return;
    const skills = [...editForm.skills];
    skills[idx] = { ...skills[idx], [prop]: val };
    setEditForm({ ...editForm, skills });
  };

  const addSkill = () => {
    if (!editForm) return;
    const newSkill: Skill = { name: "New Skill", level: 80, category: "Specialty" };
    setEditForm({ ...editForm, skills: [...editForm.skills, newSkill] });
  };

  const removeSkill = (idx: number) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      skills: editForm.skills.filter((_, i) => i !== idx)
    });
  };

  return (
    <div id="team-carousel-suite" className="flex flex-col lg:flex-row gap-8 items-stretch pt-4 max-w-7xl mx-auto px-1">
      {/* 3D Wheel/Card Rotator (Left Segment) */}
      <div className="w-full lg:w-5/12 flex flex-col justify-between bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        {/* Abstract futuristic grid back-mask */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.08),transparent_50%)] pointer-events-none" />
        
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs tracking-wider text-emerald-400 font-semibold uppercase">QUANTUMFORGE CORE FOUNDATION</span>
          </div>
          <span className="font-mono text-xs text-slate-500">{activeIndex + 1} / {members.length}</span>
        </div>

        {/* CSS 3D Depth Card View */}
        <div className="my-10 flex justify-center items-center h-64 relative z-10">
          {members.map((member, idx) => {
            const distance = idx - activeIndex;
            const isCurrent = idx === activeIndex;
            // responsive calculation to prevent phone view clipping
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
            const rotateY = distance * (isMobile ? 25 : 40);
            const translateZ = isCurrent ? 20 : (isMobile ? -80 : -100);
            const translateX = distance * (isMobile ? 50 : 110);
            const opacity = isCurrent ? 1 : (isMobile ? 0.2 : 0.35);
            const pointerEvents = isCurrent ? "auto" : "none";

            return (
              <div
                key={member.id}
                onClick={() => !isCurrent && setActiveIndex(idx)}
                style={{
                  transform: `perspective(1000px) rotateY(${rotateY}deg) translateZ(${translateZ}px) translateX(${translateX}px)`,
                  opacity: opacity,
                  pointerEvents: pointerEvents,
                  zIndex: 20 - Math.abs(distance)
                }}
                className={`absolute w-44 h-60 md:w-52 md:h-64 rounded-xl border flex flex-col items-center justify-center p-4 transition-all duration-700 cursor-pointer ${
                  isCurrent
                    ? "bg-slate-950 border-sky-500/50 shadow-sky-500/10 shadow-[0_0_35px_rgba(56,189,248,0.15)]"
                    : "bg-slate-950/40 border-slate-800 hover:border-slate-700 scale-90"
                }`}
              >
                {/* Immersive Avatar Matrix */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-sky-950 to-indigo-900 border-2 border-sky-400/40 flex items-center justify-center text-4xl mb-3 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)]">
                  <span className="select-none">{member.photo}</span>
                  {isCurrent && (
                    <div className="absolute -inset-1 rounded-full border border-sky-400/30 animate-ping pointer-events-none" />
                  )}
                </div>

                <h3 className="font-sans font-semibold text-white text-center text-sm md:text-base tracking-tight leading-tight">
                  {member.name}
                </h3>
                <p className="font-mono text-[10px] md:text-xs text-sky-400 font-semibold uppercase mt-1 tracking-wider text-center">
                  {member.role}
                </p>

                {member.rollNo && (
                  <div className="mt-2 bg-slate-900/80 border border-slate-800 rounded px-2 py-0.5 font-mono text-[9px] text-slate-400 text-center">
                    UID: {member.rollNo}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Carousel Micro Navigation Buttons */}
        <div className="flex gap-4 justify-between items-center z-10">
          <button
            id="team-prev-btn"
            onClick={handlePrev}
            className="flex-1 py-2 px-3 rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-slate-900 font-mono text-xs text-slate-300 hover:text-white transition-all text-center flex justify-center items-center gap-1 active:scale-95"
          >
            &larr; PREV NODE
          </button>
          
          <button
            id="team-next-btn"
            onClick={handleNext}
            className="flex-1 py-2 px-3 rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-slate-900 font-mono text-xs text-slate-300 hover:text-white transition-all text-center flex justify-center items-center gap-1 active:scale-95"
          >
            NEXT NODE &rarr;
          </button>
        </div>
      </div>

      {/* Detail Analytics & Skill Matrix View (Right Segment) */}
      <div className="flex-1 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden">
        
        {/* Admin floating Edit Trigger */}
        {isAdmin && !editing && (
          <button
            id="member-edit-trigger"
            onClick={startEdit}
            className="absolute top-6 right-6 flex items-center gap-1.5 py-1.5 px-3 rounded bg-sky-950 border border-sky-500/50 hover:bg-sky-900 text-sky-300 hover:text-sky-200 transition-all font-mono text-xs"
          >
            <Edit className="w-3.5 h-3.5" /> EDIT MEMBER
          </button>
        )}

        {editing && editForm ? (
          // INTERACTIVE MEMBER EDIT FORM
          <div className="space-y-4 text-left z-10">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <span className="text-2xl">{editForm.photo}</span>
              <div>
                <span className="font-mono text-xs text-sky-400 font-semibold uppercase">ACTIVE MANAGEMENT WORKSPACE</span>
                <h4 className="text-white font-sans text-lg font-bold">Modifying Portfolio Node</h4>
              </div>
            </div>

            {/* Inputs Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-mono text-xs mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 focus:border-sky-500 rounded px-3 py-1.5 font-sans text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-xs mb-1">Professional Role</label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 focus:border-sky-500 rounded px-3 py-1.5 font-sans text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-xs mb-1">Academic Status / Affiliation</label>
                <input
                  type="text"
                  value={editForm.academic}
                  onChange={(e) => updateField("academic", e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 focus:border-sky-500 rounded px-3 py-1.5 font-sans text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-xs mb-1">Academy Enrollment Key/Roll</label>
                <input
                  type="text"
                  value={editForm.rollNo || ""}
                  onChange={(e) => updateField("rollNo", e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 focus:border-sky-500 rounded px-3 py-1.5 font-sans text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-xs mb-1">Primary Skill Specialization Focus</label>
                <input
                  type="text"
                  value={editForm.specialty}
                  onChange={(e) => updateField("specialty", e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 focus:border-sky-500 rounded px-3 py-1.5 font-sans text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-xs mb-1">Location Identifier</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 focus:border-sky-500 rounded px-3 py-1.5 font-sans text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-xs mb-1">Biography / Creative Vision</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                rows={2}
                className="w-full bg-slate-950/90 border border-slate-800 focus:border-sky-500 rounded px-3 py-1.5 font-sans text-sm text-white focus:outline-none"
              />
            </div>

            {/* Skills Administration segment */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-slate-300 font-mono text-xs uppercase font-semibold tracking-wider">Configure Skill Benchmarks</label>
                <button
                  type="button"
                  onClick={addSkill}
                  className="flex items-center gap-1 text-[10px] font-mono text-sky-400 hover:text-sky-300 bg-sky-950/50 border border-sky-900 rounded px-2 py-0.5"
                >
                  <Plus className="w-3 h-3" /> ADD SKILL
                </button>
              </div>

              <div className="max-h-44 overflow-y-auto space-y-2 pr-1 border border-slate-800 bg-slate-950/50 p-3 rounded">
                {editForm.skills.map((skill, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 items-center bg-slate-900 border border-slate-800/80 p-2 rounded">
                    <input
                      type="text"
                      value={skill.name}
                      placeholder="Skill name"
                      onChange={(e) => handleSkillChange(idx, "name", e.target.value)}
                      className="w-full sm:w-2/5 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-white"
                    />
                    
                    <select
                      value={skill.category}
                      onChange={(e) => handleSkillChange(idx, "category", e.target.value as any)}
                      className="w-full sm:w-1/4 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[11px] text-slate-300"
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Specialty">Specialty</option>
                      <option value="Tools">Tools</option>
                    </select>

                    <div className="flex items-center gap-2 w-full sm:w-1/3 justify-end">
                      <span className="text-[10px] font-mono text-slate-400">{skill.level}%</span>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={skill.level}
                        onChange={(e) => handleSkillChange(idx, "level", parseInt(e.target.value))}
                        className="w-20 accent-sky-500 h-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeSkill(idx)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950 border border-transparent hover:border-red-900 p-0.5 rounded transition-all"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Triggers */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="py-1.5 px-4 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs font-mono"
              >
                DISCARD CHANGES
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1 py-1.5 px-4 rounded bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-white text-xs font-mono font-semibold hover:shadow-lg hover:shadow-emerald-600/10 active:scale-95"
              >
                <Save className="w-3.5 h-3.5" /> DEPLOY TO DATABASE
              </button>
            </div>
          </div>
        ) : (
          // VISUAL PORTFOLIO PROFILES (READ-ONLY)
          <div className="space-y-6 text-left z-10 flex-1 flex flex-col justify-between">
            <div>
              {/* Profile Bio Section */}
              <div className="border-b border-slate-800/80 pb-4">
                <span className="font-mono text-xs tracking-wider text-sky-400 font-semibold uppercase">SOFTWARE FARM ASSOCIATE PROFILE</span>
                <h2 className="text-xl md:text-3xl font-sans font-bold text-white tracking-tight mt-1 flex items-center gap-2">
                  {activeMember.name} 
                  {activeMember.id === "jamil_sagor" && <Award className="w-5 h-5 text-amber-500 inline fill-amber-500/20" />}
                </h2>
                <p className="font-mono text-xs md:text-sm text-indigo-300 mt-1 font-semibold flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" /> {activeMember.specialty}
                </p>
              </div>

              {/* Stats segments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-indigo-400" /> Academic Credentials
                  </span>
                  <p className="text-white text-xs mt-1.5 leading-relaxed font-sans font-medium">{activeMember.academic}</p>
                  {activeMember.rollNo && (
                    <p className="text-indigo-300 font-mono text-[11px] mt-1">Roll / Identifier ID: <span className="text-emerald-400 font-bold">{activeMember.rollNo}</span></p>
                  )}
                </div>

                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" /> Base Station
                  </span>
                  <p className="text-white text-xs mt-1.5 font-sans font-medium">{activeMember.location}</p>
                  <p className="text-slate-400 font-mono text-[11px] mt-1">Timezone Coordinates: +6:00 GMT</p>
                </div>
              </div>

              {/* Bio Block Quote */}
              <div className="bg-gradient-to-r from-sky-950/30 to-indigo-900/10 border-l-2 border-sky-400/60 p-4 rounded-r-lg my-4 italic text-sm text-slate-300 leading-relaxed font-sans">
                "{activeMember.bio}"
              </div>

              {/* Dynamically Segmented Tech Stack Grid */}
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-200 mb-3 flex items-center gap-1">
                  <Code className="w-4 h-4 text-sky-400" /> Technical Skill Spectrum
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5 max-h-52 overflow-y-auto pr-1">
                  {/* Categorize skills */}
                  {["Frontend", "Backend", "Specialty", "Tools"].map((category) => {
                    const categorizedSkills = activeMember.skills.filter(s => s.category === category);
                    if (categorizedSkills.length === 0) return null;

                    return (
                      <div key={category} className="bg-slate-950/20 p-2.5 rounded border border-slate-800/30">
                        <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider bg-slate-900 px-2 py-0.5 rounded border border-slate-800/60">{category}</span>
                        <div className="space-y-2.5 mt-2">
                          {categorizedSkills.map((skill, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-xs font-mono">
                                <span className="text-slate-300 font-medium">{skill.name}</span>
                                <span className="text-indigo-400 font-semibold">{skill.level}%</span>
                              </div>
                              {/* 3D themed visual loading bar */}
                              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/40">
                                <div
                                  style={{ width: `${skill.level}%` }}
                                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)] transition-all duration-1000"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom info banner */}
            <div className="border-t border-slate-800/60 pt-4 mt-4 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>ACTIVE WORK SYSTEM IDENTIFIER: #{activeMember.id.toUpperCase()}</span>
              {isAdmin && <span className="text-sky-400 animate-pulse uppercase tracking-widest font-semibold">&bull; ADMIN LINKED</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
