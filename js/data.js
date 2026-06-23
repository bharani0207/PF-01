// ==========================================
// SUPABASE CONFIG & INITIALIZATION
// ==========================================
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabase = null;
let isSupabaseConfigured = false;

if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    isSupabaseConfigured = true;
  } catch (err) {
    console.warn('Supabase initialization failed, falling back to local data.', err);
  }
}

// ==========================================
// HARDCODED FALLBACK / MOCK DATA
// ==========================================
const DEFAULT_PROFILE = {
  full_name: "Bharanishwar P",
  tagline: "Engineering Student | Problem Solver ⚡",
  bio: "I build modern, innovative and impactful solutions using code, creativity and engineering.",
  avatar_url: "./developer_avatar.png",
  social_links: {
    email: "bharanidinesh726@gmail.com",
    github: "https://github.com/bharanishwar",
    linkedin: "https://linkedin.com/in/bharanishwar",
    portfolio: "https://bharani.dev"
  }
};

const DEFAULT_SKILLS = [
  // AI/ML
  { id: 1, name: "Python", category: "AI/ML", level: 9, sort_order: 1 },
  { id: 2, name: "AI/ML Basics", category: "AI/ML", level: 8, sort_order: 2 },
  // Frontend
  { id: 3, name: "React", category: "Frontend", level: 8, sort_order: 3 },
  { id: 4, name: "Next.js", category: "Frontend", level: 7, sort_order: 4 },
  { id: 5, name: "JavaScript", category: "Frontend", level: 8, sort_order: 5 },
  { id: 6, name: "Tailwind CSS", category: "Frontend", level: 8, sort_order: 6 },
  // Backend
  { id: 7, name: "Node.js", category: "Backend", level: 8, sort_order: 7 },
  { id: 8, name: "Express.js", category: "Backend", level: 7, sort_order: 8 },
  { id: 9, name: "FastAPI", category: "Backend", level: 7, sort_order: 9 },
  { id: 10, name: "Java", category: "Backend", level: 7, sort_order: 10 },
  // Database & DevOps
  { id: 11, name: "Supabase", category: "Database & DevOps", level: 8, sort_order: 11 },
  { id: 12, name: "MongoDB", category: "Database & DevOps", level: 7, sort_order: 12 },
  { id: 13, name: "Docker", category: "Database & DevOps", level: 6, sort_order: 13 },
  { id: 14, name: "Git & GitHub", category: "Database & DevOps", level: 9, sort_order: 14 }
];

const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: "AranNeethi — AI Legal Navigation Assistant",
    description: "AI-powered legal guidance platform for Indian citizens. Built with LLMs, RAG, and NLP to help navigate IPC/CrPC sections in plain Tamil & English.",
    tech_stack: ["Python", "FastAPI", "React", "LangChain", "Supabase", "RAG", "NLP"],
    category: "AI/ML",
    featured: true,
    github_url: "https://github.com/bharanishwar/aranneethi",
    demo_url: "",
    sort_order: 1
  },
  {
    id: 2,
    title: "Stock Market Analytics Platform",
    description: "LSTM-based stock price prediction dashboard with real-time analytics, candlestick charts, and portfolio tracking.",
    tech_stack: ["React", "FastAPI", "Python", "LSTM", "MongoDB", "Recharts"],
    category: "Full Stack",
    featured: true,
    github_url: "https://github.com/bharanishwar/stock-analytics",
    demo_url: "",
    sort_order: 2
  },
  {
    id: 3,
    title: "SaaS Billing System",
    description: "Stripe-inspired subscription billing platform with plan management, invoice generation, and usage tracking.",
    tech_stack: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    category: "Full Stack",
    featured: false,
    github_url: "https://github.com/bharanishwar/saas-billing",
    demo_url: "",
    sort_order: 3
  }
];

const DEFAULT_EXPERIENCE = [
  {
    id: 1,
    role: "B.Tech AIDS Student",
    company: "Dhanalakshmi Srinivasan Engineering College (DSEC)",
    start_date: "2023",
    end_date: "2027 (Expected)",
    is_current: true,
    achievements: [
      "Specializing in Big Data Analytics, Data Science & Visualization, Machine Learning, and Cyber Security.",
      "Developing AranNeethi (AI Legal Navigation Assistant) as a core final year theme project."
    ],
    type: "Education",
    sort_order: 1
  },
  {
    id: 2,
    role: "Full Stack Certifications",
    company: "Coursera & IBM",
    start_date: "2024",
    end_date: "2024",
    is_current: false,
    achievements: [
      "Completed comprehensive curriculum covering React, Node.js, Cloud databases, and server deployment.",
      "Earned IBM Full Stack Software Developer Certification & Coursera Professional Certification."
    ],
    type: "Certification",
    sort_order: 2
  },
  {
    id: 3,
    role: "AI Mastery Learning Paths",
    company: "Google & AWS",
    start_date: "2024",
    end_date: "2024",
    is_current: false,
    achievements: [
      "Google Generative AI Learning Path: Covered diffusion models, attention mechanisms, and LLM tuning.",
      "AWS Generative AI Course: Building and deploying containerized Foundation Models using SageMaker."
    ],
    type: "Certification",
    sort_order: 3
  },
  {
    id: 4,
    role: "Interview Preparation: AFFORDMED Developer Role",
    company: "Placement Milestone",
    start_date: "2025",
    end_date: "Ongoing",
    is_current: true,
    achievements: [
      "Stage 1: DSA Coding Test (Arrays, Trees, Graphs, Dynamic Programming).",
      "Stage 2: Code Pairing Interview (Debugging, clean architectural coding, time optimization).",
      "Stage 3: Web Application Interview (Frontend performance, API scaling, system design)."
    ],
    type: "Milestone",
    sort_order: 4
  }
];

const THEME_PRESETS = {
  ember: { name: 'Ember', value: '#E8590C', rgb: '232, 89, 12' },
  sunset: { name: 'Sunset', value: '#F97316', rgb: '249, 115, 22' },
  terracotta: { name: 'Terracotta', value: '#EA580C', rgb: '234, 88, 12' }
};

// Attach all references to window so they are globally accessible to separate Babel scripts
window.supabase = supabase;
window.isSupabaseConfigured = isSupabaseConfigured;
window.DEFAULT_PROFILE = DEFAULT_PROFILE;
window.DEFAULT_SKILLS = DEFAULT_SKILLS;
window.DEFAULT_PROJECTS = DEFAULT_PROJECTS;
window.DEFAULT_EXPERIENCE = DEFAULT_EXPERIENCE;
window.THEME_PRESETS = THEME_PRESETS;
