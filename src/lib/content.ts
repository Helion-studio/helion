/**
 * Site content — the landing page's services list. Single source of truth.
 */

export type Service = {
  slug: string;
  icon:
    | "game"
    | "cloud"
    | "server"
    | "frontend"
    | "ai"
    | "data"
    | "security"
    | "custom";
  title: string;
  tagline: string;
  body: string;
  ecosystem: string[];
  image: string;
};

export const services: Service[] = [
  {
    slug: "game-development",
    icon: "game",
    title: "Game Development",
    tagline: "Turn concepts into immersive realities",
    body: "Bring your game ideas to us. We specialize in everything from lightweight native platform games to high-end, cross-platform experiences.",
    ecosystem: ["Unity", "Godot", "Roblox", "Unreal Engine", "Android & iOS"],
    image: "/services/game-development.jpg",
  },
  {
    slug: "devops-cloud",
    icon: "cloud",
    title: "DevOps & Cloud Infrastructure",
    tagline: "Automated pipelines, zero management overhead",
    body: "Stop worrying about server stability and deployments. We handle your entire pipeline from local development to cloud production, so you never have to manually merge configurations again.",
    ecosystem: ["AWS", "Cloudflare", "CI/CD Pipelines", "Infrastructure as Code"],
    image: "/services/devops-cloud.jpg",
  },
  {
    slug: "backend-baas",
    icon: "server",
    title: "Backend Architecture & BaaS",
    tagline: "Scalable foundations for modern apps",
    body: "A great product is only as strong as its core. We build rock-solid architectures utilizing both managed Backend-as-a-Service solutions and custom server-side systems.",
    ecosystem: ["Supabase", "Appwrite", "PostgreSQL", "Go", "Python"],
    image: "/services/backend-baas.jpg",
  },
  {
    slug: "frontend-engineering",
    icon: "frontend",
    title: "Frontend Engineering",
    tagline: "Interactive, fluid, and high-converting interfaces",
    body: "Don't let an outdated, sluggish interface turn users away. We engineer premium web and mobile frontends that feel alive, modern, and professional.",
    ecosystem: ["React", "Next.js", "React Native", "TypeScript"],
    image: "/services/frontend-engineering.jpg",
  },
  {
    slug: "ai-automation",
    icon: "ai",
    title: "AI, ML & Intelligent Automation",
    tagline: "Eliminate manual bottlenecks",
    body: "It is 2026 — your business shouldn't be held back by manual tasks. We integrate advanced AI models and Large Language Models to transform everyday business processes into fully automated, intelligent workflows.",
    ecosystem: ["LLM Integration", "RAG Pipelines", "Process Automation", "Groq"],
    image: "/services/ai-automation.jpg",
  },
  {
    slug: "data-pipelines",
    icon: "data",
    title: "Data Engineering & Pipelines",
    tagline: "Streamlined infrastructure for complex data",
    body: "Managing data ingestion and processing can be incredibly frustrating. We build clean, resilient data pipelines that connect your business to the highest-quality data sources with zero friction.",
    ecosystem: ["Ingestion", "ETL", "Streaming", "Warehousing"],
    image: "/services/data-pipelines.jpg",
  },
  {
    slug: "cyber-security",
    icon: "security",
    title: "Cyber Security",
    tagline: "Proactive defense for peace of mind",
    body: "Digital assets face constant threats. Whether you are building from scratch or recovering from a previous security breach, we implement rigorous defensive protocols to ensure your data stays locked down.",
    ecosystem: ["Audits", "Hardening", "Monitoring", "Incident Response"],
    image: "/services/cyber-security.jpg",
  },
  {
    slug: "custom-ecosystems",
    icon: "custom",
    title: "Custom Ecosystems",
    tagline: "Have a unique challenge?",
    body: "If your exact project requirements aren't listed above, bring them to us anyway. We specialize in tackling highly custom, complex technical problems from the ground up.",
    ecosystem: ["Open Layer", "Built From Scratch"],
    image: "/services/custom-ecosystems.jpg",
  },
];
