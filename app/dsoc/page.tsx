'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Code2, 
  Users, 
  Calendar, 
  GitBranch, 
  Rocket, 
  Trophy,
  Github,
  MessageCircle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  BookOpen,
  Star
} from "lucide-react";
import "./styles.css";
import DSOCNavbar from "./components/DSOCNavbar";

interface Stats {
  projects: { total: number; open: number; inProgress: number; completed: number };
  mentors: number;
  mentees: number;
  applications: number;
  technologies: number;
  topTechnologies: string[];
}

interface Project {
  _id: string;
  title: string;
  description: string;
  organization: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  status: string;
  duration: string;
  featuredImage?: string;
  imageUrl?: string;
  repositoryUrl?: string;
  wikiUrl?: string;
}

// Sample projects to show when API is unavailable
const SAMPLE_PROJECTS: Project[] = [
  {
    _id: 'voiceybill',
    title: 'VoiceyBill',
    description: 'VoiceyBill is an open source AI-powered finance tracker that lets people log income and expenses by voice, receipt scan, or manual entry.\nIt uses Gemini and UpliftAI to classify transactions, supports CSV imports and recurring entries, and keeps the experience fast for multilingual users.\nThe product is designed around a responsive, multi-theme UI with analytics and monthly reports.',
    organization: 'Dev Weekends',
    difficulty: 'intermediate',
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'TypeScript', 'Google Gemini AI', 'UpliftAI', 'Cloudinary', 'Redux Toolkit', 'RTK Query'],
    status: 'open',
    duration: '10-12 weeks',
    imageUrl: '/images/dsoc/voiceybill.png',
    repositoryUrl: 'https://github.com/voiceyBill/voiceyBill-web',
  },
  {
    _id: 'pathment',
    title: 'Pathment',
    description: 'Pathment is a SaaS mentorship platform for organizations that want structured, mentor-guided employee training.\nIt connects mentees with real mentors, uses task-based workflows and progress tracking, and adds gamification to boost engagement and measurable outcomes.',
    organization: 'Dev Weekends',
    difficulty: 'intermediate',
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'Socket.io', 'Tailwind CSS', 'Tiptap', 'Cloudinary'],
    status: 'open',
    duration: '10-12 weeks',
    imageUrl: '/images/dsoc/pathment.png',
    repositoryUrl: 'https://github.com/Sheryar-Ahmed/pathment.git',    
  },
];

// Sample stats to show when API is unavailable
const SAMPLE_STATS: Stats = {
  projects: { total: 2, open: 2, inProgress: 0, completed: 0 },
  mentors: 3,
  mentees: 0,
  applications: 0,
  technologies: 10,
  topTechnologies: ['Next.js', 'NestJS', 'PostgreSQL', 'TypeScript', 'Tailwind CSS']
};

