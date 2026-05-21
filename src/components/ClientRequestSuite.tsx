import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ClientRequest } from "../types";
import { Send, Cpu, Calendar, DollarSign, User, Mail, Sparkles, Code, CheckCircle, Loader2 } from "lucide-react";

interface ClientRequestSuiteProps {
  onSubmitRequest: (req: Partial<ClientRequest>) => Promise<boolean>;
}

export default function ClientRequestSuite({ onSubmitRequest }: ClientRequestSuiteProps) {
  // Form State
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectType, setProjectType] = useState<any>("ai_automation");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("1500 - 3000 USD");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "🤖 **Greetings!** I am the QuantumForge Intelligent Automation Consultant. \n\nWhat kind of digital system are you scoping? Tell me about your requirements, target user bases, or workflow bottlenecks, and I will outline an architectural breakdown, suggest our specialized team roles, and draft a practical budget range.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiThinking]);

  // Handle Order Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !description) return;

    setSubmittingForm(true);
    const success = await onSubmitRequest({
      clientName,
      clientEmail,
      projectType,
      description,
      budget
    });
    setSubmittingForm(false);

    if (success) {
      setFormSubmitted(true);
      // Automatically post context into AI Chat as well so the assistant greets!
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `🎉 **Order Request Registered Successfully!** \n\n*Thank you, ${clientName}. Our lead system architect **Jamil Ahmed Sagor** has received your request regarding a customized **${projectType.replace("_", " ")}** system. We will contact you immediately at **${clientEmail}**.*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Handle AI Chat Submit
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || aiThinking) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setAiThinking(true);

    try {
      const response = await fetch("/api/estimator-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.text || "I was unable to complete the system evaluation. Please verify server connectivity.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch (err) {
      console.error("AI estimation error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "🤖 **[Connection Alert]** The QuantumForge AI model server is operating locally or key is configuring. Our design team of 4 is standing by at standard rates. Please submit the digital quote form directly!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setAiThinking(false);
    }
  };

  return (
    <div id="request-forms-portal" className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 max-w-7xl mx-auto text-left relative items-stretch">
      
      {/* 1. Immersive AI Scoper / Estimatation Chat (Left Box) */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden min-h-[500px]">
        {/* Decorative backdrop glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(129,140,248,0.06),transparent_40%)] pointer-events-none" />
        
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between z-10">
          <div>
            <span className="font-mono text-xs text-sky-400 font-semibold uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400 animate-pulse" /> AUTOMATION EXPERT ENGINE
            </span>
            <h3 className="font-sans font-bold text-white text-lg">AI Project Scoper & Estimator</h3>
          </div>
          <div className="p-1 rounded bg-slate-950 font-mono text-[9px] text-emerald-400 border border-slate-800 flex items-center gap-1 font-semibold uppercase">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Gemini 3.5 Active
          </div>
        </div>

        {/* Conversation Body Logs */}
        <div className="flex-1 overflow-y-auto max-h-[360px] my-4 p-4 space-y-4 bg-slate-950/40 border border-slate-800/80 rounded-xl scrollbar-thin z-10">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col max-w-[85%] ${
                msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl text-xs md:text-sm font-sans leading-relaxed text-left whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-sky-600 to-indigo-650 text-white rounded-br-none shadow-md shadow-sky-500/10"
                    : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none card shadow-lg"
                }`}
              >
                {msg.text}
              </div>
              <span className="font-mono text-[9px] text-slate-500 mt-1 uppercase px-1">{msg.timestamp}</span>
            </div>
          ))}

          {aiThinking && (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 italic bg-slate-900/50 border border-slate-800 p-3 rounded-xl max-w-[50%]">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
              <span>AI Specialist is calculating scope...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat input form */}
        <form onSubmit={handleChatSubmit} className="flex gap-2.5 z-10">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={aiThinking}
            placeholder="Type features / requirements (e.g. e-commerce with Stripe or PDF audit pipeline...)"
            className="flex-1 bg-slate-950/90 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2 font-sans text-xs md:text-sm text-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={aiThinking || !chatInput.trim()}
            className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 border border-sky-450 text-slate-950 disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 2. Standard Client Request Formulation Node (Right Box) */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl relative flex flex-col justify-between overflow-hidden">
        {/* Decorative backdrop glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_100%,rgba(99,102,241,0.06),transparent_40%)] pointer-events-none" />

        <div className="border-b border-slate-800 pb-3 flex items-center justify-between z-10">
          <div>
            <span className="font-mono text-xs text-indigo-400 font-semibold uppercase flex items-center gap-1">
              <Code className="w-3 h-3 text-indigo-300" /> CORRESPONDENCE REGISTER
            </span>
            <h3 className="font-sans font-bold text-white text-lg">Initiate System Order Request</h3>
          </div>
        </div>

        {formSubmitted ? (
          // Success Response Screen
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10 space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-905/40 border border-emerald-500 flex items-center justify-center text-3xl animate-bounce">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="font-sans font-extrabold text-white text-lg">Bespoke System Task Initiated!</h4>
            <p className="text-slate-300 text-sm max-w-sm font-sans">
              Our automated system cataloged your project. Jamil Sagor will review the architectural guidelines and get back to you inside 12 hours.
            </p>
            <button
              onClick={() => {
                setFormSubmitted(false);
                setClientName("");
                setClientEmail("");
                setDescription("");
              }}
              className="py-1.5 px-4 font-mono text-xs bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded hover:bg-slate-900"
            >
              SUBMIT ANOTHER QUOTE
            </button>
          </div>
        ) : (
          // System Input Form
          <form onSubmit={handleFormSubmit} className="space-y-4 z-10 mt-4 text-left flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-mono text-xs mb-1 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-400" /> Client Identifier / Name
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. John Doe / Tech Corp"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none rounded-lg px-3 py-1.5 font-sans text-xs md:text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-xs mb-1 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-rose-400" /> Correspondence Email
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none rounded-lg px-3 py-1.5 font-sans text-xs md:text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-mono text-xs mb-1 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Digital Architecture Focus
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none rounded-lg px-2.5 py-1.5 font-sans text-xs md:text-sm text-slate-300"
                  >
                    <option value="ecommerce">E-Commerce Web Portal</option>
                    <option value="portfolio">Professional Portfolio</option>
                    <option value="custom_app">Custom Web Software (SaaS)</option>
                    <option value="ai_automation">Bespoke AI Automation System</option>
                    <option value="other">Other High-performance integration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono text-xs mb-1 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-400" /> Proposed System Budget
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none rounded-lg px-2.5 py-1.5 font-sans text-xs md:text-sm text-slate-300"
                  >
                    <option value="1000 - 1500 USD">1,000 - 1,500 USD (Simple Node)</option>
                    <option value="1500 - 3000 USD">1,500 - 3,000 USD (Standard Team)</option>
                    <option value="3000 - 6000 USD">3,000 - 6,000 USD (Enterprise System)</option>
                    <option value="6000+ USD">6,000+ USD (Adv. Custom Automation / WebGL)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-xs mb-1 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-indigo-300" /> Detailed Scope description
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline feature specs, target audience, integration requirements, database needs..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 focus:outline-none rounded-lg p-3 font-sans text-xs md:text-sm text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submittingForm}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              {submittingForm ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  PULSING DATA GRID...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" /> COMMISSION AUTOMATION TASK
                </>
              )}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
