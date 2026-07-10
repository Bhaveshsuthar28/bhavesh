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
  resume: "https://ik.imagekit.io/z124gop4xq/Bhavesh_Suthar_Resume_SDE.pdf",
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
    id: "signallab",
    title: "SignalLab - Echo System Simulator",
    problem: "Need for an interactive, real-time web application to process audio files, apply LTI (Linear Time-Invariant) echo and delay effects, and visualize signal analysis charts.",
    approach: "Built a FastAPI backend using NumPy and SciPy for time-domain echo/delay digital signal processing, along with Pydub and FFmpeg for multi-format audio conversion. Created a React frontend with Vite, Tailwind CSS, and Recharts to render real-time interactive charts: waveform comparison, FFT frequency spectrum, echo decay, and system impulse response.",
    stack: ["React", "Vite", "Tailwind CSS", "Recharts", "FastAPI", "NumPy", "SciPy", "Pydub", "FFmpeg"],
    outcome: "Fully operational audio processing simulator that handles multiple file formats (WAV, MP3, etc.), applying configurable delay and repetition parameters with rich visual feedback.",
    status: "Active / Complete",
  },
  {
    id: "smartride",
    title: "SmartRide Vehicle Booking System",
    problem: "Needed a full-stack mobility platform with real-time ride tracking, ride requesting, fare estimation, and captain acceptance flows.",
    approach: "Developed a Node.js/Express REST API with MongoDB/Mongoose. Integrated Socket.IO for real-time ride events. Built a React + Vite frontend styled with Tailwind CSS, utilizing Geoapify API services for geocoding, routing, and address autocomplete, and integrated device GPS for live trip tracking.",
    stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Mongoose", "Socket.IO", "Geoapify"],
    outcome: "Live real-time ride request and booking application with accurate fare estimates, instant captain response, and GPS-driven map updates.",
    status: "Completed",
  },
  {
    id: "aai-entry-pass",
    title: "AAI Varanasi Aerodrome Pass System",
    problem: "Airports Authority of India (AAI) Varanasi needed a Bureau of Civil Aviation Security (BCAS)-compliant digital entry pass system and multi-level approval workflow to replace manual processes and secure applicant data.",
    approach: "Designed and deployed a production-grade Aerodrome Entry Pass Management System with passwordless authentication (FingerprintJS), automated PDF pass generation (pdf-lib), secure multi-stage approval workflow, and automated deployment (Prisma, Docker Compose). Hardened production environment using Nginx Proxy Manager (exposing only port 443 HTTPS).",
    stack: ["React", "Vite", "Node.js", "Fastify", "Prisma ORM", "PostgreSQL", "Docker", "Docker Compose", "Nginx", "FingerprintJS", "JWT", "pdf-lib"],
    outcome: "Streamlined AAI Varanasi aerodrome pass approvals, automated database health checks/migrations/seeding, and secured sensitive PII data in transit.",
    status: "Deployed to Production",
  },
  {
    id: "supplylens",
    title: "SupplyLens Supplier Performance Intelligence Platform",
    problem: "Procurement teams struggle with manual data silos (ERP/spreadsheets), slow decision cycles, and risk blindness without an objective supplier grading framework.",
    approach: "Developed a procurement intelligence platform featuring automated supplier grading via a weighted composite scoring model (OTD + Fill Rate + Quality). Created interactive performance dashboards with React and TypeScript, powered by a FastAPI backend using Python 3.11 and MySQL.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "FastAPI", "Python", "MySQL", "SQLAlchemy", "Alembic", "Recharts"],
    outcome: "Interactive supplier scorecards, real-time alerts, and a metrics engine that processes raw purchase/delivery data into actionable analytics.",
    status: "Live",
    url: "https://supply-lens.vercel.app",
  },
  {
    id: "gsvconnect",
    title: "GSVConnect Yearbook & Alumni Portal",
    problem: "Lack of a unified, interactive platform for college alumni and students to network, share career opportunities, preserve yearbook memories, and manage mentorship opportunities.",
    approach: "Developed a responsive web portal combining React with Tailwind CSS on the frontend and Supabase (PostgreSQL) on the backend. Built search/filter directory capabilities, dynamic event RSVP flows, job boards, admin dashboards with registration approval workflows and audit trails, and a gamified student profile onboarding system.",
    stack: ["React", "Tailwind CSS", "Supabase", "PostgreSQL", "Supabase Auth"],
    outcome: "Interactive yearbook timeline, alumni directory, RSVP and job board workflows with complete admin control panels.",
    status: "Completed",
  },
];

export const experiences: Experience[] = [
  {
    company: "Airports Authority of India (AAI Varanasi)",
    role: "Backend & Systems Intern",
    period: "May 2025 - July 2025",
    description: `• Designed and deployed a production-grade Aerodrome Entry Pass Management System for BCAS-compliant airport access control, handling applicant data including Aadhaar verification and photo identification.
• Built a full-stack containerized system: React (Vite) frontend served via Nginx, Fastify + Prisma backend, and PostgreSQL — orchestrated end-to-end with Docker Compose for one-command deployment.
• Implemented passwordless authentication using FingerprintJS and secure JWT-based session handling for role-based access (admin/staff).
• Automated PDF pass generation using pdf-lib, integrated into a multi-stage BCAS approval workflow.
• Automated the deployment pipeline: DB health checks, Prisma migrations (migrate deploy), and admin seeding all run automatically on 'docker compose up'.
• Hardened the production environment — firewalled direct access to the database (5432) and API (5000) ports, exposing only HTTPS (443) via Nginx Proxy Manager with auto-renewing Let's Encrypt SSL — to protect sensitive applicant PII in transit.
• Delivered a fully documented handover package (setup guide, env config, deployment runbook) enabling independent operation by the receiving AAI technical team.

Tech stack: React, Vite, Node.js, Fastify, Prisma ORM, PostgreSQL, Docker, Docker Compose, Nginx, FingerprintJS, JWT, pdf-lib`,
  },
  {
    company: "Indian Railways — DRM Office, Vadodara",
    role: "Operations & Systems Intern",
    period: "May 2025",
    description: `• Observed and documented locomotive management workflows across railway stations in the Vadodara division.
• Analyzed station operations including scheduling, crew management, and resource allocation systems.
• Identified operational bottlenecks relevant to AI-based optimization — directly inspired current logistics ML project.
• Gained exposure to large-scale infrastructure systems managing 100,000+ daily passenger movements.

Skills: Systems Analysis · Operations Research · Documentation`,
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
    skills: ["Node.js", "Fastify", "FastAPI", "Express", "Spring Boot", "Supabase", "Prisma", "Drizzle ORM"],
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
    skills: ["Docker", "AWS EC2", "Nginx", "Git", "GitHub", "VS Code", "Postman", "Bull (Job Queues)"],
  },
  {
    category: "Core CS",
    skills: ["Data Structures & Algorithms", "Design & Analysis of Algorithms", "DBMS", "Operating Systems"],
  },
];