export default function DSOCPage() {
  const [stats, setStats] = useState<Stats | null>(SAMPLE_STATS);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(SAMPLE_PROJECTS);

  useEffect(() => {
    // Fetch stats
    fetch('/api/dsoc/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setStats(data.data);
      })
      .catch(() => {
        // Use sample stats on error
        setStats(SAMPLE_STATS);
      });

    // Fetch featured projects
    fetch('/api/dsoc/projects?status=open&limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setFeaturedProjects(data.data);
        } else {
          setFeaturedProjects(SAMPLE_PROJECTS);
        }
      })
      .catch(() => {
        // Use sample projects on error
        setFeaturedProjects(SAMPLE_PROJECTS);
      });
  }, []);

  const timeline = [
    {
      phase: "Phase 1",
      title: "Contributions Start",
      date: "May 15, 2026",
      description: "Contributors begin onboarding, review project goals with mentors, and prepare their development environment.",
      status: "upcoming"
    },
    {
      phase: "Phase 2",
      title: "Applications Open",
      date: "May 25, 2026",
      description: "Mentee applications begin. Browse projects, connect with mentors, and submit your proposals.",
      status: "upcoming"
    },
    {
      phase: "Phase 3",
      title: "Applications Deadline",
      date: "May 28, 2026",
      description: "Final day to submit mentee applications. Ensure your proposal is complete before the deadline.",
      status: "upcoming"
    },
    {
      phase: "Phase 4",
      title: "Result Announced",
      date: "May 31, 2026",
      description: "Final selections are announced, shortlisted applicants are notified.",
      status: "upcoming"
    },
    {
      phase: "Phase 5",
      title: "Coding Period Begins",
      date: "June 1, 2026",
      description: "The three-month coding period begins. Mentees start project work.",
      status: "upcoming"
    },
    {
      phase: "Phase 6",
      title: "June Milestone Review",
      date: "June 30, 2026",
      description: "At the end of the first month, mentors review progress, verify the milestone, and release the monthly stipend.",
      status: "upcoming"
    },
    {
      phase: "Phase 7",
      title: "July Milestone Review",
      date: "July 31, 2026",
      description: "At the end of the second month, mentors review progress, verify the milestone, and release the monthly stipend.",
      status: "upcoming"
    },
    {
      phase: "Phase 8",
      title: "August Milestone Review",
      date: "August 31, 2026",
      description: "At the end of the third month, mentors review progress, verify the final milestone, and release the last monthly stipend.",
      status: "upcoming"
    }
  ];

  const benefits = [
    {
      icon: Code2,
      title: "Real-World Experience",
      description: "Work on production-level open source projects that make a difference.",
      color: "bg-[var(--dsoc-primary)]"
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      description: "Learn directly from industry professionals and open source maintainers.",
      color: "bg-[var(--dsoc-secondary)]"
    },
    {
      icon: GitBranch,
      title: "Portfolio Building",
      description: "Build an impressive portfolio with real contributions to open source.",
      color: "bg-[var(--dsoc-purple)]"
    },
    {
      icon: MessageCircle,
      title: "Community Support",
      description: "Join our Discord community for networking and peer support.",
      color: "bg-[var(--dsoc-success)]"
    },
    {
      icon: Trophy,
      title: "Recognition",
      description: "Get certificates, swag, and recognition for your contributions.",
      color: "bg-[var(--dsoc-pink)]"
    },
    {
      icon: Rocket,
      title: "Career Launch",
      description: "Many past participants have landed jobs at top tech companies.",
      color: "bg-[var(--dsoc-accent)]"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* DSOC Navigation */}
      <DSOCNavbar />

      {/* Hero Section */}
      <section className="dsoc-hero-new min-h-[90vh] flex items-center justify-center relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="dsoc-hero-grid" />
        
        {/* Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="dsoc-shape dsoc-shape-1" />
          <div className="dsoc-shape dsoc-shape-2" />
          <div className="dsoc-shape dsoc-shape-3" />
          <div className="dsoc-shape dsoc-shape-4" />
          <div className="dsoc-shape dsoc-shape-5" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-block mb-8">
              <div className="neo-brutal-badge bg-[var(--dsoc-primary)] text-white px-6 py-2 text-base font-bold">
                <Zap className="w-5 h-5 mr-2" />
                DSOC 2026 — Applications Open March 2026
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span 
                className="block text-[var(--dsoc-dark)]"
                style={{
                  textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 3px 3px 0 var(--dsoc-dark)'
                }}
              >
                DEV WEEKENDS
              </span>
              <span className="block text-[var(--dsoc-primary)]" style={{textShadow: '3px 3px 0 var(--dsoc-dark)'}}>SUMMER OF CODE</span>
            </h1>
            
            {/* Subtitle with text outline for readability */}
            <div className="mb-8 max-w-2xl mx-auto">
              <p 
                className="text-xl sm:text-2xl font-black text-[var(--dsoc-dark)]"
                style={{
                  textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 2px 2px 0 rgba(0,0,0,0.1)'
                }}
              >
                An intensive open source program connecting aspiring developers with expert mentors 
                on real-world projects.
              </p>
              <p 
                className="text-xl sm:text-2xl font-black text-[var(--dsoc-dark)]"
                style={{
                  textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 2px 2px 0 rgba(0,0,0,0.1)'
                }}
              >
                Learn, build, and grow with the community. 🚀
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/dsoc/projects" className="neo-brutal-btn neo-brutal-btn-accent text-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Projects
              </Link>
              <Link href="/dsoc/register/mentee" className="neo-brutal-btn neo-brutal-btn-primary text-lg">
                <Rocket className="w-5 h-5 mr-2" />
                Apply as Mentee
              </Link>
              {/* <Link href="/dsoc/register/mentor" className="neo-brutal-btn neo-brutal-btn-secondary text-lg">
                <Users className="w-5 h-5 mr-2" />
                Become a Mentor
              </Link> */}
            </div>
            
            {/* Quick Links */}
            {/* <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="https://github.com/devweekends" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--dsoc-dark)] text-white px-4 py-2 font-bold border-3 border-[var(--dsoc-dark)] hover:bg-[var(--dsoc-dark)]/90 transition-colors"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
              <a 
                href="https://github.com/devweekends/dsoc/wiki" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--dsoc-purple)] text-white px-4 py-2 font-bold border-3 border-[var(--dsoc-dark)] hover:bg-[var(--dsoc-purple)]/90 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Wiki & Docs
              </a>
              <a 
                href="https://discord.com/invite/Cy7Rgkf4Up" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--dsoc-secondary)] text-white px-4 py-2 font-bold border-3 border-[var(--dsoc-dark)] hover:bg-[var(--dsoc-secondary)]/90 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Discord
              </a>
            </div> */}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-4 border-[var(--dsoc-dark)] rounded-full flex justify-center bg-white/50">
            <div className="w-2 h-3 bg-[var(--dsoc-primary)] rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[var(--dsoc-light)] dark:bg-[var(--dsoc-dark)] dsoc-grid-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="dsoc-stat-card text-center">
              <div className="text-4xl sm:text-5xl font-black text-[var(--dsoc-primary)]">
                {stats?.projects.total || '20+'}
              </div>
              <div className="dsoc-stat-label text-sm font-bold uppercase tracking-wider mt-2">
                Projects
              </div>
            </div>
            <div className="dsoc-stat-card text-center">
              <div className="text-4xl sm:text-5xl font-black text-[var(--dsoc-secondary)]">
                {stats?.mentors || '15+'}
              </div>
              <div className="dsoc-stat-label text-sm font-bold uppercase tracking-wider mt-2">
                Mentors
              </div>
            </div>
            <div className="dsoc-stat-card text-center">
              <div className="text-4xl sm:text-5xl font-black text-[var(--dsoc-purple)]">
                {stats?.mentees || '50+'}
              </div>
              <div className="dsoc-stat-label text-sm font-bold uppercase tracking-wider mt-2">
                Mentees
              </div>
            </div>
            <div className="dsoc-stat-card text-center">
              <div className="text-4xl sm:text-5xl font-black text-[var(--dsoc-success)]">
                {stats?.technologies || '30+'}
              </div>
              <div className="dsoc-stat-label text-sm font-bold uppercase tracking-wider mt-2">
                Technologies
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is DSOC Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="dsoc-section-title dsoc-what-title text-4xl sm:text-5xl font-black mb-6 text-[var(--dsoc-dark)]">
                WHAT IS DSOC?
              </h2>
              <div className="space-y-4 text-lg">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Dev Weekends Summer of Code (DSOC)</strong> is a 
                  community-driven program inspired by Google Summer of Code and LFX Mentorship.
                </p>
                <p className="text-muted-foreground">
                  We connect passionate student developers with experienced mentors to work on 
                  meaningful open source projects. Whether you&apos;re looking to build your first 
                  open source contribution or mentor the next generation of developers, DSOC 
                  has a place for you.
                </p>
                <p className="text-muted-foreground">
                  Unlike traditional programs, we focus on accessibility - no complex application 
                  processes, no geographic restrictions, just pure learning and contribution.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/dsoc/projects" className="neo-brutal-btn neo-brutal-btn-primary">
                  Explore Projects
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="neo-brutal-card p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[var(--dsoc-primary)] border-4 border-[var(--dsoc-dark)] flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Project-Based Learning</h3>
                      <p className="text-muted-foreground">Work on real projects with real impact</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[var(--dsoc-secondary)] border-4 border-[var(--dsoc-dark)] flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">1-on-1 Mentorship</h3>
                      <p className="text-muted-foreground">Direct guidance from industry experts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[var(--dsoc-purple)] border-4 border-[var(--dsoc-dark)] flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Discord Community</h3>
                      <p className="text-muted-foreground">24/7 peer support and networking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[var(--dsoc-light)] dark:bg-[var(--dsoc-dark)] dsoc-grid-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="dsoc-section-title text-4xl sm:text-5xl font-black mb-4 text-[var(--dsoc-dark)] dark:text-white">
              WHY JOIN DSOC?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              More than just coding - it&apos;s a launchpad for your tech career
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="neo-brutal-card p-6">
                <div className={`w-14 h-14 ${benefit.color} border-4 border-[var(--dsoc-dark)] dark:border-[var(--dsoc-light)] flex items-center justify-center mb-4`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="dsoc-section-title text-4xl sm:text-5xl font-black mb-4">
              PROGRAM TIMELINE
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mark your calendars for DSOC 2026
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="relative pl-8 pb-12 border-l-4 border-[var(--dsoc-dark)] dark:border-[var(--dsoc-light)] last:pb-0">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-[var(--dsoc-primary)] border-4 border-[var(--dsoc-dark)] dark:border-[var(--dsoc-light)] flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{index + 1}</span>
                </div>
                <div className="neo-brutal-card p-6 ml-4">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="neo-brutal-badge bg-[var(--dsoc-accent)]">{item.phase}</span>
                    <span className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-[var(--dsoc-light)] dark:bg-[var(--dsoc-dark)] dsoc-grid-pattern">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="dsoc-section-title text-4xl sm:text-5xl font-black mb-4 text-[var(--dsoc-dark)] dark:text-white">
                FEATURED PROJECTS
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Check out some of the exciting projects waiting for contributors
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {featuredProjects.map((project) => (
                <Link key={project._id} href={`/dsoc/projects/${project._id}`}>
                  <div className="dsoc-project-card h-full group">
                    {/* Project Image */}
                    {(project.featuredImage || project.imageUrl) && (
                      <div className="relative overflow-hidden border-b-4 border-[var(--dsoc-dark)]">
                        <img 
                          src={project.featuredImage || project.imageUrl} 
                          alt={project.title}
                          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="neo-brutal-badge bg-[var(--dsoc-success)] text-[var(--dsoc-dark)] text-xs font-bold">
                            OPEN FOR APPLICATIONS
                          </span>
                        </div>
                      </div>
                    )}
                    <div className={`dsoc-project-card-header ${
                      project.difficulty === 'beginner' ? 'bg-[var(--dsoc-success)]' :
                      project.difficulty === 'intermediate' ? 'bg-[var(--dsoc-accent)]' :
                      'bg-[var(--dsoc-pink)]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold uppercase text-sm tracking-wider text-[var(--dsoc-dark)]">
                          {project.organization}
                        </span>
                        <span className={`neo-brutal-badge text-xs border-2 border-[var(--dsoc-dark)] ${
                          project.difficulty === 'beginner' ? 'bg-[var(--dsoc-success)]' :
                          project.difficulty === 'intermediate' ? 'bg-[var(--dsoc-accent)]' :
                          'bg-[var(--dsoc-pink)]'
                        } text-[var(--dsoc-dark)]`}>
                          {project.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="dsoc-project-card-body">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--dsoc-primary)] transition-colors">{project.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
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
                      <div className="flex items-center justify-between border-t-2 border-[var(--dsoc-dark)]/20 pt-4 mt-auto">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {project.duration}
                        </div>
                        <div className="flex gap-2">
                          {project.repositoryUrl && (
                            <button 
                              type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(project.repositoryUrl, '_blank'); }}
                              className="inline-flex items-center gap-1 text-sm font-bold text-[var(--dsoc-dark)] hover:text-[var(--dsoc-primary)] transition-colors"
                            >
                              <Github className="w-4 h-4" />
                              GitHub
                            </button>
                          )}
                          {project.wikiUrl && (
                            <button 
                              type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(project.wikiUrl, '_blank'); }}
                              className="inline-flex items-center gap-1 text-sm font-bold text-[var(--dsoc-purple)] hover:text-[var(--dsoc-primary)] transition-colors"
                            >
                              <BookOpen className="w-4 h-4" />
                              Wiki
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/dsoc/projects" className="neo-brutal-btn neo-brutal-btn-primary text-lg">
                View All Projects
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="dsoc-section-title text-4xl sm:text-5xl font-black mb-4">
              HOW IT WORKS
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to start your open source journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* For Mentees */}
            <div className="neo-brutal-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[var(--dsoc-primary)] border-4 border-[var(--dsoc-dark)] flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black">FOR MENTEES</h3>
              </div>
              <ol className="space-y-4">
                {[
                  "Create your profile and join our Discord",
                  "Browse projects and find one that excites you",
                  "Submit your application with a proposal",
                  "Get selected and bond with your mentor",
                  "Code, learn, and contribute for 3 months",
                  "Complete your project and get certified"
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[var(--dsoc-accent)] border-3 border-[var(--dsoc-dark)] flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-sm">{i + 1}</span>
                    </div>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
              <Link href="/dsoc/register/mentee" className="neo-brutal-btn neo-brutal-btn-primary w-full mt-6">
                Apply as Mentee
              </Link>
            </div>
            
            {/* For Mentors */}
            <div className="neo-brutal-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[var(--dsoc-secondary)] border-4 border-[var(--dsoc-dark)] flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black">FOR MENTORS</h3>
              </div>
              <ol className="space-y-4">
                {[
                  "Register and get verified as a mentor",
                  "Submit your project idea with details",
                  "Review applications from mentees",
                  "Select your mentee(s) for the project",
                  "Guide them through weekly check-ins",
                  "Evaluate and celebrate their success"
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[var(--dsoc-success)] border-3 border-[var(--dsoc-dark)] flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-sm">{i + 1}</span>
                    </div>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
              <Link href="/dsoc/register/mentor" className="neo-brutal-btn neo-brutal-btn-secondary w-full mt-6">
                Become a Mentor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-[var(--dsoc-light)] dark:bg-[var(--dsoc-dark)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="dsoc-section-title text-4xl sm:text-5xl font-black mb-4 text-[var(--dsoc-dark)] dark:text-white">
              FAQ
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Who can participate in DSOC?",
                a: "Anyone! Students, professionals, and hobbyists from anywhere in the world can apply as mentees. We especially encourage underrepresented groups in tech."
              },
              {
                q: "Is there a stipend for participants?",
                a: "Yes. DSOC is a paid program, and selected participants receive a stipend during the coding period."
              },
              {
                q: "What's the time commitment?",
                a: "Mentees should expect to dedicate 15-20 hours per week. Mentors typically spend 3-5 hours per week on guidance and code reviews."
              },
              {
                q: "Do I need prior open source experience?",
                a: "Not at all! We have projects for all skill levels. Beginner projects are specifically designed for first-time contributors."
              }
            ].map((faq, i) => (
              <div key={i} className="neo-brutal-card p-6">
                <h3 className="font-bold text-lg mb-2 flex items-start gap-3">
                  <Star className="w-5 h-5 text-[var(--dsoc-primary)] flex-shrink-0 mt-1" />
                  {faq.q}
                </h3>
                <p className="text-muted-foreground pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--dsoc-primary)] to-[var(--dsoc-secondary)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl sm:text-5xl font-black mb-6">
            READY TO START YOUR JOURNEY?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of developers who&apos;ve launched their careers through DSOC. 
            Applications for Season 2025 open January 15th!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dsoc/register/mentee" className="neo-brutal-btn neo-brutal-btn-accent text-lg">
              <Rocket className="w-5 h-5 mr-2" />
              Apply Now
            </Link>
            <a 
              href="https://discord.com/invite/Cy7Rgkf4Up" 
              target="_blank" 
              rel="noopener noreferrer"
              className="neo-brutal-btn bg-white text-[var(--dsoc-dark)] text-lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Join Discord
            </a>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-12 border-t-4 border-[var(--dsoc-dark)] dark:border-[var(--dsoc-light)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/dsoc/projects" className="font-bold hover:text-[var(--dsoc-primary)] transition-colors">
              Projects
            </Link>
            <Link href="/dsoc/register/mentee" className="font-bold hover:text-[var(--dsoc-primary)] transition-colors">
              Apply as Mentee
            </Link>
            <Link href="/dsoc/register/mentor" className="font-bold hover:text-[var(--dsoc-primary)] transition-colors">
              Become a Mentor
            </Link>
            <Link href="/dsoc/login" className="font-bold hover:text-[var(--dsoc-primary)] transition-colors">
              Login
            </Link>
            <a 
              href="https://github.com/devweekends" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold hover:text-[var(--dsoc-primary)] transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a 
              href="https://discord.com/invite/Cy7Rgkf4Up" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold hover:text-[var(--dsoc-primary)] transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-4 h-4" /> Discord
            </a>
          </div>
          <p className="text-center text-muted-foreground mt-6">
            DSOC is a program by <Link href="/our-story" className="font-bold text-foreground hover:text-[var(--dsoc-primary)]">Dev Weekends</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
