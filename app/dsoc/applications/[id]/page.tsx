'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  MessageCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import '../../styles.css';
import DSOCNavbar from '../../components/DSOCNavbar';

interface ApplicationMentee {
  _id: string;
  name: string;
  email: string;
  university?: string;
  github?: string;
  linkedin?: string;
  picture?: string;
}

interface ApplicationProject {
  _id: string;
  title: string;
  organization?: string;
  status?: string;
}

interface Application {
  _id: string;
  status: string;
  createdAt: string;
  reviewedAt?: string;
  score?: number;
  mentorNotes?: string;
  discordUsername?: string;
  proposal: string;
  coverLetter?: string;
  relevantExperience: string;
  whyThisProject: string;
  availability: string;
  expectedLearnings: string;
  portfolioLinks: string[];
  previousContributions?: string;
  mentee: ApplicationMentee;
  project: ApplicationProject;
}

export default function MentorApplicationReviewPage() {
  const params = useParams<{ id: string }>();
  const applicationId = params?.id;
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [mentorNotes, setMentorNotes] = useState('');
  const [score, setScore] = useState('');

  useEffect(() => {
    if (applicationId) {
      fetchApplication(applicationId);
    }
  }, [applicationId]);

  const fetchApplication = async (id: string) => {
    try {
      const res = await fetch(`/api/dsoc/applications/${id}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to fetch application');
      }
      const data = await res.json();
      if (data.success) {
        setApplication(data.data);
        setMentorNotes(data.data.mentorNotes || '');
        setScore(data.data.score !== undefined ? String(data.data.score) : '');
      } else {
        setError(data.error || 'Failed to fetch application');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch application');
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = async (status?: string) => {
    if (!applicationId) return;
    setSaving(true);
    setError('');

    try {
      const payload: { status?: string; mentorNotes?: string; score?: number } = {
        mentorNotes,
      };

      if (score.trim() !== '') {
        payload.score = Number(score);
      }

      if (status) {
        payload.status = status;
      }

      const res = await fetch(`/api/dsoc/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error || 'Failed to update application');
      }

      setApplication(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const statusBadge = useMemo(() => {
    if (!application) return null;
    const status = application.status;
    const label = status.replace('-', ' ');
    const color =
      status === 'accepted'
        ? 'bg-[var(--dsoc-success)]'
        : status === 'rejected'
        ? 'bg-[var(--dsoc-pink)]'
        : status === 'under-review'
        ? 'bg-[var(--dsoc-secondary)]'
        : 'bg-[var(--dsoc-accent)]';

    return (
      <span className={`neo-brutal-badge ${color} text-[var(--dsoc-dark)]`}>
        {label}
      </span>
    );
  }, [application]);

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

  if (!application) {
    return (
      <div className="min-h-screen bg-background">
        <DSOCNavbar />
        <div className="pt-24 pb-12 flex items-center justify-center">
          <div className="neo-brutal-card p-8 max-w-lg w-full text-center">
            <AlertCircle className="w-12 h-12 text-[var(--dsoc-pink)] mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Application Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'This application is unavailable.'}</p>
            <Link href="/dsoc/mentor/dashboard" className="neo-brutal-btn neo-brutal-btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DSOCNavbar />
      <header className="bg-[var(--dsoc-secondary)] border-b-4 border-[var(--dsoc-dark)] pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-white">
              <Link href="/dsoc/mentor/dashboard" className="inline-flex items-center gap-2 text-white/90 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <span className="text-white/60">/</span>
              <span className="font-bold">Application Review</span>
            </div>
            {statusBadge}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-[var(--dsoc-pink)]/10 border-4 border-[var(--dsoc-pink)] text-[var(--dsoc-pink)]">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="neo-brutal-card p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-black mb-2">{application.project?.title}</h1>
                  <p className="text-muted-foreground">{application.project?.organization || 'Dev Weekends'}</p>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Submitted {formatDate(application.createdAt)}
                </div>
              </div>
            </div>

            <div className="neo-brutal-card p-6">
              <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--dsoc-primary)]" />
                Applicant Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-bold">Name</div>
                  <div className="text-muted-foreground">{application.mentee?.name}</div>
                </div>
                <div>
                  <div className="font-bold">Email</div>
                  <div className="text-muted-foreground">{application.mentee?.email}</div>
                </div>
                {application.mentee?.university && (
                  <div>
                    <div className="font-bold">University</div>
                    <div className="text-muted-foreground">{application.mentee.university}</div>
                  </div>
                )}
                {application.discordUsername && (
                  <div>
                    <div className="font-bold">Discord</div>
                    <div className="text-muted-foreground">{application.discordUsername}</div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {application.mentee?.github && (
                  <a
                    href={application.mentee.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-brutal-btn neo-brutal-btn-secondary py-2 px-4 text-xs"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                )}
                {application.mentee?.linkedin && (
                  <a
                    href={application.mentee.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-brutal-btn neo-brutal-btn-accent py-2 px-4 text-xs"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>

            <div className="neo-brutal-card p-6 space-y-6">
              <div>
                <h3 className="text-lg font-black mb-2">Why This Project</h3>
                <p className="text-muted-foreground whitespace-pre-line">{application.whyThisProject}</p>
              </div>
              <div>
                <h3 className="text-lg font-black mb-2">Relevant Experience</h3>
                <p className="text-muted-foreground whitespace-pre-line">{application.relevantExperience}</p>
              </div>
              <div>
                <h3 className="text-lg font-black mb-2">Proposal</h3>
                <p className="text-muted-foreground whitespace-pre-line">{application.proposal}</p>
              </div>
              {application.expectedLearnings && (
                <div>
                  <h3 className="text-lg font-black mb-2">Expected Learnings</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{application.expectedLearnings}</p>
                </div>
              )}
              {application.coverLetter && (
                <div>
                  <h3 className="text-lg font-black mb-2">Cover Letter</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{application.coverLetter}</p>
                </div>
              )}
              {application.previousContributions && (
                <div>
                  <h3 className="text-lg font-black mb-2">Previous Contributions</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{application.previousContributions}</p>
                </div>
              )}
              {application.portfolioLinks?.length > 0 && (
                <div>
                  <h3 className="text-lg font-black mb-2">Portfolio Links</h3>
                  <div className="flex flex-wrap gap-2">
                    {application.portfolioLinks.map((link, index) => (
                      <a
                        key={link + index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[var(--dsoc-primary)] hover:text-[var(--dsoc-secondary)]"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="neo-brutal-card p-6">
              <h2 className="text-xl font-black mb-4">Review</h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {statusBadge}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-bold">{application.availability}</span>
                </div>
                {application.reviewedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reviewed</span>
                    <span className="font-bold">{formatDate(application.reviewedAt)}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <label className="block text-sm font-bold">Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="neo-brutal-input"
                />
              </div>

              <div className="mt-6 space-y-3">
                <label className="block text-sm font-bold">Mentor Notes</label>
                <textarea
                  value={mentorNotes}
                  onChange={(e) => setMentorNotes(e.target.value)}
                  rows={5}
                  className="neo-brutal-input resize-none"
                  placeholder="Write feedback or notes for other mentors..."
                />
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => updateApplication('under-review')}
                  className="neo-brutal-btn neo-brutal-btn-secondary"
                  disabled={saving}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Mark Under Review
                </button>
                <button
                  type="button"
                  onClick={() => updateApplication('accepted')}
                  className="neo-brutal-btn neo-brutal-btn-success"
                  disabled={saving}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Applicant
                </button>
                <button
                  type="button"
                  onClick={() => updateApplication('rejected')}
                  className="neo-brutal-btn bg-[var(--dsoc-pink)] text-white"
                  disabled={saving}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Applicant
                </button>
                <button
                  type="button"
                  onClick={() => updateApplication()}
                  className="neo-brutal-btn neo-brutal-btn-accent"
                  disabled={saving}
                >
                  Save Notes
                </button>
              </div>
            </div>

            <div className="neo-brutal-card p-6">
              <h3 className="text-lg font-black mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <a
                  href="https://discord.com/invite/Cy7Rgkf4Up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-brutal-btn neo-brutal-btn-primary w-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Open Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
