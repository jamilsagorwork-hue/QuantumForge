import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "database.json");

app.use(express.json());

// Initialize default database if not exists
const defaultMembers = [
  {
    id: "jamil_sagor",
    name: "Jamil Ahmed Sagor",
    role: "Full Stack Developer",
    academic: "CSE Student at Bangladesh University of Business and Technology (BUBT)",
    rollNo: "22234103270",
    location: "Dhaka, Bangladesh",
    specialty: "Digital Product Architect & High-Performance Web Systems",
    photo: "⚡",
    bio: "Driven by a passion for creating seamless digital experiences. As a Computer Science student at BUBT, I bridge the gap between complex engineering and elegant design, transforming ideas into scalable cloud-native architectures.",
    skills: [
      { name: "React & Next.js", level: 95, category: "Frontend" },
      { name: "Tailwind CSS", level: 98, category: "Frontend" },
      { name: "Three.js & Canvas", level: 85, category: "Frontend" },
      { name: "Node.js & Express", level: 92, category: "Backend" },
      { name: "Firebase", level: 90, category: "Backend" },
      { name: "MongoDB", level: 88, category: "Backend" },
      { name: "Digital Products", level: 94, category: "Specialty" },
      { name: "UI/UX Architecture", level: 90, category: "Specialty" },
      { name: "Secure Systems", level: 87, category: "Specialty" },
      { name: "Docker & Linux", level: 80, category: "Tools" },
      { name: "Git & GitHub", level: 93, category: "Tools" },
      { name: "Figma UI Design", level: 85, category: "Tools" }
    ]
  },
  {
    id: "mahim_hasan",
    name: "Mahim Al Hasan",
    role: "AI Automation Engineer",
    academic: "CSE Graduate from BUBT",
    rollNo: "22234103254",
    location: "Dhaka, Bangladesh",
    specialty: "Model Tuning & Autonomous Agent Pipelines",
    photo: "🧠",
    bio: "Committed to engineering cutting-edge intelligent automation frameworks. Specializes in custom retrieval augmented generation (RAG) pipelines, task coordination, and serverless agent setups for complex corporate tasks.",
    skills: [
      { name: "Python & FastAPI", level: 94, category: "Backend" },
      { name: "LangChain", level: 90, category: "Backend" },
      { name: "Model Fine-tuning", level: 85, category: "Specialty" },
      { name: "Vector Databases", level: 88, category: "Backend" },
      { name: "Next.js Integration", level: 80, category: "Frontend" },
      { name: "Tailwind CSS", level: 82, category: "Frontend" },
      { name: "RAG Systems", level: 92, category: "Specialty" },
      { name: "Workflow Engineering", level: 89, category: "Specialty" },
      { name: "Docker containers", level: 85, category: "Tools" },
      { name: "Git", level: 90, category: "Tools" }
    ]
  },
  {
    id: "fahim_faisal",
    name: "Fahim Faisal",
    role: "Lead 3D & UX/UI Designer",
    academic: "CSE Student at BUBT",
    rollNo: "22234103289",
    location: "Dhaka, Bangladesh",
    specialty: "Immersive Motion Mechanics & Interactive Hardware UI",
    photo: "🎨",
    bio: "Crafting visual experiences that transcend flat screens. Transforms raw mathematical parameters into gorgeous reactive user-journeys, ensuring top-tier fluid interaction across modern devices.",
    skills: [
      { name: "Three.js & WebGL", level: 95, category: "Frontend" },
      { name: "Spline 3D Editor", level: 90, category: "Tools" },
      { name: "Motion & Framer CSS", level: 93, category: "Frontend" },
      { name: "Tailwind Styling", level: 92, category: "Frontend" },
      { name: "Interactive Prototyping", level: 94, category: "Specialty" },
      { name: "Creative Art Direction", level: 88, category: "Specialty" },
      { name: "Figma & Illustrator", level: 95, category: "Tools" },
      { name: "Blender 3D Modeling", level: 82, category: "Tools" },
      { name: "PostCSS Shaders", level: 80, category: "Specialty" }
    ]
  },
  {
    id: "taskeen_rahman",
    name: "Taskeen Rahman",
    role: "DevOps & Systems Architect",
    academic: "Software Engineering Specialist at BUBT",
    rollNo: "22234103211",
    location: "Dhaka, Bangladesh",
    specialty: "Distributed Cluster Orchestration & Concurrent Backends",
    photo: "⚙️",
    bio: "Optimizing enterprise systems for cost-efficiency, absolute minimum response latency, and maximum fault tolerance. Specializes in building high-throughput microservices using Golang and Redis.",
    skills: [
      { name: "Go & Gin Framework", level: 94, category: "Backend" },
      { name: "Node.js & Express", level: 88, category: "Backend" },
      { name: "AWS Cloud Services", level: 90, category: "Tools" },
      { name: "Kubernetes & Docker", level: 93, category: "Tools" },
      { name: "CI/CD & GitHub Actions", level: 91, category: "Tools" },
      { name: "Redis Caching", level: 95, category: "Backend" },
      { name: "Database Sharding", level: 85, category: "Specialty" },
      { name: "Enterprise Security", level: 88, category: "Specialty" },
      { name: "Microservice Topology", level: 90, category: "Specialty" }
    ]
  }
];

