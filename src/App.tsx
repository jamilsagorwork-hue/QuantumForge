import React, { useState, useEffect } from "react";
import { TeamMember, ClientRequest, Project } from "./types";
import ThreeDMatrixBackground from "./components/ThreeDMatrixBackground";
import TeamCarousel from "./components/TeamCarousel";
import ProjectShowroom from "./components/ProjectShowroom";
import ClientRequestSuite from "./components/ClientRequestSuite";
import AdminPanel from "./components/AdminPanel";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Briefcase, FileSignature, Shield, Terminal, MessageSquare, ExternalLink, Cpu, Info, RefreshCw } from "lucide-react";

export default function App() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<"workspace" | "previous_work" | "commission" | "admin">("workspace");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState("");

  // Sync state data on load
  const fetchData = async () => {
    try {
      setLoading(true);
      const mRes = await fetch("/api/members");
      const membersData = await mRes.json();
      setMembers(membersData);

      const rRes = await fetch("/api/requests");
      const requestsData = await rRes.json();
      setRequests(requestsData);

      const pRes = await fetch("/api/projects");
      const projectsData = await pRes.json();
      setProjects(projectsData);

      setErrorStatus("");
    } catch (err) {
      console.error("Data syncing error:", err);
      setErrorStatus("Could not establish bi-directional sync connection with QuantumForge server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // API wrappers to coordinate server writes
  const handleUpdateMember = async (updatedMember: TeamMember): Promise<boolean> => {
    try {
      const res = await fetch(`/api/members/${updatedMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMember),
      });
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error writing member profile:", err);
      return false;
    }
  };

  const handleCreateRequest = async (draftRequest: Partial<ClientRequest>): Promise<boolean> => {
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftRequest),
      });
      if (res.ok) {
        const result = await res.json();
        setRequests((prev) => [result.request, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error posting order request:", err);
      return false;
    }
  };

  const handleUpdateRequest = async (id: string, updatedData: Partial<ClientRequest>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const result = await res.json();
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? result.request : r))
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error editing request archive:", err);
      return false;
    }
  };

  const handleDeleteRequest = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error flushing request catalog:", err);
      return false;
    }
  };

  // Live dynamic project adapters
  const handleCreateProject = async (draftProject: Partial<Project>): Promise<boolean> => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftProject),
      });
      if (res.ok) {
        const result = await res.json();
        setProjects((prev) => [result.project, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error creating project:", err);
      return false;
    }
  };

  const handleUpdateProject = async (id: string, updatedData: Partial<Project>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const result = await res.json();
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? result.project : p))
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating project details:", err);
      return false;
    }
  };

  const handleDeleteProject = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error deleting project:", err);
      return false;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* 3D background matrices */}
      <ThreeDMatrixBackground />

      {/* Decorative upper ambient lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[350px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Professional Portal Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/80 py-4 px-6 shadow-md shadow-slate-950/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Farm logo node */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-slate-950 font-extrabold text-lg shadow-lg shadow-sky-500/20 animate-pulse">
              QF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans font-black tracking-tight text-white text-base">QuantumForge</h1>
                <span className="text-[10px] bg-indigo-950/80 text-indigo-300 font-mono border border-indigo-900 py-0.5 px-2 rounded-full font-bold uppercase tracking-wider">SOFTWARE FARM</span>
              </div>
              <p className="font-mono text-[9px] text-slate-400 mt-0.5 uppercase tracking-widest leading-none">CSE HIGH-PERFORMANCE WORK SYSTEMS</p>
            </div>
          </div>

          {/* Navigation Matrix Tabs */}
          <nav className="flex flex-wrap items-center justify-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              id="workspace-tab-trigger"
              onClick={() => setActiveTab("workspace")}
              className={`py-1.5 px-2 sm:px-3 rounded-lg font-mono text-[10px] sm:text-[11px] font-semibold transition-all flex items-center gap-1 sm:gap-1.5 uppercase tracking-wider ${
                activeTab === "workspace"
                  ? "bg-slate-950 text-sky-400 border border-slate-800/80 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>
                <span className="hidden sm:inline">Workspace Nodes</span>
                <span className="inline sm:hidden">Workspace</span>
              </span>
            </button>

            <button
              id="previous-work-tab-trigger"
              onClick={() => setActiveTab("previous_work")}
              className={`py-1.5 px-2 sm:px-3 rounded-lg font-mono text-[10px] sm:text-[11px] font-semibold transition-all flex items-center gap-1 sm:gap-1.5 uppercase tracking-wider ${
                activeTab === "previous_work"
                  ? "bg-slate-950 text-indigo-400 border border-slate-800/80 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>
                <span className="hidden sm:inline">Best work</span>
                <span className="inline sm:hidden">Work</span>
              </span>
            </button>

            <button
              id="client-portal-tab-trigger"
              onClick={() => setActiveTab("commission")}
              className={`py-1.5 px-2 sm:px-3 rounded-lg font-mono text-[10px] sm:text-[11px] font-semibold transition-all flex items-center gap-1 sm:gap-1.5 uppercase tracking-wider ${
                activeTab === "commission"
                  ? "bg-slate-950 text-emerald-400 border border-slate-800/80 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileSignature className="w-3.5 h-3.5" />
              <span>
                <span className="hidden sm:inline">Order Commission</span>
                <span className="inline sm:hidden">Order</span>
              </span>
            </button>

            <button
              id="admin-dashboard-tab-trigger"
              onClick={() => setActiveTab("admin")}
              className={`py-1.5 px-2 sm:px-3.5 rounded-lg font-mono text-[10px] sm:text-[11px] font-semibold transition-all flex items-center gap-1 sm:gap-1.5 uppercase tracking-wider relative ${
                activeTab === "admin"
                  ? "bg-slate-950 text-rose-400 border border-slate-800/80 shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>
                <span className="hidden sm:inline">Management Panel</span>
                <span className="inline sm:hidden">Admin</span>
              </span>
              {requests.filter(r => r.status === "pending").length > 0 && (
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Alert banner for disconnection */}
      {errorStatus && (
        <div className="bg-rose-950/30 border-b border-rose-900 text-rose-300 text-xs font-mono py-2 px-6 flex items-center justify-between z-10">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            {errorStatus}
          </span>
          <button
            onClick={fetchData}
            className="underline hover:text-rose-100 flex items-center gap-1 bg-slate-950/40 px-2 py-0.5 rounded border border-rose-900/40 text-[10px]"
          >
            <RefreshCw className="w-3 h-3" /> RESTORE PIPELINE
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 z-10">
        
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 text-slate-400">
            <Cpu className="animate-spin w-8 h-8 text-sky-400 mb-3" />
            <p className="font-mono text-xs tracking-widest uppercase">INITIALIZING SYSTEMS PARITY MATRIX...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              
              {/* Tab 1: COMPASS / CORE TEAM SPACE */}
              {activeTab === "workspace" && (
                <div className="space-y-6">
                  {/* Headline introduction */}
                  <div className="text-left max-w-4xl">
                    <span className="font-mono text-xs tracking-widest text-sky-400 font-extrabold uppercase bg-sky-950/35 border border-sky-900/60 px-3 py-1 rounded-full inline-block">
                      QuantumForge Workspace
                    </span>
                    <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tight text-white mt-3">
                      High-Capacity Custom App Development & Bespoke AI Automations
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base font-sans mt-3 leading-relaxed">
                      QuantumForge is a collaborative hub of 4 specialized developers spanning frontend dynamic visual matrices, distributed low-latency database orchestration, and deep intelligent LLM setups. We engineer pristine digital products crafted in pure, responsive code.
                    </p>
                  </div>

                  {/* High Quality Interactive 3D Orbiting core */}
                  <TeamCarousel
                    members={members}
                    onUpdateMember={handleUpdateMember}
                    isAdmin={isAdminLoggedIn}
                  />
                </div>
              )}

              {/* Tab 2: PROJECTS / EXPERIENCE MATRIX */}
              {activeTab === "previous_work" && (
                <div className="space-y-6">
                  {/* Headline introduction */}
                  <div className="text-left max-w-4xl">
                    <span className="font-mono text-xs tracking-widest text-indigo-400 font-extrabold uppercase bg-indigo-950/35 border border-indigo-900/60 px-3 py-1 rounded-full inline-block">
                      Completed System Deliveries
                    </span>
                    <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tight text-white mt-3">
                      Best Work & Previous Success Specifications
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base font-sans mt-3 leading-relaxed">
                      QuantumForge delivers exceptional software packages with strict testing matrices. Every system listed below represents a fully customized build tailored for specific user pathways, leveraging modern high-concurrency protocols.
                    </p>
                  </div>

                  <ProjectShowroom projects={projects} />
                </div>
              )}

              {/* Tab 3: CLIENT PLACEMENT GATEWAY / CONSULTING */}
              {activeTab === "commission" && (
                <div className="space-y-6">
                  <div className="text-left max-w-4xl">
                    <span className="font-mono text-xs tracking-widest text-emerald-400 font-extrabold uppercase bg-emerald-905/35 border border-emerald-900/60 px-3 py-1 rounded-full inline-block">
                      System Commission Portal
                    </span>
                    <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tight text-white mt-3">
                      Scope Your Project live with QuantumForge AI Advisor
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base font-sans mt-3 leading-relaxed">
                      Interact with our state-of-the-art server evaluation model to budget and draft features, or submit an official order details sheet straight to our development queue. Jamil and team will deploy to your staging environment promptly.
                    </p>
                  </div>

                  <ClientRequestSuite onSubmitRequest={handleCreateRequest} />
                </div>
              )}

              {/* Tab 4: ADMIN CONTROLS GATEWAY */}
              {activeTab === "admin" && (
                <AdminPanel
                  requests={requests}
                  projects={projects}
                  members={members}
                  onUpdateRequest={handleUpdateRequest}
                  onDeleteRequest={handleDeleteRequest}
                  onCreateProject={handleCreateProject}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                  onUpdateMember={handleUpdateMember}
                  onLoginStatusChange={(isLogged) => setIsAdminLoggedIn(isLogged)}
                  isLoggedIn={isAdminLoggedIn}
                />
              )}

            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Footer System Credits */}
      <footer className="z-10 py-8 px-6 bg-slate-950/50 border-t border-slate-900 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>&copy; {new Date().getFullYear()} QuantumForge Software Farm. All rights scheduled.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Lead coordinator: Jamil Ahmed Sagor (BUBT Roll 22234103270)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
