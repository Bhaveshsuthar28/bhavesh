export interface Project {
  id: string;
  title: string;
  problem: string;
  approach: string;
  stack: string[];
  outcome: string;
  status: string;
  url?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  details: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  leetcode: string;
  codolio: string;
  email: string;
  resume: string;
}

export const socialLinks: SocialLinks = {
  github: "https://github.com/Bhaveshsuthar28",
  linkedin: "https://www.linkedin.com/in/bhaveshjangid",
  leetcode: "https://leetcode.com/u/Bhavesh_s_k",
  codolio: "https://codolio.com/profile/Bhavesh_S_K28",
  email: "bhavesh.suthar.ai@gmail.com",
  resume: "/resume.pdf", // User can place their resume.pdf in public folder
};

export const bioData = {
  name: "Bhavesh Suthar",
  fullName: "Bhavesh Suthar (Bhavesh Jangid)",
  tagline: "AI/ML Engineer & Backend Developer — building production systems, from BCAS-compliant infra at Airports Authority of India to real-time video intelligence pipelines.",
  educationShort: "B.Tech, AI & Data Science @ Gati Shakti Vishwavidyalaya (GSV), Vadodara — Class of 2028 (Currently 3rd Year)",
};

export const projects: Project[] = [
  {
    id: "feesbook",
    title: "FeesBook",
    problem: "Schools needed a fee collection + tracking system with WhatsApp-native communication, deployed on a free/low-cost infra tier.",
    approach: "Built a module-monolith backend, fixed a critical N+1 query performance bug that cut page load time from 6–10s down significantly; built a production WhatsApp Cloud API integration (moved from sandbox to a permanent System User token) with a multi-bot architecture (principal bot, parent bot with per-school deep links, support bot); added a WhatsApp-native OCR import flow using a vision LLM for student data.",
    stack: ["Fastify", "Drizzle ORM", "Turso/LibSQL", "Upstash Redis", "Clerk", "ImageKit", "Bull Queue", "Docker", "AWS EC2", "React", "Vite", "Tailwind CSS"],
    outcome: "Successfully deployed and live in production, handling automated WhatsApp notifications, digital school fee payments, and smart OCR student records imports.",
    status: "Live, Production Use",
  },
  {
    id: "visionboard-ai",
    title: "VisionBoard AI",
    problem: "Needed a system to detect, track, and understand objects/people in video streams in real time.",
    approach: "Combined multiple CV/ML models in a single pipeline for detection, tracking, and semantic understanding, with vector search for retrieval.",
    stack: ["YOLOv8", "DeepSORT", "DINOv2", "SAM", "pgvector", "FastAPI", "React", "RunPod", "Vast.ai"],
    outcome: "Primary flagship project capable of real-time multi-object tracking, segmentation, and semantic querying on cloud GPU infrastructure.",
    status: "Primary Flagship / Active Dev",
  },
  {
    id: "trinetra",
    title: "Trinetra",
    problem: "Needed a high-performance video analytics pipeline for research and computer vision competitions.",
    approach: "Built a complex pipeline combining PyTorch model inferences with Segment Anything Model (SAM) and DINOv2 self-supervised visual descriptors for video analytics in collaboration with Vehant Technologies.",
    stack: ["PyTorch", "SAM", "DINOv2", "OpenCV"],
    outcome: "Strongest technical computer vision credential. Submitted to PSCDL 2026 and NCVPRIPG'26.",
    status: "Research / Competition",
  },
  {
    id: "aai-entry-pass",
    title: "AAI Varanasi Aerodrome Pass",
    problem: "Airports Authority of India (AAI) Varanasi needed a Bureau of Civil Aviation Security (BCAS)-compliant digital entry pass system and multi-level approval workflow.",
    approach: "Designed a production web system with passwordless authentication, pdf-lib based custom secure PDF pass generator, and a compliant multi-step approval workflow.",
    stack: ["Node.js", "Fastify", "Prisma", "PostgreSQL", "pdf-lib", "FingerprintJS"],
    outcome: "Deployed to production during internship at AAI Varanasi, streamlining aerodrome approvals.",
    status: "Deployed to Production",
  },
  {
    id: "supplylens",
    title: "SupplyLens",
    problem: "A comprehensive supplier analytics platform was required to monitor supplier performance and track operational health.",
    approach: "Created a metrics tracking dashboard with fast backend queries and clean chart interfaces.",
    stack: ["FastAPI", "React", "MySQL", "Clerk"],
    outcome: "Interactive real-time metrics tool, live at supply-lens.vercel.app.",
    status: "Live",
    url: "https://supply-lens.vercel.app",
  },
];

export const experiences: Experience[] = [
  {
    company: "Airports Authority of India (AAI Varanasi)",
    role: "Backend & Systems Intern",
    period: "May 2025 - July 2025",
    description: "Designed, implemented, and deployed a production BCAS-compliant Aerodrome Entry Pass and approval system. Handled secure passwordless login, pdf-lib PDF layout generation, and multi-user authorization flows.",
  },
  {
    company: "DRM Vadodara (Indian Railways)",
    role: "Engineering Intern",
    period: "June 2024 - July 2024",
    description: "First-year engineering internship exploring railway operations, digital signaling systems, and infrastructure data management systems.",
  },
];

export const education: Education[] = [
  {
    institution: "Gati Shakti Vishwavidyalaya (GSV)",
    degree: "B.Tech in Artificial Intelligence & Data Science",
    period: "2024 - 2028",
    details: "Currently in 3rd Year. Focused on advanced AI/ML algorithms, computer vision pipelines, backend systems design, and database normalization.",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["Python", "Java", "JavaScript", "C"],
  },
  {
    category: "AI / ML",
    skills: ["NumPy", "Pandas", "Scikit-learn", "PyTorch", "OpenCV", "YOLOv8", "DeepSORT", "DINOv2", "SAM"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Fastify", "Express", "Spring Boot", "Prisma", "Drizzle ORM"],
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Turso/LibSQL", "Redis (Upstash)", "pgvector"],
  },
  {
    category: "Frontend",
    skills: ["React", "Vite", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    category: "Infra / Tools",
    skills: ["Docker", "AWS EC2", "Git", "GitHub", "VS Code", "Postman", "Bull (Job Queues)"],
  },
  {
    category: "Core CS",
    skills: ["Data Structures & Algorithms", "Design & Analysis of Algorithms", "DBMS", "Operating Systems"],
  },
];