const defaultRequests = [
  {
    id: "req_1",
    clientName: "Akash Ahmed",
    clientEmail: "akash.dev@example.com",
    projectType: "ecommerce",
    description: "Looking for an ultra-fast high-performance e-commerce platform incorporating 3D product visualizers and local payment integrations.",
    budget: "1800 - 3000 USD",
    status: "accepted",
    timestamp: "2026-05-19T08:30:00Z",
    internalNotes: "Jamil: Handled standard architecture outline. Fahim is preparing WebGL prototype."
  },
  {
    id: "req_2",
    clientName: "Sophia Lin",
    clientEmail: "sophia@aiintelligence.org",
    projectType: "ai_automation",
    description: "An automated invoice auditing system that extracts line items from PDFs and reconciles them with our CRM database via LLM verification.",
    budget: "4000 - 6000 USD",
    status: "pending",
    timestamp: "2026-05-20T04:15:00.000Z",
    internalNotes: "Assigned initially to Mahim Al Hasan to test model accuracy scores."
  }
];

const defaultProjects = [
  {
    id: "proj_1",
    title: "Apex-Cart E-Commerce Platform",
    category: "E-Commerce",
    description: "An ultra-responsive e-commerce platform incorporating 3D physical modeling mockups to rotate and view digital goods in real-time. Features lightning-fast serverless search indices and seamless local payment pathways.",
    metrics: "+42% Conversion Rates | 1.1s Total Load Time",
    roleAssigned: "Lead Developer: Jamil Ahmed Sagor",
    techStack: ["Next.js", "React", "Tailwind CSS", "Three.js", "Redis Memory Pool", "Stripe API"],
    features: ["Interactive 3D product previews", "Automated smart catalog indexing", "Deterministic server-side cache invalidation"],
    demoSlug: "apex-cart-live",
    depthOffset: "hover:-translate-y-2 hover:rotate-1 hover:shadow-cyan-500/10"
  },
  {
    id: "proj_2",
    title: "Aegis Automated Invoice Auditor",
    category: "AI Automation Systems",
    description: "An autonomous enterprise auditing system. Clients upload batch bills or invoice PDFs; the system auto-extracts line items, corrects pricing variations via a semantic logic pool, and reconciles databases asynchronously.",
    metrics: "99.8% Extraction Accuracy | -80% Auditing Overhead",
    roleAssigned: "Lead AI Engineer: Mahim Al Hasan",
    techStack: ["Python", "FastAPI", "Gemini 3.5 Flash", "Pinecone VectorDB", "Docker Orchestration"],
    features: ["Zero-shot text extraction model matching", "Automated multi-factor CRM synchronization", "Slack-automated event alert logs"],
    demoSlug: "aegis-auditor",
    depthOffset: "hover:-translate-y-2 hover:-rotate-1 hover:shadow-indigo-500/10"
  },
  {
    id: "proj_3",
    title: "Aether Immersive Agency Portfolio",
    category: "Creative Portfolios",
    description: "A gorgeous luxury brand-portal containing a 3D-space orbiting interface, fluid simulation shader mouse pathways, and dynamic parallax bento cards representing products.",
    metrics: "120K Unique Visitors | Perfect 100/100 Lighthouse Score",
    roleAssigned: "3D Design Lead: Fahim Faisal",
    techStack: ["React-Three-Fiber", "Three.js Shaders", "Framer Motion", "Tailwind UX"],
    features: ["Procedural math layout transitions", "Fully responsive fluid orbit system", "Device-wide hardware optimization"],
    demoSlug: "aether-portfolio",
    depthOffset: "hover:-translate-y-2 hover:rotate-1 hover:shadow-purple-500/10"
  },
  {
    id: "proj_4",
    title: "Chronos Scalable Task Registry",
    category: "Custom Web Apps",
    description: "High-level distributed backend database panel designed for custom industrial IoT coordination, serving concurrent events with built-in telemetry registers and self-healing memory pools.",
    metrics: "Sub-5ms Latency Pool | Supports 80K Active Concurrency",
    roleAssigned: "Systems Architect: Taskeen Rahman",
    techStack: ["Golang", "Gin Router", "Redis High-Speed Stack", "PostgreSQL Shards", "Kubernetes"],
    features: ["Bi-directional pipeline sockets", "Role-based end-to-end telemetry graphs", "Zero-downtime hot redeploys"],
    demoSlug: "chronos-tasks",
    depthOffset: "hover:-translate-y-2 hover:-rotate-1 hover:shadow-emerald-500/10"
  }
];

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialStore = { members: defaultMembers, requests: defaultRequests, projects: defaultProjects };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialStore, null, 2), "utf8");
      return initialStore;
    }
    const data = fs.readFileSync(DB_PATH, "utf8");
    const json = JSON.parse(data);
    
    // Auto-migrate schema checks safely
    let modified = false;
    if (!json.members) {
      json.members = defaultMembers;
      modified = true;
    }
    if (!json.requests) {
      json.requests = defaultRequests;
      modified = true;
    }
    if (!json.projects) {
      json.projects = defaultProjects;
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(DB_PATH, JSON.stringify(json, null, 2), "utf8");
    }
    return json;
  } catch (error) {
    console.error("Database read error, falling back to default:", error);
    return { members: defaultMembers, requests: defaultRequests, projects: defaultProjects };
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Database write error:", error);
  }
}

