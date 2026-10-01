export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  highlights: string[];
  github: string | null;
  live: string | null;
  image: string;
  imageKind?: "screenshot" | "concept";
  featured?: boolean;
}
export const profile = {
  name: "Yuvraj Satyapal",
  role: "Full Stack Developer",
  location: "Delhi, India",
  bio: "I build scalable, production-ready web applications, with a focus on real-time systems and developer tools. Currently exploring AI and GenAI engineering.",
  bioLines: [
    "Hi, I’m a **Full Stack Developer**.",
    "Focused on building **scalable**, **reliable** and **high performance** applications.",
    "Open to **full-time**, **remote**, and **freelance** opportunities.",
  ],
  status: "Building MindMora",
  handle: "uviii_03",
  handleUrl: "https://x.com/uviii_03",
  photo: "/images/yuvraj-profile.png" as string | null,
  email: "yuvrajsatyapal21@gmail.com" as string | null,
  resume: null as string | null,
  siteUrl: null as string | null,
  quote: "Build. Learn. Improve. Repeat.",
};
export const socials = [
  {
    name: "LinkedIn",
    handle: "yuvraj-satyapal",
    url: "https://www.linkedin.com/in/yuvraj-satyapal",
    icon: "linkedin",
  },
  {
    name: "GitHub",
    handle: "yuvrajsatyapal",
    url: "https://github.com/yuvrajsatyapal" as string | null,
    icon: "github",
  },
  {
    name: "LeetCode",
    handle: "yuvraj_satyapal",
    url: "https://leetcode.com/u/yuvraj_satyapal/",
    icon: "leetcode",
  },
];
export const education = {
  degree: "Bachelor of Technology in Information Technology",
  institute: "Dr. Akhilesh Das Gupta Institute of Professional Studies",
  dates: "2022 – 2026",
  grade: "CGPA: 8.5",
};
export const experience = [
  {
    company: "Arabazaar",
    logo: "/images/arabazaar-logo.png" as string | null,
    location: "Remote",
    role: "Full Stack Developer Intern",
    dates: "Mar 2026 – Aug 2026",
    status: "past",
    url: null as string | null,
    initials: "A",
    details: [
      "Delivered 7 core modules for the Admin Dashboard with Next.js, TypeScript and TanStack Query.",
      "Built 30+ responsive components and banner sections, integrating REST APIs for dynamic content.",
      "Worked with developers on feature delivery, debugging and weekly code reviews.",
    ],
  },
];
export const projects: Project[] = [
  {
    id: "flowboard",
    name: "FlowBoard",
    featured: true,
    image: "/images/flowboard-screenshot.png",
    imageKind: "screenshot",
    description:
      "A real-time Kanban platform for workspaces, boards and cards. Built for collaborative teams, with live presence and instant updates.",
    tech: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Prisma",
      "Socket.IO",
      "Redis",
      "JWT",
      "Cloudinary",
      "pnpm",
      "Turborepo",
    ],
    highlights: [
      "Drag-and-drop cards, checklists, labels and role-based access",
      "Socket.IO + Redis collaboration, multi-tab presence and notifications",
      "Google OAuth 2.0 and rotating JWT / httpOnly refresh tokens",
      "PostgreSQL full-text search; validated Cloudinary image pipeline",
      "Analytics and Excel export; designed for 100+ concurrent users",
    ],
    github: "https://github.com/yuvrajsatyapal/FlowBoard",
    live: "https://flow-board-web-mu.vercel.app/",
  },
  {
    id: "trimly",
    name: "Trimly",
    image: "/images/trimly-screenshot.png",
    imageKind: "screenshot",
    description:
      "A full-stack URL shortener with custom aliases, editable links, downloadable QR codes and a link-management dashboard.",
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "Auth.js",
      "Upstash Redis",
      "shadcn/ui",
    ],
    highlights: [
      "Manage 100+ links with per-link click analytics",
      "OAuth authentication and PostgreSQL-backed sessions",
      "Redis caching and sliding-window rate limiting",
      "Redirect latency under 80ms; deployed on Vercel",
    ],
    github: "https://github.com/yuvrajsatyapal/Trimly",
    live: "https://trimly-five-azure.vercel.app/",
  },
  {
    id: "avochat",
    name: "AvoChat",
    image: "/images/avochat-screenshot.png",
    imageKind: "screenshot",
    description:
      "Real-time messaging with authentication, persistent conversations, image sharing and online presence.",
    tech: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.IO",
      "JWT",
      "Cloudinary",
    ],
    highlights: [
      "Socket.IO messaging and online presence",
      "JWT authentication, MongoDB persistence and image uploads",
      "Responsive chat interface supporting 20+ concurrent users",
    ],
    github: "https://github.com/yuvrajsatyapal/AvoChat",
    live: "https://avo-chat.vercel.app/login",
  },
];
export const skills = [
  { name: "TypeScript", icon: "typescript", color: "#3178c6", primary: true },
  { name: "React", icon: "react", color: "#61dafb", primary: true },
  { name: "Next.js", icon: "nextjs", color: "#fff", primary: true },
  { name: "Node.js", icon: "nodejs", color: "#68a063", primary: true },
  { name: "PostgreSQL", icon: "postgresql", color: "#4169e1", primary: true },
  { name: "Redis", icon: "redis", color: "#dc382d", primary: true },
  { name: "Prisma", icon: "prisma", color: "#b5d1de", primary: true },
  { name: "Socket.IO", icon: "socketio", color: "#fff", primary: true },
  { name: "TanStack Query", icon: "query", color: "#ff4154", primary: true },
  { name: "JavaScript", icon: "javascript", color: "#f7df1e" },
  { name: "Express.js", icon: "express", color: "#fff" },
  { name: "MongoDB", icon: "mongodb", color: "#47a248" },
  { name: "MySQL", icon: "mysql", color: "#4479a1" },
  { name: "Java", icon: "java", color: "#e76f00" },
  { name: "Python", icon: "python", color: "#3776ab" },
  { name: "SQL", icon: "database", color: "#b5d1de" },
  { name: "HTML", icon: "html", color: "#e34f26" },
  { name: "CSS", icon: "css", color: "#1572b6" },
  { name: "Tailwind CSS", icon: "tailwind", color: "#38bdf8" },
  { name: "Bootstrap", icon: "bootstrap", color: "#7952b3" },
];
export const tools = [
  { name: "Docker", icon: "docker", color: "#2496ed", primary: true },
  { name: "AWS", icon: "aws", color: "#ff9900", primary: true },
  { name: "Git", icon: "git", color: "#f05032" },
  { name: "GitHub", icon: "github", color: "#fff" },
  { name: "Nginx", icon: "nginx", color: "#009639" },
  { name: "GitHub Actions", icon: "githubactions", color: "#2088ff" },
  { name: "Cloudinary", icon: "cloudinary", color: "#3448c5" },
  { name: "Figma", icon: "figma", color: "#f24e1e" },
  { name: "Canva", icon: "canva", color: "#00c4cc" },
  { name: "Zustand", icon: "code", color: "#a5886e" },
  { name: "JWT", icon: "jwt", color: "#fb015b" },
  { name: "Auth.js", icon: "lock", color: "#a78bfa" },
  { name: "bcrypt", icon: "lock", color: "#999" },
  { name: "Recharts", icon: "chart", color: "#22b5bf" },
  { name: "ExcelJS", icon: "sheet", color: "#217346" },
];
export const achievements = {
  leetcodeActivity: { totalActiveDays: 267, maxStreak: 138 },
  leetcodeUsername: "yuvraj_satyapal",
  githubUsername: "yuvrajsatyapal",
  description:
    "Solved 450+ LeetCode problems, including graph and tree algorithms.",
};
// Add your own values when ready. No sample payment addresses are used.
export const support = {
  paypal: null as string | null,
  coffee: null as string | null,
  sponsors: null as string | null,
  upi: null as string | null,
  wallets: {} as Record<string, string>,
};
export const site = {
  clickFeedback: {
    sound: "/audio/click.mp3",
    volume: 0.3,
    sparkCount: 12,
    duration: 500,
  },
  repoUrl: null as string | null,
  analyticsEndpoint: null as string | null,
  leetcodeEndpoint: "/api/leetcode",
  githubEndpoint: "/api/github",
};
export const uses = [
  {
    category: "Frontend",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "TanStack Query",
      "Zustand",
    ],
  },
  {
    category: "Backend & data",
    items: [
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Prisma",
      "Socket.IO",
    ],
  },
  {
    category: "Cloud & delivery",
    items: [
      "AWS EC2 / S3 / RDS / Lambda",
      "Docker",
      "Nginx",
      "GitHub Actions / CI/CD",
    ],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "Cloudinary", "Figma", "Canva"],
  },
];
