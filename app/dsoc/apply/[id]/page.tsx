'use client';

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useForm } from "react-hook-form";
import { 
  ArrowLeft,
  ArrowRight,
  Send,
  AlertCircle,
  CheckCircle,
  User,
  FileText,
  Briefcase,
  Clock,
  Github,
  ExternalLink,
  Calendar,
  Sparkles
} from "lucide-react";
import "../../styles.css";
import DSOCNavbar from "../../components/DSOCNavbar";

interface Project {
  _id: string;
  title: string;
  organization: string;
  description: string;
  difficulty: string;
  duration: string;
  technologies: string[];
  applicationDeadline: string;
  mentors?: { name: string; company?: string }[];
}

type ApplicationFormValues = {
  discordUsername: string;
  discordJoined: boolean;
  whyThisProject: string;
  motivation: string;
  relevantExperience: string;
  technicalSkills: string;
  portfolioLinks: string;
  githubProfile: string;
  previousContributions: string;
  proposal: string;
  timeline: string;
  expectedLearnings: string;
  challenges: string;
  availability: string;
  timezone: string;
  startDate: string;
  coverLetter: string;
};

const STEPS = [
  { id: 1, title: 'About You', icon: User, description: 'Your background' },
  { id: 2, title: 'Experience', icon: Briefcase, description: 'Skills & projects' },
  { id: 3, title: 'Proposal', icon: FileText, description: 'Your approach' },
  { id: 4, title: 'Availability', icon: Clock, description: 'Time commitment' },
];

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isMentee, setIsMentee] = useState<boolean | null>(null);
  const [showDiscordPrompt, setShowDiscordPrompt] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<ApplicationFormValues>({
    defaultValues: {
      discordUsername: '',
      discordJoined: false,
      whyThisProject: '',
      motivation: '',
      relevantExperience: '',
      technicalSkills: '',
      portfolioLinks: '',
      githubProfile: '',
      previousContributions: '',
      proposal: '',
      timeline: '',
      expectedLearnings: '',
      challenges: '',
      availability: '',
      timezone: '',
      startDate: '',
      coverLetter: '',
    },
    mode: 'onBlur',
  });

  const availabilityValue = watch('availability');
  const discordJoinedValue = watch('discordJoined');

  const stepFields: Record<number, (keyof ApplicationFormValues)[]> = {
    1: ['discordUsername', 'discordJoined', 'whyThisProject', 'motivation'],
    2: ['relevantExperience', 'technicalSkills', 'githubProfile', 'portfolioLinks'],
    3: ['proposal', 'timeline', 'expectedLearnings'],
    4: ['availability', 'timezone'],
  };

  useEffect(() => {
    fetchProject();
  }, [resolvedParams.id]);

  useEffect(() => {
    checkMenteeSession();
  }, []);

  const checkMenteeSession = async () => {
    try {
      const res = await fetch('/api/dsoc/mentee/me', { credentials: 'include' });
      const data = await res.json();
      setIsMentee(Boolean(data?.success));
    } catch (err) {
      console.error('Error checking mentee session:', err);
      setIsMentee(false);
    }
  };

  const validateUrl = (value: string) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const validateUrlList = (value: string) => {
    if (!value) return true;
    const entries = value
      .split(/[\n,]+/)
      .map((entry) => entry.trim())
      .filter(Boolean);
    if (entries.length === 0) return true;
    return entries.every(validateUrl) || 'Enter a valid URL.';
  };

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/dsoc/projects/${resolvedParams.id}`);
      const data = await res.json();
      
      if (data.success) {
        setProject(data.data);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep < STEPS.length) {
      const fields = stepFields[currentStep] || [];
      const isValid = await trigger(fields);
      if (!isValid) {
        setError('Please fix the highlighted fields.');
        return;
      }
      setError('');
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (values: ApplicationFormValues) => {
    setError('');
    setSubmitting(true);

    if (!isMentee) {
      setError('Please login as a mentee to apply.');
      setSubmitting(false);
      return;
    }

    const portfolioLinks = values.portfolioLinks
      ? values.portfolioLinks.split(/[\n,]+/).map((link) => link.trim()).filter(Boolean)
      : [];

    try {
      const res = await fetch('/api/dsoc/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: resolvedParams.id,
          ...values,
          portfolioLinks,
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onInvalid = () => {
    setError('Please fix the highlighted fields.');
  };

  const formatDeadline = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isStepAccessible = (stepId: number) => {
    return stepId <= currentStep;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DSOCNavbar />
        <div className="pt-24 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-[var(--dsoc-primary)] border-t-transparent animate-spin" />
            <p className="mt-4 text-muted-foreground">Loading application...</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--dsoc-light)] via-white to-[var(--dsoc-accent)]/20">
        <DSOCNavbar />
        <div className="pt-24 pb-12 flex items-center justify-center min-h-screen">
          <div className="neo-brutal-card p-10 max-w-lg w-full text-center mx-4">
            <div className="w-24 h-24 bg-[var(--dsoc-success)] border-4 border-[var(--dsoc-dark)] flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0_var(--dsoc-dark)]">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-black mb-4">🎉 Application Submitted!</h1>
            <p className="text-lg text-muted-foreground mb-2">Your application for</p>
            <p className="text-xl font-bold text-[var(--dsoc-primary)] mb-6">{project?.title}</p>
            <p className="text-muted-foreground mb-8">
              has been submitted successfully. The mentors will review your application and get back to you via email and Discord.
            </p>
            
            <div className="bg-[var(--dsoc-light)] border-4 border-[var(--dsoc-dark)] p-4 mb-8">
              <h3 className="font-bold mb-2">📌 What&apos;s Next?</h3>
              <ul className="text-sm text-left space-y-2 text-muted-foreground">
                <li>• Join our Discord community for updates</li>
                <li>• Mentors will review applications within 2 weeks</li>
                <li>• You&apos;ll receive an email about your application status</li>
                <li>• Selected candidates will have an interview call</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <Link href="/dsoc/mentee/dashboard" className="neo-brutal-btn neo-brutal-btn-primary w-full">
                View My Applications
              </Link>
              <Link href="/dsoc/projects" className="neo-brutal-btn neo-brutal-btn-secondary w-full">
                Browse More Projects
              </Link>
              <a 
                href="https://discord.com/invite/Cy7Rgkf4Up" 
                target="_blank" 
                rel="noopener noreferrer"
                className="neo-brutal-btn bg-[#5865F2] text-white w-full"
              >
                Join Discord Community
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-background">
        <DSOCNavbar />
        <div className="pt-24 pb-12 flex items-center justify-center min-h-screen">
          <div className="neo-brutal-card p-8 max-w-md w-full text-center mx-4">
            <AlertCircle className="w-16 h-16 mx-auto text-[var(--dsoc-pink)] mb-4" />
            <h1 className="text-2xl font-bold mb-2">Error</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/dsoc/projects" className="neo-brutal-btn neo-brutal-btn-primary">
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--dsoc-light)] via-white to-[var(--dsoc-accent)]/20">
      <DSOCNavbar />

      {showDiscordPrompt && !discordJoinedValue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="neo-brutal-card p-6 max-w-md w-full">
            <h2 className="text-xl font-black mb-2">Join Discord First</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Joining Discord is mandatory before applying. Please join the DSOC Discord and the project channel.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://discord.com/invite/Cy7Rgkf4Up"
                target="_blank"
                rel="noopener noreferrer"
                className="neo-brutal-btn neo-brutal-btn-primary w-full"
              >
                Join Discord
              </a>
              <button
                type="button"
                onClick={() => setShowDiscordPrompt(false)}
                className="neo-brutal-btn neo-brutal-btn-secondary w-full"
              >
                I Joined
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Back Link */}
            <Link 
              href={`/dsoc/projects/${resolvedParams.id}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Project
            </Link>

            {/* Header */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              {/* Project Info Card */}
              <div className="lg:col-span-2">
                <div className="neo-brutal-card p-6 bg-gradient-to-r from-[var(--dsoc-primary)] to-[var(--dsoc-secondary)] text-black">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-sm font-bold opacity-80 uppercase tracking-wider">
                        Applying to
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-black mt-1">
                        {project?.title}
                      </h1>
                    </div>
                    <div className="neo-brutal-badge bg-white text-[var(--dsoc-dark)] text-sm">
                      {project?.difficulty}
                    </div>
                  </div>
                  
                  <p className="opacity-90 mb-4 line-clamp-2">{project?.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {project?.organization}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {project?.duration}
                    </span>
                    {project?.applicationDeadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Deadline: {formatDeadline(project.applicationDeadline)}
                      </span>
                    )}
                  </div>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project?.technologies.slice(0, 6).map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-white/20 rounded text-xs font-bold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Tips Card */}
              <div className="neo-brutal-card p-6 bg-[var(--dsoc-accent)]">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[var(--dsoc-dark)]" />
                  <h3 className="font-black text-[var(--dsoc-dark)]">Application Tips</h3>
                </div>
                <ul className="space-y-3 text-sm text-[var(--dsoc-dark)]">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Be specific about your experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Show understanding of the project</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Include links to your work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Be realistic about timeline</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="neo-brutal-card p-4 mb-8">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (isStepAccessible(step.id)) {
                          setCurrentStep(step.id);
                        }
                      }}
                      disabled={!isStepAccessible(step.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all w-full ${
                        currentStep === step.id 
                          ? 'bg-[var(--dsoc-primary)] text-white' 
                          : currentStep > step.id
                          ? 'bg-[var(--dsoc-success)] text-white'
                          : 'bg-gray-100 text-gray-500'
                      } ${!isStepAccessible(step.id) ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      <div className={`w-10 h-10 flex items-center justify-center border-2 ${
                        currentStep >= step.id ? 'border-white' : 'border-gray-300'
                      }`}>
                        {currentStep > step.id ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="hidden sm:block text-left">
                        <div className="font-bold text-sm">{step.title}</div>
                        <div className="text-xs opacity-70">{step.description}</div>
                      </div>
                    </button>
                    {index < STEPS.length - 1 && (
                      <div className={`hidden md:block h-1 flex-1 mx-2 ${
                        currentStep > step.id ? 'bg-[var(--dsoc-success)]' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
              <div className="neo-brutal-card p-8">
                {isMentee === false && (
                  <div className="p-4 bg-[var(--dsoc-pink)]/10 border-4 border-[var(--dsoc-pink)] text-[var(--dsoc-pink)] mb-6">
                    Please login as a mentee to apply.{' '}
                    <Link href="/dsoc/login" className="font-bold underline">
                      Login
                    </Link>
                    {' '}or{' '}
                    <Link href="/dsoc/register/mentee" className="font-bold underline">
                      apply as a mentee
                    </Link>
                    {' '}first.
                  </div>
                )}
                {error && (
                  <div className="p-4 bg-[var(--dsoc-pink)]/10 border-4 border-[var(--dsoc-pink)] text-[var(--dsoc-pink)] mb-6">
                    {error}
                  </div>
                )}

                {/* Step 1: About You */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="border-b-4 border-[var(--dsoc-dark)] pb-4 mb-6">
                      <h2 className="text-2xl font-black flex items-center gap-2">
                        <User className="w-6 h-6 text-[var(--dsoc-primary)]" />
                        About You
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        Tell us about yourself and why you&apos;re interested
                      </p>
                    </div>

                    <div>
                      <label className="block font-bold text-sm mb-2">
                        Discord Username *
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Use your Discord username (e.g., username or username#1234).
                      </p>
                      <input
                        type="text"
                        {...register('discordUsername', { required: 'This field is required.' })}
                        className="neo-brutal-input"
                        placeholder="yourname or yourname#1234"
                      />
                      {errors.discordUsername?.message && (
                        <p className="mt-2 text-sm font-bold text-[var(--dsoc-pink)]">
                          {errors.discordUsername.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="discordJoined"
                        {...register('discordJoined', { required: 'Please confirm you have joined Discord.' })}
                        className="mt-1 h-4 w-4"
                      />
                      <div>
                        <label htmlFor="discordJoined" className="block font-bold text-sm">
                          I have joined the DSOC Discord and the project channel *
                        </label>
                        <p className="text-sm text-muted-foreground">
                          This is required before you can apply.
                        </p>
                        {errors.discordJoined?.message && (
                          <p className="mt-2 text-sm font-bold text-[var(--dsoc-pink)]">
                            {errors.discordJoined.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-sm mb-2">
                        Why are you interested in this project? *
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        What specifically attracted you to this project? What problems does it solve that excite you?
                      </p>
                      <textarea
                        {...register('whyThisProject', { required: 'This field is required.' })}
                        rows={5}
                        className="neo-brutal-input resize-none"
                        placeholder="I'm drawn to this project because... The problem it solves is important to me since..."
                      />
                      {errors.whyThisProject?.message && (
                        <p className="mt-2 text-sm font-bold text-[var(--dsoc-pink)]">
                          {errors.whyThisProject.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-sm mb-2">
                        What motivates you to participate in DSOC? *
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        What do you hope to gain from this experience?
                      </p>
                      <textarea
                        {...register('motivation', { required: 'This field is required.' })}
                        rows={4}
                        className="neo-brutal-input resize-none"
                        placeholder="My main motivation is... I want to grow as a developer by..."
                      />
                      {errors.motivation?.message && (
                        <p className="mt-2 text-sm font-bold text-[var(--dsoc-pink)]">
                          {errors.motivation.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Experience */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="border-b-4 border-[var(--dsoc-dark)] pb-4 mb-6">
                      <h2 className="text-2xl font-black flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-[var(--dsoc-secondary)]" />
                        Your Experience
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        Share your relevant skills and past work
                      </p>
                    </div>

                    <div>
                      <label className="block font-bold text-sm mb-2">
                        Relevant Technical Experience *
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Describe your experience with {project?.technologies.slice(0, 3).join(', ')} or similar technologies
                      </p>
                      <textarea
                        {...register('relevantExperience', { required: 'This field is required.' })}
                        rows={5}
                        className="neo-brutal-input resize-none"
                        placeholder="I have worked with these technologies on... My most relevant project was..."
                      />
                      {errors.relevantExperience?.message && (
                        <p className="mt-2 text-sm font-bold text-[var(--dsoc-pink)]">
                          {errors.relevantExperience.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-sm mb-2">
                        Technical Skills *
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        List your programming languages, frameworks, and tools (comma-separated)
                      </p>
                      <textarea
                        {...register('technicalSkills', { required: 'This field is required.' })}
                        rows={2}
                        className="neo-brutal-input resize-none"
                        placeholder="JavaScript, TypeScript, React, Node.js, PostgreSQL, Git..."
                      />
                      {errors.technicalSkills?.message && (
                        <p className="mt-2 text-sm font-bold text-[var(--dsoc-pink)]">
                          {errors.technicalSkills.message}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-bold text-sm mb-2">
                          <Github className="w-4 h-4 inline mr-1" />
                          GitHub Profile *
                        </label>
                        <input
                          type="url"
                          {...register('githubProfile', {
                            required: 'This field is required.',
                            validate: (value) => validateUrl(value) || 'Enter a valid URL.',
                          })}
                          className="neo-brutal-input"
                          placeholder="https://github.com/username"
                        />
                        {errors.githubProfile?.message && (
                          <p className="mt-2 text-sm font-bold text-[var(--dsoc-pink)]">
                            {errors.githubProfile.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block font-bold text-sm mb-2">
                          <ExternalLink className="w-4 h-4 inline mr-1" />
                          Portfolio / Website
                        </label>
                        <input
                          type="url"
                          {...register('portfolioLinks', { validate: validateUrlList })}
                          className="neo-brutal-input"
                          placeholder="https://yourportfolio.com"
                        />
                        {errors.portfolioLinks?.message && (
                          <p className="mt-2 text-sm font-bold text-[var(--dsoc-pink)]">
                            {errors.portfolioLinks.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-sm mb-2">
                        Previous Open Source Contributions
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Have you contributed to open source before? Share links or describe your contributions.
                      </p>
                      <textarea
                        {...register('previousContributions')}
                        rows={3}
                        className="neo-brutal-input resize-none"
                        placeholder="I contributed to... (or 'This will be my first open source contribution!')"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Proposal */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="border-b-4 border-[var(--dsoc-dark)] pb-4 mb-6">
                      <h2 className="text-2xl font-black flex items-center gap-2">
                        <FileText className="w-6 h-6 text-[var(--dsoc-purple)]" />
                        Your Proposal
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        Describe your approach and understanding of the project
                      </p>
                    </div>

                    <div>
                      <label className="block font-bold text-sm mb-2">
                        Project Proposal *
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        How would you approach this project? Describe your understanding and planned implementation.
                      </p>
                      <textarea
                        {...register('proposal', { required: 'This field is required.' })}
                        rows={8}
                        className="neo-brutal-input resize-none"
                        placeholder="My understanding of this project is... I would approach it by... The key features I would implement are..."
                      />
                      {errors.proposal?.message && (
                        <p className="mt-2 text-sm font-bold text-[var(--dsoc-pink)]">
                          {errors.proposal.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-sm mb-2">
                        Proposed Timeline *
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Break down the project into phases/milestones. Be realistic about what you can achieve.
                      </p>
                      <textarea
                        {...register('timeline', { required: 'This field is required.' })}
                        rows={6}
                        className="neo-brutal-input resize-none"
                        placeholder="Week 1-2: Setup and research...&#10;Week 3-4: Core feature implementation...&#10;Week 5-6: Testing and refinement..."
                      />
                      {errors.timeline?.message && (
                        <p className="mt-2 text-sm font-bold text-[var(--dsoc-pink)]">
                          {errors.timeline.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-sm mb-2">
                        Expected Learnings *
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        What technical skills or knowledge do you hope to gain?
                      </p>
                      <textarea
                        {...register('expectedLearnings', { required: 'This field is required.' })}
                        rows={3}
                        className="neo-brutal-input resize-none"
                        placeholder="Through this project, I hope to learn... I want to improve my skills in..."
                      />
                      {errors.expectedLearnings?.message && (
                        <p className="mt-2 text-sm font-bold text-[var(--dsoc-pink)]">
                          {errors.expectedLearnings.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-sm mb-2">
                        Potential Challenges
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        What challenges do you anticipate? How would you overcome them?
                      </p>
                      <textarea
                        {...register('challenges')}
                        rows={3}
                        className="neo-brutal-input resize-none"
                        placeholder="Some challenges I foresee are... I would address them by..."
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Availability */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="border-b-4 border-[var(--dsoc-dark)] pb-4 mb-6">
                      <h2 className="text-2xl font-black flex items-center gap-2">
                        <Clock className="w-6 h-6 text-[var(--dsoc-accent)]" />
                        Availability & Commitment
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        Let us know about your time commitment
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-bold text-sm mb-2">
                          Weekly Availability *
                        </label>
                        <p className="text-sm text-muted-foreground mb-3">
                          Hours per week you can dedicate
                        </p>
                        <select
                          {...register('availability', { required: 'This field is required.' })}
                          className="neo-brutal-input"
                        >
                          <option value="">Select availability</option>
                          <option value="10-15 hours/week">10-15 hours/week</option>
                          <option value="15-20 hours/week">15-20 hours/week</option>
                          <option value="20-25 hours/week">20-25 hours/week</option>
                          <option value="25-30 hours/week">25-30 hours/week</option>
                          <option value="30+ hours/week">30+ hours/week (Full-time)</option>
                        </select>
                        {errors.availability?.message && (
                          <p className="mt-2 text-sm font-bold text-[var(--dsoc-pink)]">
                            {errors.availability.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-bold text-sm mb-2">
                          Your Timezone *
                        </label>
                        <p className="text-sm text-muted-foreground mb-3">
                          For scheduling calls with mentors
                        </p>
                        <select
                          {...register('timezone', { required: 'This field is required.' })}
                          className="neo-brutal-input"
                        >
                          <option value="">Select timezone</option>
                          <option value="UTC-08:00">UTC-08:00 (Pacific Time)</option>
                          <option value="UTC-05:00">UTC-05:00 (Eastern Time)</option>
                          <option value="UTC+00:00">UTC+00:00 (London)</option>
                          <option value="UTC+01:00">UTC+01:00 (Central Europe)</option>
                          <option value="UTC+05:00">UTC+05:00 (Pakistan)</option>
                          <option value="UTC+05:30">UTC+05:30 (India)</option>
                          <option value="UTC+08:00">UTC+08:00 (Singapore/China)</option>
                          <option value="UTC+09:00">UTC+09:00 (Japan/Korea)</option>
                        </select>
                        {errors.timezone?.message && (
                          <p className="mt-2 text-sm font-bold text-[var(--dsoc-pink)]">
                            {errors.timezone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-sm mb-2">
                        Earliest Start Date
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        When can you start working on the project?
                      </p>
                      <input
                        type="date"
                        {...register('startDate')}
                        className="neo-brutal-input"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-sm mb-2">
                        Additional Information (Cover Letter)
                      </label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Anything else you&apos;d like the mentors to know about you?
                      </p>
                      <textarea
                        {...register('coverLetter')}
                        rows={4}
                        className="neo-brutal-input resize-none"
                        placeholder="I'd also like to mention that... Feel free to share your story!"
                      />
                    </div>

                    {/* Summary Box */}
                    <div className="bg-[var(--dsoc-light)] border-4 border-[var(--dsoc-dark)] p-6 mt-8">
                      <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[var(--dsoc-success)]" />
                        Ready to Submit?
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        By submitting this application, you confirm that all information provided is accurate and you commit to actively participating in DSOC 2026 if selected.
                      </p>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                          <li>✓ You understand this is a commitment of {availabilityValue || 'X hours/week'}</li>
                        <li>✓ You will communicate regularly with your mentor</li>
                        <li>✓ You agree to the DSOC Code of Conduct</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-200">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="neo-brutal-btn neo-brutal-btn-secondary"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Previous
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < STEPS.length ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="neo-brutal-btn neo-brutal-btn-primary"
                    >
                      Next Step
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting || isMentee === false}
                      className="neo-brutal-btn neo-brutal-btn-accent text-lg px-8"
                    >
                      {submitting ? (
                        'Submitting...'
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          {isMentee === false ? 'Login to Apply' : 'Submit Application'}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