// Ensure database is initialized
readDB();

// 1. Members APIs
app.get("/api/members", (req, res) => {
  const db = readDB();
  res.json(db.members);
});

app.put("/api/members/:id", (req, res) => {
  const { id } = req.params;
  const updatedMember = req.body;
  const db = readDB();
  
  const index = db.members.findIndex((m: any) => m.id === id);
  if (index !== -1) {
    db.members[index] = { ...db.members[index], ...updatedMember };
    writeDB(db);
    return res.json({ status: "success", member: db.members[index] });
  } else {
    return res.status(404).json({ error: "Member not found" });
  }
});

// 2. Client Requests APIs
app.get("/api/requests", (req, res) => {
  const db = readDB();
  res.json(db.requests);
});

app.post("/api/requests", (req, res) => {
  const newRequest = req.body;
  if (!newRequest.clientName || !newRequest.clientEmail || !newRequest.description) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const db = readDB();
  const requestEntry = {
    id: "req_" + Date.now(),
    clientName: newRequest.clientName,
    clientEmail: newRequest.clientEmail,
    projectType: newRequest.projectType || "custom_app",
    description: newRequest.description,
    budget: newRequest.budget || "TBD",
    status: "pending",
    timestamp: new Date().toISOString(),
    internalNotes: ""
  };

  db.requests.unshift(requestEntry);
  writeDB(db);
  res.json({ status: "success", request: requestEntry });
});

app.put("/api/requests/:id", (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const db = readDB();

  const index = db.requests.findIndex((r: any) => r.id === id);
  if (index !== -1) {
    db.requests[index] = { ...db.requests[index], ...updateData };
    writeDB(db);
    return res.json({ status: "success", request: db.requests[index] });
  } else {
    return res.status(404).json({ error: "Request not found" });
  }
});

app.delete("/api/requests/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();

  const initialLength = db.requests.length;
  db.requests = db.requests.filter((r: any) => r.id !== id);
  
  if (db.requests.length < initialLength) {
    writeDB(db);
    return res.json({ status: "success", id });
  } else {
    return res.status(404).json({ error: "Request not found" });
  }
});

// 2.5 Dynamic Portfolio Projects APIs
app.get("/api/projects", (req, res) => {
  const db = readDB();
  res.json(db.projects || []);
});

app.post("/api/projects", (req, res) => {
  const newProj = req.body;
  if (!newProj.title || !newProj.category || !newProj.description) {
    return res.status(400).json({ error: "Missing required core fields." });
  }

  const db = readDB();
  const index = Math.floor(Math.random() * 2) === 1 ? "1" : "-1";
  const shadowColor = newProj.category === "E-Commerce" ? "cyan" : 
                      newProj.category === "AI Automation Systems" ? "indigo" :
                      newProj.category === "Creative Portfolios" ? "purple" : "emerald";

  const projectEntry = {
    id: "proj_" + Date.now(),
    title: newProj.title,
    category: newProj.category,
    description: newProj.description,
    metrics: newProj.metrics || "System Operational",
    roleAssigned: newProj.roleAssigned || "Coordinated LFC Build",
    techStack: Array.isArray(newProj.techStack) ? newProj.techStack : [],
    features: Array.isArray(newProj.features) ? newProj.features : [],
    demoSlug: newProj.demoSlug || "custom-live",
    depthOffset: newProj.depthOffset || `hover:-translate-y-2 hover:rotate-${index} hover:shadow-${shadowColor}-500/10`
  };

  if (!db.projects) db.projects = [];
  db.projects.unshift(projectEntry);
  writeDB(db);
  res.json({ status: "success", project: projectEntry });
});

