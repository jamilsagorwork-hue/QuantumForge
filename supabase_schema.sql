-- ==========================================
-- QUANTUMFORGE SUPABASE SCHEMA DEFINITION
-- Copy and paste this script into your Supabase SQL Editor
-- to initialize the database tables and enable global persistence.
-- ==========================================

-- 1. CLEANUP EXISTING TABLES (OPTIONAL)
-- DROP TABLE IF EXISTS public.projects CASCADE;
-- DROP TABLE IF EXISTS public.requests CASCADE;
-- DROP TABLE IF EXISTS public.members CASCADE;

-- 2. CREATE MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    academic TEXT NOT NULL,
    roll_no TEXT,
    location TEXT,
    specialty TEXT NOT NULL,
    photo TEXT DEFAULT '⚡',
    bio TEXT,
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE CLIENT REQUESTS / OUTLINES TABLE
CREATE TABLE IF NOT EXISTS public.requests (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    project_type TEXT NOT NULL,
    description TEXT NOT NULL,
    budget TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    internal_notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE PROJECTS SHOWCASE TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    metrics TEXT DEFAULT 'System Operational',
    role_assigned TEXT DEFAULT 'Coordinated Build',
    tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    demo_slug TEXT DEFAULT 'custom-live',
    depth_offset TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. DISABLE ROW LEVEL SECURITY (RLS) FOR FULL DEMO ACCESSIBILITY
-- Note: This is recommended for general access in demo pipelines. If you expect production traffic,
-- keep RLS enabled and write customized policies.
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- 6. SEED INITIAL SAMPLE DATA
-- (This ensures the interactive portal loads successfully with your customized team)
INSERT INTO public.members (id, name, role, academic, roll_no, location, specialty, photo, bio, skills)
VALUES 
(
  'jamil_sagor',
  'Jamil Ahmed Sagor',
  'Full Stack Developer',
  'CSE Student at Bangladesh University of Business and Technology (BUBT)',
  '22234103270',
  'Dhaka, Bangladesh',
  'Digital Product Architect & High-Performance Web Systems',
  '⚡',
  'Driven by a passion for creating seamless digital experiences. As a Computer Science student at BUBT, I bridge the gap between complex engineering and elegant design, transforming ideas into scalable cloud-native architectures.',
  '[{"name": "React & Next.js", "level": 95, "category": "Frontend"}, {"name": "Tailwind CSS", "level": 98, "category": "Frontend"}, {"name": "Three.js & Canvas", "level": 85, "category": "Frontend"}, {"name": "Node.js & Express", "level": 92, "category": "Backend"}, {"name": "Firebase", "level": 90, "category": "Backend"}, {"name": "MongoDB", "level": 88, "category": "Backend"}, {"name": "Digital Products", "level": 94, "category": "Specialty"}, {"name": "UI/UX Architecture", "level": 90, "category": "Specialty"}, {"name": "Secure Systems", "level": 87, "category": "Specialty"}, {"name": "Docker & Linux", "level": 80, "category": "Tools"}, {"name": "Git & GitHub", "level": 93, "category": "Tools"}, {"name": "Figma UI Design", "level": 85, "category": "Tools"}]'::jsonb
),
(
  'mahim_hasan',
  'Ak Suvho',
  'AI Automation Engineer',
  'CSE Graduate from BUBT',
  '22234103254',
  'Dhaka, Bangladesh',
  'Model Tuning & Autonomous Agent Pipelines',
  '🧠',
  'Committed to engineering cutting-edge intelligent automation frameworks. Specializes in custom retrieval augmented generation (RAG) pipelines, task coordination, and serverless agent setups for complex corporate tasks.',
  '[{"name": "Python & FastAPI", "level": 94, "category": "Backend"}, {"name": "LangChain", "level": 90, "category": "Backend"}, {"name": "Model Fine-tuning", "level": 85, "category": "Specialty"}, {"name": "Vector Databases", "level": 88, "category": "Backend"}, {"name": "Next.js Integration", "level": 80, "category": "Frontend"}, {"name": "Tailwind CSS", "level": 82, "category": "Frontend"}, {"name": "RAG Systems", "level": 92, "category": "Specialty"}, {"name": "Workflow Engineering", "level": 89, "category": "Specialty"}, {"name": "Docker containers", "level": 85, "category": "Tools"}, {"name": "Git", "level": 90, "category": "Tools"}]'::jsonb
),
(
  'fahim_faisal',
  'Fahim Faisal',
  'Lead 3D & UX/UI Designer',
  'CSE Student at BUBT',
  '22234103289',
  'Dhaka, Bangladesh',
  'Immersive Motion Mechanics & Interactive Hardware UI',
  '🎨',
  'Crafting visual experiences that transcend flat screens. Transforms raw mathematical parameters into gorgeous reactive user-journeys, ensuring top-tier fluid interaction across modern devices.',
  '[{"name": "Three.js & WebGL", "level": 95, "category": "Frontend"}, {"name": "Spline 3D Editor", "level": 90, "category": "Tools"}, {"name": "Motion & Framer CSS", "level": 93, "category": "Frontend"}, {"name": "Tailwind Styling", "level": 92, "category": "Frontend"}, {"name": "Interactive Prototyping", "level": 94, "category": "Specialty"}, {"name": "Creative Art Direction", "level": 88, "category": "Specialty"}, {"name": "Figma & Illustrator", "level": 95, "category": "Tools"}, {"name": "Blender 3D Modeling", "level": 82, "category": "Tools"}, {"name": "PostCSS Shaders", "level": 80, "category": "Specialty"}]'::jsonb
),
(
  'taskeen_rahman',
  'Taskeen Rahman',
  'DevOps & Systems Architect',
  'Software Engineering Specialist at BUBT',
  '22234103211',
  'Dhaka, Bangladesh',
  'Distributed Cluster Orchestration & Concurrent Backends',
  '⚙️',
  'Optimizing enterprise systems for cost-efficiency, absolute minimum response latency, and maximum fault tolerance. Specializes in building high-throughput microservices using Golang and Redis.',
  '[{"name": "Go & Gin Framework", "level": 94, "category": "Backend"}, {"name": "Node.js & Express", "level": 88, "category": "Backend"}, {"name": "AWS Cloud Services", "level": 90, "category": "Tools"}, {"name": "Kubernetes & Docker", "level": 93, "category": "Tools"}, {"name": "CI/CD & GitHub Actions", "level": 91, "category": "Tools"}, {"name": "Redis Caching", "level": 95, "category": "Backend"}, {"name": "Database Sharding", "level": 85, "category": "Specialty"}, {"name": "Enterprise Security", "level": 88, "category": "Specialty"}, {"name": "Microservice Topology", "level": 90, "category": "Specialty"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.projects (id, title, category, description, metrics, role_assigned, tech_stack, features, demo_slug, depth_offset)
VALUES
(
  'proj_1',
  'Apex-Cart E-Commerce Platform',
  'E-Commerce',
  'An ultra-responsive e-commerce platform incorporating 3D physical modeling mockups to rotate and view digital goods in real-time. Features lightning-fast serverless search indices and seamless local payment pathways.',
  '+42% Conversion Rates | 1.1s Total Load Time',
  'Lead Developer: Jamil Ahmed Sagor',
  '["Next.js", "React", "Tailwind CSS", "Three.js", "Redis Memory Pool", "Stripe API"]'::jsonb,
  '["Interactive 3D product previews", "Automated smart catalog indexing", "Deterministic server-side cache invalidation"]'::jsonb,
  'apex-cart-live',
  'hover:-translate-y-2 hover:rotate-1 hover:shadow-cyan-500/10'
),
(
  'proj_2',
  'Aegis Automated Invoice Auditor',
  'AI Automation Systems',
  'An autonomous enterprise auditing system. Clients upload batch bills or invoice PDFs; the system auto-extracts line items, corrects pricing variations via a semantic logic pool, and reconciles databases asynchronously.',
  '99.8% Extraction Accuracy | -80% Auditing Overhead',
  'Lead AI Engineer: Ak Suvho',
  '["Python", "FastAPI", "Gemini 3.5 Flash", "Pinecone VectorDB", "Docker Orchestration"]'::jsonb,
  '["Zero-shot text extraction model matching", "Automated multi-factor CRM synchronization", "Slack-automated event alert logs"]'::jsonb,
  'aegis-auditor',
  'hover:-translate-y-2 hover:-rotate-1 hover:shadow-indigo-500/10'
),
(
  'proj_3',
  'Aether Immersive Agency Portfolio',
  'Creative Portfolios',
  'A gorgeous luxury brand-portal containing a 3D-space orbiting interface, fluid simulation shader mouse pathways, and dynamic parallax bento cards representing products.',
  '120K Unique Visitors | Perfect 100/100 Lighthouse Score',
  '3D Design Lead: Fahim Faisal',
  '["React-Three-Fiber", "Three.js Shaders", "Framer Motion", "Tailwind UX"]'::jsonb,
  '["Procedural math layout transitions", "Fully responsive fluid orbit system", "Device-wide hardware optimization"]'::jsonb,
  'aether-portfolio',
  'hover:-translate-y-2 hover:rotate-1 hover:shadow-purple-500/10'
),
(
  'proj_4',
  'Chronos Scalable Task Registry',
  'Custom Web Apps',
  'High-level distributed backend database panel designed for custom industrial IoT coordination, serving concurrent events with built-in telemetry registers and self-healing memory pools.',
  'Sub-5ms Latency Pool | Supports 80K Active Concurrency',
  'Systems Architect: Taskeen Rahman',
  '["Golang", "Gin Router", "Redis High-Speed Stack", "PostgreSQL Shards", "Kubernetes"]'::jsonb,
  '["Bi-directional pipeline sockets", "Role-based end-to-end telemetry graphs", "Zero-downtime hot redeploys"]'::jsonb,
  'chronos-tasks',
  'hover:-translate-y-2 hover:-rotate-1 hover:shadow-emerald-500/10'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.requests (id, client_name, client_email, project_type, description, budget, status, timestamp, internal_notes)
VALUES
(
  'req_1',
  'Akash Ahmed',
  'akash.dev@example.com',
  'ecommerce',
  'Looking for an ultra-fast high-performance e-commerce platform incorporating 3D product visualizers and local payment integrations.',
  '1800 - 3000 USD',
  'accepted',
  '2026-05-19 08:30:00+00',
  'Jamil: Handled standard architecture outline. Fahim is preparing WebGL prototype.'
),
(
  'req_2',
  'Sophia Lin',
  'sophia@aiintelligence.org',
  'ai_automation',
  'An automated invoice auditing system that extracts line items from PDFs and reconciles them with our CRM database via LLM verification.',
  '4000 - 6000 USD',
  'pending',
  '2026-05-20 04:15:00+00',
  'Assigned initially to Ak Suvho to test model accuracy scores.'
)
ON CONFLICT (id) DO NOTHING;
