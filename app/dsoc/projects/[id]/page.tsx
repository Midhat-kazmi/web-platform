'use client';

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { 
  ArrowLeft,
  Clock, 
  Users, 
  Calendar,
  Github,
  ExternalLink,
  Linkedin,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
  Code2,
  MessageCircle
} from "lucide-react";
import "../../styles.css";
import DSOCNavbar from "../../components/DSOCNavbar";

interface Mentor {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  company?: string;
  jobTitle?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  organization: string;
  repositoryUrl: string;
  websiteUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  technologies: string[];
  tags: string[];
  mentors: Mentor[];
  selectedMentees: { _id: string; name: string; picture?: string; university?: string }[];
  maxMentees: number;
  status: string;
  applicationDeadline: string;
  startDate: string;
  endDate: string;
  requirements: string[];
  learningOutcomes: string[];
  milestones: { title: string; description: string; dueDate: string; completed: boolean }[];
  discordChannelId?: string;
  season: string;
}

// Sample projects for fallback when API is unavailable
const SAMPLE_PROJECTS: Record<string, Project> = {
  'psxworth': {
    _id: 'psxworth',
    title: 'PsxWorth',
    description: 'PsxWorth is a portfolio tracking app for PSX investors. It serves 950+ real users and focuses on simple, clear portfolio tracking with custom dashboards and themes.',
    longDescription: `PsxWorth is a portfolio tracking platform built for PSX investors who want a clearer view of their holdings, performance, and investment decisions. The product already serves 950+ real users, so the contribution work needs to respect an existing production audience while improving the experience.

The project proposal centers on three additions: support for mutual funds, custom dashboards, and custom themes. The current stack uses Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, Clerk, Drizzle ORM, PostgreSQL, TanStack Query, TanStack Table, PostHog, Upstash Redis, AI SDK, ApexCharts, Recharts, React Hook Form, and Zod. The backend is based on NestJS, though it is not open source yet.

The goal is to help investors in Pakistan make better decisions and keep portfolio tracking simple, clear, and useful. Project images and Loom video will be added later.`,
    organization: 'Dev Weekends',
    repositoryUrl: 'https://github.com/Wajahat43/psxworth',
    websiteUrl: 'https://psxworth.com',
    difficulty: 'advanced',
    duration: '10-12 weeks',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Radix UI', 'Clerk', 'Drizzle ORM', 'PostgreSQL', 'TanStack Query', 'TanStack Table', 'PostHog', 'Upstash Redis', 'AI SDK', 'ApexCharts', 'Recharts', 'React Hook Form', 'Zod'],
    tags: ['fintech', 'portfolio-tracking', 'dashboard', 'open-source', 'psx'],
    mentors: [
      {
        _id: 'mentor-psx-1',
        name: 'Amina Raza',
        email: 'amina@devweekends.org',
        company: 'FinTech',
        jobTitle: 'Product Engineer',
        bio: 'Works on financial products and data-rich dashboards.',
        linkedin: 'https://linkedin.com/in/amina-raza',
        github: 'https://github.com/aminaraza'
      },
      {
        _id: 'mentor-psx-2',
        name: 'Bilal Ahmed',
        email: 'bilal@devweekends.org',
        company: 'Analytics Platform',
        jobTitle: 'Full-Stack Engineer',
        bio: 'Builds dashboards, table-heavy UIs, and product analytics tooling.',
        linkedin: 'https://linkedin.com/in/bilalahmed',
        github: 'https://github.com/bilalahmed'
      }
    ],
    selectedMentees: [],
    maxMentees: 3,
    status: 'open',
    applicationDeadline: '2026-05-25',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    requirements: [
      'JavaScript/TypeScript fundamentals',
      'Experience with React and Next.js',
      'Comfort with PostgreSQL and ORM-based data access',
      'Ability to work with dashboards and analytics-heavy UIs',
      'Ability to commit 10-15 hours per week'
    ],
    learningOutcomes: [
      'Build dashboards for portfolio and performance tracking',
      'Model financial data and reporting workflows in PostgreSQL',
      'Implement clean, themeable interfaces with modern UI libraries',
      'Work with analytics, tables, and chart-heavy product interfaces',
      'Understand how to extend an existing product used by real users'
    ],
    milestones: [
      { title: 'Data Model Review', description: 'Understand the current portfolio model and map the mutual fund extension plan', dueDate: '2026-06-15', completed: false },
      { title: 'Custom Dashboard Layouts', description: 'Build configurable dashboard views for different investor needs', dueDate: '2026-06-30', completed: false },
      { title: 'Theme System', description: 'Add custom themes and polish visual consistency across key screens', dueDate: '2026-07-15', completed: false },
      { title: 'Mutual Funds Support', description: 'Extend portfolio tracking to include mutual fund data and display', dueDate: '2026-07-31', completed: false },
      { title: 'Analytics & Release', description: 'Refine charts, reports, and UX details before final review', dueDate: '2026-08-31', completed: false }
    ],
    season: 'DSOC 2026'
  },
  'voiceybill': {
    _id: 'voiceybill',
    title: 'VoiceyBill',
    description: 'VoiceyBill is an open source AI-powered finance tracker that lets people log income and expenses by voice, receipt scan, or manual entry.\nIt uses Gemini and UpliftAI to classify transactions, supports CSV imports and recurring entries, and keeps the experience fast for multilingual users.\nThe product is designed around a responsive, multi-theme UI with analytics and monthly reports.',
    longDescription: `VoiceyBill is an open source, AI-powered personal finance platform designed for multilingual users who want to track money without fighting a form. It supports voice commands, receipt scanning, manual entry, CSV import, recurring transactions, analytics dashboards, and monthly email reports.

The project is built on the MERN stack with TypeScript and integrates Google Gemini AI and UpliftAI to classify transactions from voice and image inputs. The codebase is split across a web frontend and a backend service, and DSOC contributors will extend it with expense splitting, budget planning, AI-powered financial insights, forecasting, and multi-currency support.

Repository: https://github.com/voiceyBill/voiceyBill-web and https://github.com/voiceyBill/voiceyBill-server. Live demo: https://voiceybill.vercel.app.`,
    organization: 'Dev Weekends',
    repositoryUrl: 'https://github.com/voiceyBill/voiceyBill-web',
    websiteUrl: 'https://voiceybill.vercel.app',
    difficulty: 'advanced',
    duration: '10-12 weeks',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'TypeScript', 'Google Gemini AI', 'UpliftAI', 'Cloudinary', 'Redux Toolkit', 'RTK Query'],
    tags: ['full-stack', 'ai', 'finance', 'voice-input', 'open-source'],
    mentors: [
      {
        _id: 'mentor-1',
        name: 'Alex Chen',
        email: 'alex@devweekends.org',
        company: 'GitHub',
        jobTitle: 'Senior Software Engineer',
        bio: 'Full-stack developer with 8+ years of experience building developer tools.',
        linkedin: 'https://linkedin.com/in/alexchen',
        github: 'https://github.com/alexchen'
      },
      {
        _id: 'mentor-2',
        name: 'Sarah Williams',
        email: 'sarah@devweekends.org',
        company: 'Vercel',
        jobTitle: 'Staff Engineer',
        bio: 'Passionate about building performant web applications and mentoring developers.',
        linkedin: 'https://linkedin.com/in/sarahwilliams',
        github: 'https://github.com/sarahwilliams'
      }
    ],
    selectedMentees: [],
    maxMentees: 3,
    status: 'open',
    applicationDeadline: '2026-05-25',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    requirements: [
      'JavaScript/TypeScript fundamentals',
      'Experience with React or Node.js',
      'Familiarity with MongoDB and REST APIs',
      'Comfort with Git and GitHub',
      'Ability to commit 10-15 hours per week'
    ],
    learningOutcomes: [
      'Build a production-style MERN application with AI integrations',
      'Implement voice and receipt-based transaction workflows',
      'Model financial data in MongoDB and build aggregation queries',
      'Create dashboards, reports, and notification flows',
      'Add multi-currency and internationalization support'
    ],
    milestones: [
      { title: 'Voice Logging Pipeline', description: 'Build microphone capture, transcription, and transaction classification flow', dueDate: '2026-06-15', completed: false },
      { title: 'Receipt Scanning', description: 'Add image upload and Gemini-based receipt extraction', dueDate: '2026-06-30', completed: false },
      { title: 'CSV Import & Recurring Transactions', description: 'Support bulk imports and automated scheduled entries', dueDate: '2026-07-15', completed: false },
      { title: 'Analytics & Monthly Reports', description: 'Finish dashboards, charts, and email summaries', dueDate: '2026-07-31', completed: false },
      { title: 'Budgeting & Multi-Currency', description: 'Deliver smart alerts, insights, splitting, and currency support', dueDate: '2026-08-31', completed: false }
    ],
    season: 'DSOC 2026'
  },
  'pathment': {
    _id: 'pathment',
    title: 'Pathment',
    description: 'Pathment is a SaaS mentorship platform for organizations that want structured, mentor-guided employee training.\nIt connects mentees with real mentors, uses task-based workflows and progress tracking, and adds gamification to boost engagement and measurable outcomes.',
    longDescription: `Pathment is a SaaS-based mentorship platform built for organizations and learning teams that want to run structured, mentor-guided programs. The platform centers on three roles — Admin, Mentor, and Mentee — and supports multi-level programs, mentor matching, task submission with feedback, gamification, and analytics to measure learning outcomes.

  The codebase is a monorepo consisting of a public marketing site, a backend server (Node.js + Express + PostgreSQL with Sequelize), and a Next.js + TypeScript client interface. An AI layer (Groq/OpenAI) can generate personalized roadmaps and weekly task breakdowns, saving curriculum design time for admins. Real-time messaging is implemented with Socket.IO, and media is handled via Cloudinary. The project is contributor-friendly with many beginner-friendly issues: UI polish, accessibility, email templates, stricter API validation, test coverage, seed/demo data, and analytics improvements.`,
    organization: 'Dev Weekends',
    repositoryUrl: 'https://github.com/Sheryar-Ahmed/pathment.git',
    websiteUrl: 'https://pathment.me/',
    difficulty: 'advanced',
    duration: '10-12 weeks',
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'Socket.io', 'Tailwind CSS', 'Tiptap', 'Cloudinary'],
    tags: ['full-stack', 'real-time', 'developer-tools', 'collaboration'],
    mentors: [
      {
        _id: 'mentor-1',
        name: 'Alex Chen',
        email: 'alex@devweekends.org',
        company: 'GitHub',
        jobTitle: 'Senior Software Engineer',
        bio: 'Full-stack developer with 8+ years of experience building developer tools.',
        linkedin: 'https://linkedin.com/in/alexchen',
        github: 'https://github.com/alexchen'
      },
      {
        _id: 'mentor-2',
        name: 'Sarah Williams',
        email: 'sarah@devweekends.org',
        company: 'Vercel',
        jobTitle: 'Staff Engineer',
        bio: 'Passionate about building performant web applications and mentoring developers.',
        linkedin: 'https://linkedin.com/in/sarahwilliams',
        github: 'https://github.com/sarahwilliams'
      }
    ],
    selectedMentees: [],
    maxMentees: 3,
    status: 'open',
    applicationDeadline: '2026-05-25',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    requirements: [
      'JavaScript/TypeScript fundamentals',
      'Experience with React or Next.js',
      'Familiarity with REST APIs and relational databases',
      'Comfort with Git and GitHub',
      'Ability to commit 10-15 hours per week'
    ],
    learningOutcomes: [
      'Build full-stack web applications with Next.js and Express',
      'Implement role-based flows (Admin/Mentor/Mentee) and task workflows',
      'Integrate real-time messaging with Socket.IO',
      'Work with relational databases (PostgreSQL + Sequelize)',
      'Add AI-assisted roadmap generation and analytics dashboards'
    ],
    milestones: [
      { title: 'Project Setup & Onboarding', description: 'Get the monorepo running locally, seed demo data, and familiarise with architecture', dueDate: '2026-06-15', completed: false },
      { title: 'Mentor Matching & Task Flow', description: 'Implement mentor assignment, task creation, and submission/feedback loop', dueDate: '2026-06-30', completed: false },
      { title: 'AI Roadmap Integration', description: 'Add AI-generated roadmap/task suggestions for program levels', dueDate: '2026-07-15', completed: false },
      { title: 'Real-time Messaging & Notifications', description: 'Enhance Socket.IO messaging and notification delivery', dueDate: '2026-07-31', completed: false },
      { title: 'Analytics & Deploy', description: 'Complete admin analytics, polish UI, and deploy the marketing site', dueDate: '2026-08-31', completed: false }
    ],
    season: 'DSOC 2026'
  },
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
  }, [resolvedParams.id]);

  const fetchProject = async () => {
    // Check for sample project first
    if (SAMPLE_PROJECTS[resolvedParams.id]) {
      setProject(SAMPLE_PROJECTS[resolvedParams.id]);
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch(`/api/dsoc/projects/${resolvedParams.id}`);
      const data = await res.json();
      
      if (data.success) {
        setProject(data.data);
      } else {
        setError(data.error || 'Project not found');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-[var(--dsoc-success)]';
      case 'intermediate': return 'bg-[var(--dsoc-accent)]';
      case 'advanced': return 'bg-[var(--dsoc-pink)]';
      default: return 'bg-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-[var(--dsoc-success)]';
      case 'in-progress': return 'bg-[var(--dsoc-accent)]';
      case 'completed': return 'bg-[var(--dsoc-purple)]';
      default: return 'bg-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDeadlinePassed = project ? new Date() > new Date(project.applicationDeadline) : false;
  const spotsRemaining = project ? project.maxMentees - (project.selectedMentees?.length || 0) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DSOCNavbar />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-[var(--dsoc-primary)] border-t-transparent animate-spin" />
            <p className="mt-4 text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <DSOCNavbar />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-[var(--dsoc-pink)] mb-4" />
            <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'The project you\'re looking for doesn\'t exist.'}</p>
            <Link href="/dsoc/projects" className="neo-brutal-btn neo-brutal-btn-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DSOCNavbar />
      {/* Header */}
      <section className={`pt-24 pb-12 ${getDifficultyColor(project.difficulty)}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/dsoc/projects" 
            className="inline-flex items-center gap-2 text-[var(--dsoc-dark)] font-bold mb-6 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </Link>
          
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="neo-brutal-badge bg-white text-[var(--dsoc-dark)]">
                  {project.organization}
                </span>
                <span className={`neo-brutal-badge ${getStatusColor(project.status)} text-[var(--dsoc-dark)]`}>
                  {project.status}
                </span>
                <span className="neo-brutal-badge bg-[var(--dsoc-secondary)] text-white">
                  {project.difficulty}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--dsoc-dark)] mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-[var(--dsoc-dark)] opacity-80 max-w-3xl">
                {project.description}
              </p>
            </div>
            
            <div className="flex gap-3">
              <a 
                href={project.repositoryUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="neo-brutal-btn bg-[var(--dsoc-dark)] text-white"
              >
                <Github className="w-5 h-5 mr-2" />
                Repository
              </a>
              {project.websiteUrl && (
                <a 
                  href={project.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="neo-brutal-btn bg-white text-[var(--dsoc-dark)]"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Technologies */}
              <div className="neo-brutal-card p-6">
                <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-[var(--dsoc-primary)]" />
                  Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="neo-brutal-badge bg-[var(--dsoc-secondary)] text-white">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Long Description */}
              {project.longDescription && (
                <div className="neo-brutal-card p-6">
                  <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[var(--dsoc-primary)]" />
                    About This Project
                  </h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{project.longDescription}</p>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {project.requirements && project.requirements.length > 0 && (
                <div className="neo-brutal-card p-6">
                  <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-[var(--dsoc-success)]" />
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {project.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[var(--dsoc-success)] border-2 border-[var(--dsoc-dark)] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-4 h-4 text-[var(--dsoc-dark)]" />
                        </div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Learning Outcomes */}
              {project.learningOutcomes && project.learningOutcomes.length > 0 && (
                <div className="neo-brutal-card p-6">
                  <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-[var(--dsoc-purple)]" />
                    What You&apos;ll Learn
                  </h2>
                  <ul className="space-y-3">
                    {project.learningOutcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[var(--dsoc-purple)] border-2 border-[var(--dsoc-dark)] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-bold text-xs">{i + 1}</span>
                        </div>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Milestones */}
              {project.milestones && project.milestones.length > 0 && (
                <div className="neo-brutal-card p-6">
                  <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-[var(--dsoc-accent)]" />
                    Project Milestones
                  </h2>
                  <div className="space-y-4">
                    {project.milestones.map((milestone, i) => (
                      <div 
                        key={i} 
                        className={`p-4 border-4 border-[var(--dsoc-dark)] dark:border-[var(--dsoc-light)] ${
                          milestone.completed ? 'bg-[var(--dsoc-success)]/20' : 'bg-background'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold flex items-center gap-2">
                              {milestone.completed && (
                                <CheckCircle className="w-5 h-5 text-[var(--dsoc-success)]" />
                              )}
                              {milestone.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">{milestone.description}</p>
                          </div>
                          {milestone.dueDate && (
                            <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                              {formatDate(milestone.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mentors */}
              <div className="neo-brutal-card p-6">
                <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-[var(--dsoc-secondary)]" />
                  Mentors
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.mentors.map((mentor) => (
                    <div key={mentor._id} className="p-4 border-4 border-[var(--dsoc-dark)] dark:border-[var(--dsoc-light)] bg-background">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-[var(--dsoc-primary)] border-4 border-[var(--dsoc-dark)] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                          {mentor.picture ? (
                            <img src={mentor.picture} alt={mentor.name} className="w-full h-full object-cover" />
                          ) : (
                            mentor.name.charAt(0)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg">{mentor.name}</h3>
                          {mentor.jobTitle && (
                            <p className="text-sm text-muted-foreground">
                              {mentor.jobTitle}
                              {mentor.company && ` @ ${mentor.company}`}
                            </p>
                          )}
                          {mentor.bio && (
                            <p className="text-sm mt-2 line-clamp-2">{mentor.bio}</p>
                          )}
                          <div className="flex gap-2 mt-3">
                            {mentor.github && (
                              <a 
                                href={mentor.github} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-[var(--dsoc-dark)] dark:bg-[var(--dsoc-light)] flex items-center justify-center hover:opacity-70 transition-opacity"
                              >
                                <Github className="w-4 h-4 text-white dark:text-[var(--dsoc-dark)]" />
                              </a>
                            )}
                            {mentor.linkedin && (
                              <a 
                                href={mentor.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-[var(--dsoc-secondary)] flex items-center justify-center hover:opacity-70 transition-opacity"
                              >
                                <Linkedin className="w-4 h-4 text-white" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <div className="neo-brutal-card p-6 sticky top-24">
                <h2 className="text-xl font-black mb-4">Apply to This Project</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-bold flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {project.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Spots Available</span>
                    <span className="font-bold flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {spotsRemaining} / {project.maxMentees}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className={`font-bold ${isDeadlinePassed ? 'text-[var(--dsoc-pink)]' : ''}`}>
                      {formatDate(project.applicationDeadline)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="font-bold">{formatDate(project.startDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">End Date</span>
                    <span className="font-bold">{formatDate(project.endDate)}</span>
                  </div>
                </div>

                {project.status === 'open' && !isDeadlinePassed && spotsRemaining > 0 ? (
                  <Link 
                    href={`/dsoc/apply/${project._id}`}
                    className="neo-brutal-btn neo-brutal-btn-primary w-full"
                  >
                    Apply Now
                  </Link>
                ) : (
                  <button 
                    disabled 
                    className="neo-brutal-btn bg-gray-300 text-gray-600 w-full cursor-not-allowed"
                  >
                    {isDeadlinePassed ? 'Deadline Passed' : 
                     spotsRemaining <= 0 ? 'No Spots Available' : 
                     'Applications Closed'}
                  </button>
                )}

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By applying, you agree to commit {project.duration} to this project
                </p>
              </div>

              {/* Discord Card */}
              <div className="neo-brutal-card p-6 bg-[var(--dsoc-purple)]">
                <div className="text-black">
                  <MessageCircle className="w-8 h-8 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Have Questions?</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Join our Discord to chat with mentors and other mentees
                  </p>
                  <a 
                    href="https://discord.com/invite/Cy7Rgkf4Up" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="neo-brutal-btn bg-white text-[var(--dsoc-purple)] w-full"
                  >
                    Join Discord
                  </a>
                </div>
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="neo-brutal-card p-6">
                  <h3 className="font-bold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="neo-brutal-badge bg-gray-200 dark:bg-gray-700 text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
