import React, { useState } from "react";
import { ClientRequest, Project, TeamMember, Skill } from "../types";
import { Shield, Eye, Trash2, CheckSquare, Clock, RefreshCw, AlertCircle, FileText, CheckCircle, HelpCircle, Save, LogOut, Plus, Edit3, Settings, AlertTriangle, Sparkles, FolderPlus, ListCollapse, Undo2, Users, Award, Hammer } from "lucide-react";

interface AdminPanelProps {
  requests: ClientRequest[];
  projects: Project[];
  members: TeamMember[];
  onUpdateRequest: (id: string, updatedData: Partial<ClientRequest>) => Promise<boolean>;
  onDeleteRequest: (id: string) => Promise<boolean>;
  onCreateProject: (draft: Partial<Project>) => Promise<boolean>;
  onUpdateProject: (id: string, updatedData: Partial<Project>) => Promise<boolean>;
  onDeleteProject: (id: string) => Promise<boolean>;
  onUpdateMember: (updatedMember: TeamMember) => Promise<boolean>;
  onLoginStatusChange: (isLoggedIn: boolean) => void;
  isLoggedIn: boolean;
}

export default function AdminPanel({
  requests,
  projects = [],
  members = [],
  onUpdateRequest,
  onDeleteRequest,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onUpdateMember,
  onLoginStatusChange,
  isLoggedIn
}: AdminPanelProps) {
  const [accessCode, setAccessCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  // Team Member Editing states
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberErrorMsg, setMemberErrorMsg] = useState("");
  const [memberSuccessMsg, setMemberSuccessMsg] = useState("");

  // Add Project Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"E-Commerce" | "Creative Portfolios" | "Custom Web Apps" | "AI Automation Systems">("Custom Web Apps");
  const [newDescription, setNewDescription] = useState("");
  const [newMetrics, setNewMetrics] = useState("");
  const [newRoleAssigned, setNewRoleAssigned] = useState("");
  const [newTechStack, setNewTechStack] = useState("");
  const [newFeatures, setNewFeatures] = useState("");
  const [newDemoSlug, setNewDemoSlug] = useState("");
  const [projectError, setProjectError] = useState("");
  const [projectSuccessMsg, setProjectSuccessMsg] = useState("");

  // Edit Project State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<"E-Commerce" | "Creative Portfolios" | "Custom Web Apps" | "AI Automation Systems">("Custom Web Apps");
  const [editDescription, setEditDescription] = useState("");
  const [editMetrics, setEditMetrics] = useState("");
  const [editRoleAssigned, setEditRoleAssigned] = useState("");
  const [editTechStack, setEditTechStack] = useState("");
  const [editFeatures, setEditFeatures] = useState("");
  const [editDemoSlug, setEditDemoSlug] = useState("");
  const [editError, setEditError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate roll matching Jamil Sagor or master admin key
    if (accessCode.trim() === "22234103270" || accessCode.trim().toLowerCase() === "admin") {
      onLoginStatusChange(true);
      setErrorMsg("");
    } else {
      setErrorMsg("INVALID CSE AUTHORIZATION TOKEN. HINT: Try Jamil's Roll (22234103270) or 'admin'.");
    }
  };

  const handleLogout = () => {
    onLoginStatusChange(false);
    setAccessCode("");
  };

  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectError("");
    setProjectSuccessMsg("");

    if (!newTitle.trim() || !newDescription.trim() || !newRoleAssigned.trim() || !newMetrics.trim()) {
      setProjectError("Please complete all required fields (Title, Description, Lead Role, Metrics).");
      return;
    }

    const techArray = newTechStack
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const featArray = newFeatures
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const draft: Partial<Project> = {
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      metrics: newMetrics.trim(),
      roleAssigned: newRoleAssigned.trim(),
      techStack: techArray,
      features: featArray,
      demoSlug: newDemoSlug.trim() || "custom-spec",
    };

    const success = await onCreateProject(draft);
    if (success) {
      setNewTitle("");
      setNewDescription("");
      setNewMetrics("");
      setNewRoleAssigned("");
      setNewTechStack("");
      setNewFeatures("");
      setNewDemoSlug("");
      setProjectSuccessMsg("SHOWCASE PROJECT ADDED SUCCESSFULLY!");
    } else {
      setProjectError("Could not save project to core database server.");
    }
  };

  const handleStartEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setEditTitle(p.title);
    setEditCategory(p.category);
    setEditDescription(p.description);
    setEditMetrics(p.metrics);
    setEditRoleAssigned(p.roleAssigned);
    setEditTechStack(p.techStack.join(", "));
    setEditFeatures(p.features.join(", "));
    setEditDemoSlug(p.demoSlug);
    setEditError("");
  };

  const handleUpdateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError("");

    if (!editTitle.trim() || !editDescription.trim() || !editRoleAssigned.trim() || !editMetrics.trim()) {
      setEditError("Fields cannot be empty.");
      return;
    }

    const techArray = editTechStack
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const featArray = editFeatures
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const updatedData: Partial<Project> = {
      title: editTitle.trim(),
      category: editCategory,
      description: editDescription.trim(),
      metrics: editMetrics.trim(),
      roleAssigned: editRoleAssigned.trim(),
      techStack: techArray,
      features: featArray,
      demoSlug: editDemoSlug.trim() || "custom-spec",
    };

    if (editingProjectId) {
      const success = await onUpdateProject(editingProjectId, updatedData);
      if (success) {
        setEditingProjectId(null);
      } else {
        setEditError("Could not save modifications.");
      }
    }
  };

  // Core Foundation profile handlers
  const handleStartEditMember = (m: TeamMember) => {
    setEditingMember(JSON.parse(JSON.stringify(m))); // Deep clone
    setMemberErrorMsg("");
    setMemberSuccessMsg("");
    // scroll form to viewport smoothly
    setTimeout(() => {
      document.getElementById("admin-member-form-anchor")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleUpdateMemberField = (field: keyof TeamMember, value: any) => {
    if (!editingMember) return;
    setEditingMember({ ...editingMember, [field]: value });
  };

  const handleUpdateMemberSkill = (idx: number, prop: keyof Skill, value: any) => {
    if (!editingMember) return;
    const skills = [...editingMember.skills];
    skills[idx] = { ...skills[idx], [prop]: value };
    setEditingMember({ ...editingMember, skills });
  };

  const handleAddMemberSkill = () => {
    if (!editingMember) return;
    const newSkill: Skill = { name: "New Core Capability", level: 90, category: "Specialty" };
    setEditingMember({ ...editingMember, skills: [...editingMember.skills, newSkill] });
  };

  const handleRemoveMemberSkill = (idx: number) => {
    if (!editingMember) return;
    setEditingMember({
      ...editingMember,
      skills: editingMember.skills.filter((_, i) => i !== idx)
    });
  };

  const handleSaveMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberErrorMsg("");
    setMemberSuccessMsg("");
    if (!editingMember) return;

    if (!editingMember.name.trim() || !editingMember.role.trim() || !editingMember.specialty.trim() || !editingMember.academic.trim()) {
      setMemberErrorMsg("Core fields (Name, Role, Specialty, Academic Context) cannot be blank.");
      return;
    }

    const success = await onUpdateMember(editingMember);
    if (success) {
      setMemberSuccessMsg("FOUNDATION CORE MEMBER PROFILE UPDATED SUCCESSFULLY!");
      // Reset edit display after a small aesthetic interval
      setTimeout(() => {
        setMemberSuccessMsg("");
      }, 3500);
    } else {
      setMemberErrorMsg("Error communicating member profile update with backend.");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: any) => {
    await onUpdateRequest(id, { status: newStatus });
  };

  const startEditingNotes = (req: ClientRequest) => {
    setEditingNotesId(req.id);
    setTempNotes(req.internalNotes || "");
  };

  const handleSaveNotes = async (id: string) => {
    const success = await onUpdateRequest(id, { internalNotes: tempNotes });
    if (success) {
      setEditingNotesId(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-950/40 text-amber-300 border-amber-900/60";
      case "reviewing":
        return "bg-sky-950/40 text-sky-400 border-sky-900/60";
      case "accepted":
        return "bg-emerald-950/40 text-emerald-400 border-emerald-900/60";
      case "completed":
        return "bg-indigo-950/40 text-indigo-300 border-indigo-900/60";
      default:
        return "bg-slate-950 text-slate-400 border-slate-800";
    }
  };

  const getProjectTypeLabel = (type: string) => {
    switch (type) {
      case "ecommerce": return "E-Commerce";
      case "portfolio": return "Portfolio";
      case "custom_app": return "Custom Web App";
      case "ai_automation": return "AI Automation System";
      default: return "Other System";
    }
  };

  if (!isLoggedIn) {
    return (
      <div id="admin-login-shield" className="max-w-md mx-auto py-12 px-6 bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl relative text-left">
        <div className="absolute inset-x-0 h-1 top-0 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-t-2xl" />
        
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-sky-400 animate-pulse" />
          <span className="font-mono text-xs tracking-wider text-slate-400 font-bold uppercase">SECURED MANAGEMENT CONSOLE</span>
        </div>

        <h3 className="font-sans font-bold text-white text-xl">QuantumForge Admin Access</h3>
        <p className="text-sm text-slate-400 font-sans mt-1 leading-relaxed">
          Provide authorization credentials to alter core member bios, skillset levels, database configurations, and request pipelines.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1.5">Authorization Code Roll</label>
            <input
              type="password"
              placeholder="Enter roll number (e.g. 22234103270)"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-lg px-3.5 py-2 font-sans text-sm text-white"
            />
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded bg-red-950/30 border border-red-900 text-red-300 text-xs font-mono leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 font-mono text-xs font-bold text-slate-950 uppercase tracking-wider transition-all hover:shadow-cyan-500/10 active:scale-[0.98]"
          >
            VERIFY AUTHKERNEL ENROLLMENT
          </button>
        </form>
      </div>
    );
  }

  return (
    <div id="admin-workspace-pane" className="space-y-6 pt-4 max-w-7xl mx-auto px-1 text-left relative">
      
      {/* Workspace Header Dashboard */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
            <span className="font-mono text-xs tracking-wider text-emerald-400 font-extrabold uppercase">QUANTUMFORGE REGISTRY NODE ONLINE</span>
          </div>
          <h2 className="text-xl md:text-3xl font-sans font-bold text-white tracking-tight mt-1">Software System Management Console</h2>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 py-1.5 px-3.5 rounded bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 transition-all font-mono text-xs uppercase"
        >
          <LogOut className="w-3.5 h-3.5" /> REMOVE AUTHORIZATION
        </button>
      </div>

      {/* Grid of system status modules */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block">Operational Queue pool</span>
          <span className="font-sans font-bold text-2xl text-white mt-1.5 block">{requests.length} Requests</span>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl">
          <span className="font-mono text-[10px] text-indigo-400 uppercase tracking-widest block">Active Development Taskings</span>
          <span className="font-sans font-bold text-2xl text-indigo-300 mt-1.5 block">
            {requests.filter(r => r.status === "accepted" || r.status === "reviewing").length} Nodes
          </span>
        </div>
        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl">
          <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest block">Fulfillment Complete</span>
          <span className="font-sans font-bold text-2xl text-emerald-400 mt-1.5 block">
            {requests.filter(r => r.status === "completed").length} Deliveries
          </span>
        </div>
      </div>

      {/* Primary orders database list */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl p-6 relative">
        <h3 className="font-sans text-lg font-bold text-white border-b border-slate-800/80 pb-3 flex items-center gap-2">
          <span>Incoming Customer System Orders & Pipeline Queries</span>
        </h3>

        {requests.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-sm">
            NO COMMISSIONED REQUESTS FOUND IN DATABASE CACHE.
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {requests.map((req) => (
              <div
                key={req.id}
                id={`admin-request-${req.id}`}
                className="bg-slate-950/60 rounded-xl border border-slate-800/80 p-5 flex flex-col justify-between hover:border-slate-700 transition-all gap-4"
              >
                {/* ID Header area */}
                <div className="flex flex-wrap justify-between items-center gap-2.5 pb-2 border-b border-slate-900">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      ID: {req.id}
                    </span>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border uppercase font-medium tracking-wide ${getStatusBadgeClass(req.status)}`}>
                      &bull; {req.status}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    Timestamp: {new Date(req.timestamp).toLocaleString()}
                  </span>
                </div>

                {/* Body details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Client identity details */}
                  <div className="md:col-span-4 space-y-2.5 border-r border-slate-900/80 pr-4">
                    <div>
                      <span className="block text-[9px] uppercase font-mono text-slate-500 tracking-wider">Client Origin / Org</span>
                      <span className="block text-white text-sm font-sans font-semibold mt-0.5">{req.clientName}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-mono text-slate-500 tracking-wider">Contact Gateway</span>
                      <span className="block text-indigo-300 text-xs font-mono mt-0.5 hover:underline select-all">{req.clientEmail}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-mono text-slate-500 tracking-wider">Product Scope Focus</span>
                      <span className="block text-emerald-400 text-xs font-mono font-bold mt-0.5">
                        {getProjectTypeLabel(req.projectType)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-mono text-slate-500 tracking-wider">Target Budget Scale</span>
                      <span className="block text-slate-300 text-xs font-mono mt-0.5">{req.budget}</span>
                    </div>
                  </div>

                  {/* Requirements Details */}
                  <div className="md:col-span-8 flex flex-col justify-between items-stretch">
                    <div>
                      <span className="block text-[9px] uppercase font-mono text-slate-500 tracking-wider mb-1">Target Capabilities Required:</span>
                      <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-sans mt-0.5 bg-slate-900/30 p-2 border border-slate-900/50 rounded-lg">
                        {req.description}
                      </p>
                    </div>

                    {/* Developer notes coordination block */}
                    <div className="mt-3.5 bg-slate-905/30 border border-slate-800 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] uppercase font-mono font-bold text-sky-400 tracking-wider flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-sky-400" /> Farm Operational Updates & Logs
                        </span>
                        {editingNotesId !== req.id ? (
                          <button
                            type="button"
                            onClick={() => startEditingNotes(req)}
                            className="text-[10px] font-mono text-indigo-300 hover:text-white"
                          >
                            [ UPDATE DEV NOTES ]
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(req.id)}
                            className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                          >
                            <Save className="w-3 h-3" /> [ COMMIT LOG ]
                          </button>
                        )}
                      </div>

                      {editingNotesId === req.id ? (
                        <textarea
                          rows={1.5}
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded p-1.5 font-mono text-[11px] text-white focus:outline-none"
                        />
                      ) : (
                        <p className="font-mono text-[11px] text-slate-400 italic leading-relaxed">
                          {req.internalNotes || "Awaiting task-card setup assignment. Add developer comments..."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer status-changing handles and deletions */}
                <div className="mt-3 pt-3 border-t border-slate-900 flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[10px] text-slate-500 mr-2 uppercase">ALTER ARCHIVE STATUS:</span>
                    {["pending", "reviewing", "accepted", "completed"].map((stat) => (
                      <button
                        key={stat}
                        type="button"
                        onClick={() => handleStatusUpdate(req.id, stat as any)}
                        className={`text-[9px] font-mono py-1 px-2.5 rounded border uppercase font-medium transition-all ${
                          req.status === stat
                            ? "bg-slate-800 border-sky-400/80 text-sky-300 font-semibold"
                            : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {stat}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteRequest(req.id)}
                    className="flex items-center gap-1 text-[10px] font-mono py-1 px-3 rounded text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/60 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> ERASE ENTRY
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QuantumForge Core Foundation Registry Suite */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl p-6 relative">
        <div className="absolute inset-x-0 h-1 top-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 rounded-t-2xl" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" />
              <h3 className="font-sans text-lg font-bold text-white">QuantumForge Core Foundation Register</h3>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Review and configure active developer skill vectors, academic rolls, specialty focus, and bios supporting the live revolving 3D Hub.
            </p>
          </div>
          <span className="font-mono text-[10px] bg-slate-950 text-indigo-300 border border-slate-800 px-2.5 py-1 rounded font-bold uppercase tracking-wider">
            {members.length} FOUNDATION MEMBERS ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Members list (Left panel) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 font-bold">ACTIVE DIRECTORY</span>
            
            {members.map((m) => {
              const isActiveEditing = editingMember?.id === m.id;
              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    isActiveEditing 
                      ? "bg-slate-950 border-sky-500 shadow-lg shadow-sky-500/5"
                      : "bg-slate-950/60 border-slate-800/80 hover:border-slate-705 hover:bg-slate-950"
                  }`}
                >
                  <div className="flex gap-3.5 items-start">
                    {/* Avatar preview */}
                    <div className="w-11 h-11 shrink-0 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-xl select-none">
                      {m.photo}
                    </div>
                    {/* Details overview */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-sans font-bold text-sm text-white truncate">{m.name}</h4>
                      <p className="font-mono text-[10px] text-sky-400 uppercase tracking-wider mt-0.5 truncate">{m.role}</p>
                      
                      <div className="mt-1.5 space-y-0.5 font-mono text-[9px] text-slate-400 leading-tight">
                        <div><span className="text-slate-500">Academic:</span> {m.academic}</div>
                        {m.rollNo && <div><span className="text-slate-500">Roll No:</span> {m.rollNo}</div>}
                        <div><span className="text-slate-500">Specialty:</span> {m.specialty}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-900 flex justify-end animate-fade-in">
                    <button
                      type="button"
                      onClick={() => handleStartEditMember(m)}
                      className={`px-3 py-1 rounded font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                        isActiveEditing 
                          ? "bg-sky-500 text-slate-950 font-bold"
                          : "bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 text-slate-300"
                      }`}
                    >
                      <Edit3 className="w-3 h-3" /> Alter Bio & Skill Matrix
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Member Edit Form (Right panel) */}
          <div id="admin-member-form-anchor" className="lg:col-span-7 bg-slate-950/40 border border-slate-800 rounded-2xl p-5 relative min-h-[300px]">
            {editingMember ? (
              <form onSubmit={handleSaveMemberSubmit} className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl select-none">{editingMember.photo}</span>
                    <h4 className="font-sans font-extrabold text-sm text-white">
                      Edit Profile: <span className="text-sky-400 font-bold">{editingMember.name}</span>
                    </h4>
                  </div>
                  <span className="font-mono text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
                    ID: {editingMember.id}
                  </span>
                </div>

                {memberErrorMsg && (
                  <div className="p-3 rounded bg-red-955/35 border border-red-900 text-red-300 text-xs font-mono">
                    {memberErrorMsg}
                  </div>
                )}
                {memberSuccessMsg && (
                  <div className="p-3 rounded bg-emerald-955/20 border border-emerald-900 text-emerald-300 text-xs font-mono font-bold uppercase">
                    {memberSuccessMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      value={editingMember.name}
                      onChange={(e) => handleUpdateMemberField("name", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Professional Role Title *</label>
                    <input
                      type="text"
                      value={editingMember.role}
                      onChange={(e) => handleUpdateMemberField("role", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Academic Context *</label>
                    <input
                      type="text"
                      value={editingMember.academic}
                      onChange={(e) => handleUpdateMemberField("academic", e.target.value)}
                      placeholder="e.g. CSE Student at Bangladesh University of Business and Technology (BUBT)"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">BUBT Academic Roll ID</label>
                    <input
                      type="text"
                      value={editingMember.rollNo || ""}
                      onChange={(e) => handleUpdateMemberField("rollNo", e.target.value)}
                      placeholder="e.g. 22234103270"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Specialty Focus *</label>
                    <input
                      type="text"
                      value={editingMember.specialty}
                      onChange={(e) => handleUpdateMemberField("specialty", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Visual Emoji Photo *</label>
                    <input
                      type="text"
                      value={editingMember.photo}
                      onChange={(e) => handleUpdateMemberField("photo", e.target.value)}
                      placeholder="e.g. ⚡"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white text-center focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Physical Location Coordinates</label>
                  <input
                    type="text"
                    value={editingMember.location}
                    onChange={(e) => handleUpdateMemberField("location", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Foundational Biography Statement</label>
                  <textarea
                    rows={2.5}
                    value={editingMember.bio}
                    onChange={(e) => handleUpdateMemberField("bio", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none font-sans leading-relaxed"
                  />
                </div>

                {/* Sub-skill modifier elements grid */}
                <div className="border-t border-slate-900 pt-4 mt-2">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-indigo-400" /> Skill Percentages & Metrics
                    </span>
                    <button
                      type="button"
                      onClick={handleAddMemberSkill}
                      className="text-[9.5px] font-mono text-indigo-300 hover:text-white flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> [ Add Custom Skill ]
                    </button>
                  </div>

                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    {editingMember.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
                        {/* Skill Name */}
                        <div className="sm:col-span-4">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => handleUpdateMemberSkill(sIdx, "name", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 focus:border-cyan-500 rounded p-1 text-[11px] text-white focus:outline-none"
                          />
                        </div>

                        {/* Skill Category Selector */}
                        <div className="sm:col-span-3">
                          <select
                            value={skill.category}
                            onChange={(e) => handleUpdateMemberSkill(sIdx, "category", e.target.value as any)}
                            className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-slate-300 focus:outline-none"
                          >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Specialty">Specialty</option>
                            <option value="Tools">Tools</option>
                          </select>
                        </div>

                        {/* Level slider */}
                        <div className="sm:col-span-4 flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.level}
                            onChange={(e) => handleUpdateMemberSkill(sIdx, "level", parseInt(e.target.value))}
                            className="flex-1 accent-indigo-500 bg-slate-850 h-1.5 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className="font-mono text-[10.5px] text-slate-300 font-bold shrink-0 w-8 text-right">{skill.level}%</span>
                        </div>

                        {/* Delete Skill item */}
                        <div className="sm:col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveMemberSkill(sIdx)}
                            className="text-slate-500 hover:text-red-400 bg-slate-900 hover:bg-red-955/10 p-1 rounded border border-slate-850 hover:border-red-900/40 cursor-pointer"
                          >
                            <Trash2 className="w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2.5 pt-4 border-t border-slate-900">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 rounded bg-gradient-to-r from-cyan-500 to-indigo-600 font-mono text-xs font-bold text-slate-950 uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save biometric updates
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="py-2 px-4 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs uppercase hover:text-white transition-all cursor-pointer"
                  >
                    Abort
                  </button>
                </div>
              </form>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950/10 backdrop-blur-subtle">
                <Hammer className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
                <p className="font-mono text-xs text-slate-500 tracking-wider">
                  SELECT A MEMBER TO LIVE-MODIFY CORE ATTRIBUTES & BIOMETRICS
                </p>
                <p className="font-sans text-[10.5px] text-slate-600 max-w-sm mt-1">
                  Click the 'Alter Bio & Skill Matrix' button of Jamil, Mahim, Fahim, or Taskeen to fine-tune active specialties and rolls.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Dynamic Projects Showcase Management & Creation Node */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left column: Add/Edit Project form */}
        <div id="admin-project-form-container" className="lg:col-span-5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 flex flex-col justify-start relative shadow-2xl">
          <div className="absolute inset-x-0 h-1 top-0 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-t-2xl" />
          
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-sans font-bold text-white text-lg">
              {editingProjectId ? "Modify Experience Node" : "Register experience showpiece"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans leading-relaxed mb-6">
            {editingProjectId 
              ? "Modify current showcase metadata. Saved assets update instantly on the Best Work page."
              : "Expand QuantumForge's portfolio. Fill details to register custom delivered modules with structural metrics."
            }
          </p>

          {editingProjectId ? (
            /* Edit Project Form */
            <form onSubmit={handleUpdateProjectSubmit} className="space-y-4">
              {editError && (
                <div className="p-3.5 rounded bg-red-950/30 border border-red-900 text-red-300 text-xs font-mono">
                  {editError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Project Title *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Athena Multi-Tenant SaaS"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Focus Category *</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Creative Portfolios">Creative Portfolios</option>
                  <option value="Custom Web Apps">Custom Web Apps</option>
                  <option value="AI Automation Systems">AI Automation Systems</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">System Metrics Badge *</label>
                <input
                  type="text"
                  value={editMetrics}
                  onChange={(e) => setEditMetrics(e.target.value)}
                  placeholder="e.g. +45% Growth | Sub-1s Latency"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Lead Developer Assigned *</label>
                <input
                  type="text"
                  value={editRoleAssigned}
                  onChange={(e) => setEditRoleAssigned(e.target.value)}
                  placeholder="e.g. Systems Architect: Jamil Ahmed Sagor"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">System Capabilities Description *</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Detailed layout of server features, databases, and client deliverables..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Tech Stack Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editTechStack}
                  onChange={(e) => setEditTechStack(e.target.value)}
                  placeholder="React, Express, Redis, Go"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-indigo-300 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Architectural Features (comma-separated)</label>
                <input
                  type="text"
                  value={editFeatures}
                  onChange={(e) => setEditFeatures(e.target.value)}
                  placeholder="Implements Redis Cache, Multi-threaded indexing"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Demo Slug / Live URL</label>
                <input
                  type="text"
                  value={editDemoSlug}
                  onChange={(e) => setEditDemoSlug(e.target.value)}
                  placeholder="apex-cart-live"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  id="admin-project-save-btn"
                  className="flex-1 py-1.5 px-3 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Commit Modifications
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProjectId(null)}
                  className="py-1.5 px-3 rounded bg-slate-955 hover:bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" /> Abort
                </button>
              </div>
            </form>
          ) : (
            /* Add Project Form */
            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              {projectError && (
                <div className="p-3.5 rounded bg-red-955/30 border border-red-900 text-red-300 text-xs font-mono">
                  {projectError}
                </div>
              )}

              {projectSuccessMsg && (
                <div className="p-3 rounded bg-emerald-955/20 border border-emerald-900 text-emerald-300 text-xs font-mono font-bold uppercase">
                  {projectSuccessMsg}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Project Title *</label>
                <input
                  type="text"
                  id="admin-project-title-input"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Apex-Cart E-Commerce Platform"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Focus Category *</label>
                <select
                  id="admin-project-category-select"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Creative Portfolios">Creative Portfolios</option>
                  <option value="Custom Web Apps">Custom Web Apps</option>
                  <option value="AI Automation Systems">AI Automation Systems</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">System Metrics Badge *</label>
                <input
                  type="text"
                  id="admin-project-metrics-input"
                  value={newMetrics}
                  onChange={(e) => setNewMetrics(e.target.value)}
                  placeholder="e.g. +42% Conversion Rates | 1.1s Load"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Lead Developer Assigned *</label>
                <input
                  type="text"
                  id="admin-project-role-input"
                  value={newRoleAssigned}
                  onChange={(e) => setNewRoleAssigned(e.target.value)}
                  placeholder="e.g. Lead Developer: Jamil Ahmed Sagor"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">System Capabilities Description *</label>
                <textarea
                  id="admin-project-description-input"
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief summary of how the solution performs, backend scaling mechanics..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Tech Stack Tags (comma-separated)</label>
                <input
                  type="text"
                  id="admin-project-techstack-input"
                  value={newTechStack}
                  onChange={(e) => setNewTechStack(e.target.value)}
                  placeholder="Next.js, React, Tailwind, Three.js"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-indigo-300 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Architectural Features (comma-separated)</label>
                <input
                  type="text"
                  id="admin-project-features-input"
                  value={newFeatures}
                  onChange={(e) => setNewFeatures(e.target.value)}
                  placeholder="Dynamic WebGL orbital canvas, Redis cache invalidation"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Demo Slug / Live URL Token</label>
                <input
                  type="text"
                  id="admin-project-slug-input"
                  value={newDemoSlug}
                  onChange={(e) => setNewDemoSlug(e.target.value)}
                  placeholder="apex-cart-live"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                id="admin-project-create-btn"
                className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 font-mono text-xs font-bold text-slate-950 uppercase tracking-wider transition-all hover:shadow-cyan-500/10 flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" /> Deploy dynamically to Best Work
              </button>
            </form>
          )}
        </div>

        {/* Right column: showcase registry list */}
        <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 relative flex flex-col justify-between shadow-2xl">
          <div className="absolute inset-x-0 h-1 top-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-2xl" />
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <ListCollapse className="w-5 h-5 text-emerald-400" />
                <h3 className="font-sans font-bold text-white text-lg">Present Best Work Portfolio Registry</h3>
              </div>
              <span className="font-mono text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-950 px-2 py-0.5 rounded font-bold uppercase">
                {projects.length} Showcases Alive
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="py-24 text-center font-mono text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                SYSTEM PORTFOLIO ARRAY EMPTY, RE-INITIALIZE MANUALLY.
              </div>
            ) : (
              <div className="space-y-3 max-h-[660px] overflow-y-auto pr-2 custom-scrollbar">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    id={`admin-project-card-${proj.id}`}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-705 flex justify-between items-start gap-3 transition-all text-left"
                  >
                    <div className="space-y-1 text-left flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap text-left">
                        <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded text-indigo-300 bg-indigo-950/20 border border-indigo-900/40">{proj.category}</span>
                        <span className="text-[9.5px] font-mono text-emerald-400 font-medium">{proj.metrics}</span>
                      </div>
                      <h4 className="font-sans font-extrabold text-sm text-white mt-1.5 tracking-tight truncate">{proj.title}</h4>
                      <p className="font-sans text-slate-400 text-xs line-clamp-2 leading-relaxed font-normal">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {proj.techStack.map((tech) => (
                          <span key={tech} className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800/60">{tech}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0 ml-1.5 justify-start items-stretch">
                      <button
                        type="button"
                        id={`edit-project-btn-${proj.id}`}
                        onClick={() => handleStartEditProject(proj)}
                        className="py-1 px-2.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all font-mono text-[9px] uppercase flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        id={`delete-project-btn-${proj.id}`}
                        onClick={async () => {
                          if (window.confirm(`Confirm deletion: This project [${proj.title}] will be completely removed?`)) {
                            await onDeleteProject(proj.id);
                          }
                        }}
                        className="py-1 px-2.5 rounded bg-slate-900/60 border border-slate-800 hover:bg-red-950/30 hover:border-red-900/50 text-slate-500 hover:text-red-400 transition-all font-mono text-[9px] uppercase flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Erase
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Helpful Hint banner */}
      <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex gap-3 text-xs text-slate-400 font-mono leading-relaxed max-w-4xl">
        <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />
        <div>
          <p className="font-bold text-slate-300">ADMIN CONTROL CENTER UTILITY:</p>
          <p className="mt-0.5">Changes saved here are persistent in the backend database.json file. They will survive container dynamic redeployment state swaps.</p>
        </div>
      </div>

    </div>
  );
}
