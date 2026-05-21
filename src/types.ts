export interface Skill {
  name: string;
  level: number; // 0 to 100
  category: "Frontend" | "Backend" | "Specialty" | "Tools";
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  academic: string;
  rollNo?: string;
  location: string;
  bio: string;
  specialty: string;
  photo: string; // fallback visual styling pattern or emoji avatar
  skills: Skill[];
}

export interface ClientRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  projectType: "ecommerce" | "portfolio" | "custom_app" | "ai_automation" | "other";
  description: string;
  budget: string;
  status: "pending" | "reviewing" | "accepted" | "completed";
  timestamp: string;
  internalNotes?: string;
}

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface Project {
  id: string;
  title: string;
  category: "E-Commerce" | "Creative Portfolios" | "Custom Web Apps" | "AI Automation Systems";
  description: string;
  metrics: string;
  roleAssigned: string;
  techStack: string[];
  features: string[];
  demoSlug: string;
  depthOffset: string; // 3D aesthetic style modifiers (e.g. rotate, colors)
}

