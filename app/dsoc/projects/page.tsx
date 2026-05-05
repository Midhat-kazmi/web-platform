'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Code2,
  ArrowRight,
  Github,
  ExternalLink,
  X,
  BookOpen
} from "lucide-react";
import "../styles.css";
import DSOCNavbar from "../components/DSOCNavbar";

interface Project {
  _id: string;
  title: string;
  description: string;
  organization: string;
  repositoryUrl: string;
  websiteUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  technologies: string[];
  tags: string[];
  status: string;
  maxMentees: number;
  selectedMentees: string[];
  mentors: {
    _id: string;
    name: string;
    picture?: string;
    company?: string;
    jobTitle?: string;
  }[];
  applicationDeadline: string;
  imageUrl?: string;
  wikiUrl?: string;
}

// Sample projects to show when API is unavailable
const SAMPLE_PROJECTS: Project[] = [
  {
    _id: 'psxworth',
    title: 'PsxWorth - Portfolio Tracking for PSX Investors',
    description: 'PsxWorth helps PSX investors track portfolios clearly and simply. It serves 950+ real users and is designed to support better investment decisions with custom dashboards, themes, and future mutual fund support.',
    organization: 'Dev Weekends',
    repositoryUrl: 'https://github.com/Wajahat43/psxworth',
    websiteUrl: 'https://psxworth.com',
    difficulty: 'advanced',
    duration: '10-12 weeks',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Radix UI', 'Clerk', 'Drizzle ORM', 'PostgreSQL', 'TanStack Query', 'TanStack Table', 'PostHog', 'Upstash Redis', 'AI SDK', 'ApexCharts', 'Recharts', 'React Hook Form', 'Zod', 'NestJS'],
    tags: ['full-stack', 'fintech', 'portfolio-tracking', 'dashboard', 'open-source'],
    status: 'open',
    maxMentees: 3,
    selectedMentees: [],
    mentors: [
      {
        _id: 'mentor-psx-1',
        name: 'Amina Raza',
        picture: undefined,
        company: 'FinTech',
        jobTitle: 'Product Engineer'
      },
      {
        _id: 'mentor-psx-2',
        name: 'Bilal Ahmed',
        picture: undefined,
        company: 'Analytics Platform',
        jobTitle: 'Full-Stack Engineer'
      }
    ],
    applicationDeadline: '2026-05-25',
    imageUrl: '/images/dsoc/psxworth.png',
    wikiUrl: 'https://psxworth.com'
  },
  {
    _id: 'voiceybill-sample',
    title: 'VoiceyBill - AI-Powered Open Source Finance Tracker',
    description: 'Log income and expenses by voice, receipt scan, or manual entry. AI classifies transactions, supports CSV import and recurring entries, and keeps the experience multilingual and fast.',
    organization: 'Dev Weekends',
    repositoryUrl: 'https://github.com/voiceyBill/voiceyBill-web',
    websiteUrl: 'https://voiceybill.vercel.app',
    difficulty: 'advanced',
    duration: '10-12 weeks',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'TypeScript', 'Google Gemini AI', 'UpliftAI', 'Cloudinary', 'Redux Toolkit', 'RTK Query'],
    tags: ['full-stack', 'ai', 'finance', 'voice-input', 'open-source'],
    status: 'open',
    maxMentees: 3,
    selectedMentees: [],
    mentors: [
      {
        _id: 'mentor-voicey-1',
        name: 'Maya Khan',
        company: 'FinTech',
        jobTitle: 'Senior Full-Stack Engineer'
      },
      {
        _id: 'mentor-voicey-2',
        name: 'Omar Ali',
        company: 'AI Products',
        jobTitle: 'Backend Engineer'
      }
    ],
    applicationDeadline: '2026-05-25',
    imageUrl: '/images/dsoc/voiceybill.png',
  },
 {
    _id: 'pathment',
    title: 'Pathment',
    description: 'Pathment is a SaaS mentorship platform for organizations that want structured, mentor-guided employee training.\nIt connects mentees with real mentors, uses task-based workflows and progress tracking, and adds gamification to boost engagement and measurable outcomes.',
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
        company: 'GitHub',
        jobTitle: 'Senior Software Engineer'
      },
      {
        _id: 'mentor-2',
        name: 'Sarah Williams',
        company: 'Vercel',
        jobTitle: 'Staff Engineer'
      }
    ],
    status: 'open',
    maxMentees: 3,
    selectedMentees: [],
    applicationDeadline: '2026-05-25',
    imageUrl: '/images/dsoc/pathment.png',
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    difficulty: '',
    technology: '',
    status: 'open'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [allTechnologies, setAllTechnologies] = useState<string[]>([]);
  const [usingSampleData, setUsingSampleData] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.technology) params.append('technology', filters.technology);
      if (search) params.append('search', search);

      const res = await fetch(`/api/dsoc/projects?${params.toString()}`);
      const data = await res.json();
      
      if (data.success && data.data.length > 0) {
        setProjects(data.data);
        setUsingSampleData(false);
        // Extract unique technologies
        const techs = new Set<string>();
        data.data.forEach((p: Project) => p.technologies.forEach(t => techs.add(t)));
        setAllTechnologies(Array.from(techs).sort());
      } else {
        // Use sample data as fallback
        setProjects(SAMPLE_PROJECTS);
        setUsingSampleData(true);
        const techs = new Set<string>();
        SAMPLE_PROJECTS.forEach((p) => p.technologies.forEach(t => techs.add(t)));
        setAllTechnologies(Array.from(techs).sort());
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Use sample data on error
      setProjects(SAMPLE_PROJECTS);
      setUsingSampleData(true);
      const techs = new Set<string>();
      SAMPLE_PROJECTS.forEach((p) => p.technologies.forEach(t => techs.add(t)));
      setAllTechnologies(Array.from(techs).sort());
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
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

  return (
    <div className="min-h-screen bg-background">
      {/* DSOC Navigation */}
      <DSOCNavbar />
      
      {/* Header */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-[var(--dsoc-secondary)] to-[var(--dsoc-purple)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
              DSOC PROJECTS
            </h1>
            <p className="text-xl opacity-90">
              Find the perfect project to kickstart your open source journey
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 border-b-4 border-[var(--dsoc-dark)] dark:border-[var(--dsoc-light)] bg-[var(--dsoc-light)] dark:bg-[var(--dsoc-dark)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects, technologies, organizations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="neo-brutal-input pl-12"
              />
            </div>
            <button type="submit" className="neo-brutal-btn neo-brutal-btn-primary">
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
            <button 
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="neo-brutal-btn neo-brutal-btn-secondary"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              {(filters.difficulty || filters.technology) && (
                <span className="ml-2 w-6 h-6 bg-[var(--dsoc-accent)] text-[var(--dsoc-dark)] rounded-full text-xs flex items-center justify-center font-bold">
                  {(filters.difficulty ? 1 : 0) + (filters.technology ? 1 : 0)}
                </span>
              )}
            </button>
          </form>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 neo-brutal-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filter Projects</h3>
                <button
                  onClick={() => {
                    setFilters({ difficulty: '', technology: '', status: 'open' });
                    setShowFilters(false);
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-sm mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="neo-brutal-input"
                  >
                    <option value="">All Status</option>
                    <option value="open">Open for Applications</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sm mb-2">Difficulty</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                    className="neo-brutal-input"
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sm mb-2">Technology</label>
                  <select
                    value={filters.technology}
                    onChange={(e) => setFilters({ ...filters, technology: e.target.value })}
                    className="neo-brutal-input"
                  >
                    <option value="">All Technologies</option>
                    {allTechnologies.map((tech) => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-[var(--dsoc-primary)] border-t-transparent animate-spin" />
              <p className="mt-4 text-muted-foreground">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <Code2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">No Projects Found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setFilters({ difficulty: '', technology: '', status: '' });
                }}
                className="neo-brutal-btn neo-brutal-btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing <span className="font-bold text-foreground">{projects.length}</span> projects
                  {usingSampleData && (
                    <span className="ml-2 text-sm text-[var(--dsoc-primary)]">(Sample Projects)</span>
                  )}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project) => (
                  <Link key={project._id} href={`/dsoc/projects/${project._id}`}>
                    <div className="dsoc-project-card h-full flex flex-col group">
                      {/* Project Image */}
                      {project.imageUrl && (
                        <div className="relative overflow-hidden border-b-4 border-[var(--dsoc-dark)]">
                          <img 
                            src={project.imageUrl} 
                            alt={project.title}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-3 right-3 flex gap-2">
                            <span className={`neo-brutal-badge text-xs ${getStatusColor(project.status)} text-[var(--dsoc-dark)]`}>
                              {project.status}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className={`dsoc-project-card-header ${getDifficultyColor(project.difficulty)}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold uppercase text-sm tracking-wider text-[var(--dsoc-dark)]">
                            {project.organization}
                          </span>
                          {!project.imageUrl && (
                            <div className="flex gap-2">
                              <span className={`neo-brutal-badge text-xs ${getStatusColor(project.status)} text-[var(--dsoc-dark)]`}>
                                {project.status}
                              </span>
                            </div>
                          )}
                          <span className={`neo-brutal-badge text-xs ${getDifficultyColor(project.difficulty)} text-[var(--dsoc-dark)] border-2 border-[var(--dsoc-dark)]`}>
                            {project.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="dsoc-project-card-body flex-1 flex flex-col">
                        <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--dsoc-primary)] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                          {project.description}
                        </p>
                        
                        {/* Technologies */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 5).map((tech, i) => (
                            <span key={i} className="neo-brutal-badge bg-[var(--dsoc-secondary)] text-white text-xs">
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 5 && (
                            <span className="neo-brutal-badge bg-gray-200 dark:bg-gray-700 text-xs">
                              +{project.technologies.length - 5}
                            </span>
                          )}
                        </div>
                        
                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground border-t-2 border-[var(--dsoc-dark)] dark:border-[var(--dsoc-light)] pt-4 mt-auto">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {project.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {project.selectedMentees?.length || 0}/{project.maxMentees} spots
                            </span>
                          </div>
                        </div>
                        
                        {/* Mentors */}
                        {project.mentors && project.mentors.length > 0 && (
                          <div className="mt-4 flex items-center gap-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              Mentors:
                            </span>
                            <div className="flex items-center gap-2">
                              {project.mentors.slice(0, 3).map((mentor) => (
                                <div
                                  key={mentor._id}
                                  className="flex items-center gap-1.5"
                                >
                                  <div className="w-6 h-6 bg-[var(--dsoc-primary)] border-2 border-[var(--dsoc-dark)] flex items-center justify-center text-white font-bold text-xs rounded-full">
                                    {mentor.picture ? (
                                      <img src={mentor.picture} alt={mentor.name} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                      mentor.name.charAt(0)
                                    )}
                                  </div>
                                  <span className="text-xs font-medium">{mentor.name.split(' ')[0]}</span>
                                </div>
                              ))}
                              {project.mentors.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{project.mentors.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* GitHub and Wiki Links */}
                        <div className="mt-4 pt-4 border-t-2 border-[var(--dsoc-dark)]/20 flex gap-4">
                          {project.repositoryUrl && (
                            <button 
                              type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(project.repositoryUrl, '_blank'); }}
                              className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--dsoc-dark)] hover:text-[var(--dsoc-primary)] transition-colors"
                            >
                              <Github className="w-4 h-4" />
                              GitHub
                            </button>
                          )}
                          {project.wikiUrl && (
                            <button 
                              type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(project.wikiUrl, '_blank'); }}
                              className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--dsoc-purple)] hover:text-[var(--dsoc-primary)] transition-colors"
                            >
                              <BookOpen className="w-4 h-4" />
                              Wiki
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[var(--dsoc-light)] dark:bg-[var(--dsoc-dark)] border-t-4 border-[var(--dsoc-dark)] dark:border-[var(--dsoc-light)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black mb-4">Don&apos;t see what you&apos;re looking for?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We&apos;re always adding new projects. Join our Discord to get notified when new projects are added, 
            or become a mentor and propose your own project!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://discord.com/invite/32mYcRmy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="neo-brutal-btn neo-brutal-btn-primary"
            >
              Join Discord
            </a>
            <Link href="/dsoc/register/mentor" className="neo-brutal-btn neo-brutal-btn-secondary">
              Propose a Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