app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const db = readDB();

  if (!db.projects) db.projects = [];
  const index = db.projects.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    db.projects[index] = { ...db.projects[index], ...updateData };
    writeDB(db);
    return res.json({ status: "success", project: db.projects[index] });
  } else {
    return res.status(404).json({ error: "Project not found" });
  }
});

app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const db = readDB();

  if (!db.projects) db.projects = [];
  const initialLength = db.projects.length;
  db.projects = db.projects.filter((p: any) => p.id !== id);

  if (db.projects.length < initialLength) {
    writeDB(db);
    return res.json({ status: "success", id });
  } else {
    return res.status(404).json({ error: "Project not found" });
  }
});

// 3. Server-side Gemini chat API for project estimation & general consulting
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

app.post("/api/estimator-chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  if (!process.env.GEMINI_API_KEY || !ai) {
    return res.json({
      text: "🤖 **[Demo Assistant Mode]** Gemini API is not configured yet. Set `GEMINI_API_KEY` in the secrets explorer to launch complete system-cost prediction and AI software planning capabilities! Here is a prototype answer:\n\n*The LFC Team stands ready. Your custom platform/automation solution typically falls into a range of $1,500 to $4,500 depending on features. Core backend orchestration is developed by **Jamil Ahmed Sagor**, deep model structures by **Mahim Al Hasan**, immersive 3D shaders by **Fahim Faisal**, and low-latency cloud architecture by **Taskeen Rahman**.*"
    });
  }

  // Construct context string including full team bio and specialties
  const promptSystem = `You are the Intelligent AI Systems Advisor for 'LFC Learn for Career' (a premier design & software automation farm).
The farm consists of 4 specialized CSE/Engineering members from BUBT:
1. Jamil Ahmed Sagor - Full Stack Developer & Digital Product Architect (BUBT CSE, Roll: 22234103270). Specializes in React, Next.js, Secure Apps, UI/UX. Jamil handles system architecture, frontend layout, and database secure pipelines.
2. Mahim Al Hasan - Senior AI Automation Engineer. Expert in Python, FastAPI, vector embedding indices, LangChain workflow setups, and autonomous LLM agents.
3. Fahim Faisal - Lead 3D Web & UX Designer. Expert in Three.js, spatial visuals, fluid WebGL matrices, shaders, and visual transitions.
4. Taskeen Rahman - Chief DevOps & Cloud Infrastructure Officer. Expert in Go, microservice scaling, Docker, Kubernetes, and optimized concurrency.

LFC sells:
- Custom responsive e-commerce web portals
- Eye-catching portfolio websites
- Custom high-performance Web Applications (SaaS, internal toolchains, corporate platforms)
- Bespoke Automated Intelligence Systems (e.g., custom AI chatbots, PDF workflow parsing, legal document auditing systems, scheduled web scrapers, automated catalog syncs).

Consult potential clients professionally. Provide practical recommendations, architecture outlines, cost estimates (usually between $1,000 - $8,000 USD depending on features), list who of our 4 members will handle which parts, and explain our delivery process.
Highlight Jamil Ahmed Sagor (CSE, BUBT Roll 22234103270) as the lead systems architect and main customer coordinator.
Keep answers highly conversational, objective, and under 180 words. Format with clean scannable Markdown bullet points where appropriate.`;

  try {
    // Format conversation history for Gemini
    const contents = messages.map((m: any) => {
      return {
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      };
    });

    // Generate output content
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: promptSystem,
        temperature: 0.85
      }
    });

    const textResponse = response.text || "Sorry, I could not output a proper estimation draft. Please try again.";
    res.json({ text: textResponse });
  } catch (err: any) {
    console.error("Gemini API invocation error:", err);
    res.status(500).json({ error: "Gemini server error: " + err.message });
  }
});

// Configure Vite integration or Production static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite hot-reloading...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files
    app.use(express.static(distPath));
    
    // Fallback all other client routing requests to index.html
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
