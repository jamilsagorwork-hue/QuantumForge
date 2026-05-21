import { TeamMember, ClientRequest, Project } from "./types";

export const defaultMembers: TeamMember[] = [
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
    name: "Ak Suvho",
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

export const defaultRequests: ClientRequest[] = [
  {
    id: "req_1",
    clientName: "Akash Ahmed",
    clientEmail: "akash.dev@example.com",
    projectType: "ecommerce",
    description: "Looking for an ultra-fast high-performance e-commerce platform incorporating 3D product visualizers and local payment integrations.",
    budget: "1800 - 3000 USD",
    status: "accepted",
    timestamp: "2026-05-19T08:30:00.000Z",
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

export const defaultProjects: Project[] = [
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
    demoSlug: "chronos-system",
    depthOffset: "hover:-translate-y-2 hover:-rotate-1 hover:shadow-emerald-500/10"
  }
];
