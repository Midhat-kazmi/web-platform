'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users,
  FileText,
  Code2,
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Eye
} from "lucide-react";
import "../../styles.css";
import DSOCNavbar from "../../components/DSOCNavbar";

interface Project {
  _id: string;
  title: string;
  organization: string;
  status: string;
  selectedMentees: { _id: string; name: string }[];
  maxMentees: number;
}

interface Application {
  _id: string;
  status: string;
  createdAt: string;
  score?: number;
  mentee: {
    _id: string;
    name: string;
    email: string;
    university?: string;
  };
  project: {
    _id: string;
    title: string;
  };
}

export default function MentorDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // In a real implementation, this would fetch mentor's projects and their applications
      const appsRes = await fetch('/api/dsoc/applications');
      const appsData = await appsRes.json();
      
      if (appsData.success) {
        setApplications(appsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/dsoc/mentor/logout', { method: 'POST' });
    router.push('/dsoc/login');
  };

  const handleApplicationAction = async (appId: string, status: 'accepted' | 'rejected') => {
    try {
      const res = await fetch(`/api/dsoc/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-5 h-5 text-[var(--dsoc-success)]" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-[var(--dsoc-pink)]" />;
      case 'pending': return <Clock className="w-5 h-5 text-[var(--dsoc-accent)]" />;
      case 'under-review': return <AlertCircle className="w-5 h-5 text-[var(--dsoc-secondary)]" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-[var(--dsoc-success)]';
      case 'rejected': return 'bg-[var(--dsoc-pink)]';
      case 'pending': return 'bg-[var(--dsoc-accent)]';
      case 'under-review': return 'bg-[var(--dsoc-secondary)]';
      default: return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[var(--dsoc-primary)] border-t-transparent animate-spin" />
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DSOCNavbar />
      {/* Header */}
      <header className="bg-[var(--dsoc-secondary)] border-b-4 border-[var(--dsoc-dark)] pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dsoc" className="text-white font-black text-xl">
                DSOC
              </Link>
              <span className="text-white/60">/</span>
              <span className="text-white font-bold">Mentor Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://discord.com/invite/Cy7Rgkf4Up" 
                target="_blank" 
                rel="noopener noreferrer"
                className="neo-brutal-btn bg-white text-[var(--dsoc-dark)] py-2 px-4 text-sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Discord
              </a>
              <button 
                onClick={handleLogout}
                className="neo-brutal-btn bg-[var(--dsoc-dark)] text-white py-2 px-4 text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="dsoc-stat-card">
            <div className="text-3xl font-black text-[var(--dsoc-secondary)]">
              {projects.length}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mt-1">
              My Projects
            </div>
          </div>
          <div className="dsoc-stat-card">
            <div className="text-3xl font-black text-[var(--dsoc-accent)]">
              {applications.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mt-1">
              Pending Reviews
            </div>
          </div>
          <div className="dsoc-stat-card">
            <div className="text-3xl font-black text-[var(--dsoc-success)]">
              {applications.filter(a => a.status === 'accepted').length}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mt-1">
              Accepted
            </div>
          </div>
          <div className="dsoc-stat-card">
            <div className="text-3xl font-black text-[var(--dsoc-primary)]">
              {applications.length}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mt-1">
              Total Applications
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-0 mb-6">
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-3 px-6 font-bold text-sm uppercase tracking-wider border-4 border-[var(--dsoc-dark)] transition-all ${
              activeTab === 'applications'
                ? 'bg-[var(--dsoc-primary)] text-white'
                : 'bg-background hover:bg-muted'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Applications
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3 px-6 font-bold text-sm uppercase tracking-wider border-4 border-l-0 border-[var(--dsoc-dark)] transition-all ${
              activeTab === 'projects'
                ? 'bg-[var(--dsoc-secondary)] text-white'
                : 'bg-background hover:bg-muted'
            }`}
          >
            <Code2 className="w-4 h-4 inline mr-2" />
            My Projects
          </button>
          <button
            onClick={() => setActiveTab('mentees')}
            className={`py-3 px-6 font-bold text-sm uppercase tracking-wider border-4 border-l-0 border-[var(--dsoc-dark)] transition-all ${
              activeTab === 'mentees'
                ? 'bg-[var(--dsoc-success)] text-white'
                : 'bg-background hover:bg-muted'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            My Mentees
          </button>
        </div>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.filter(a => a.status === 'pending' || a.status === 'under-review').length === 0 ? (
              <div className="neo-brutal-card p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No Pending Applications</h3>
                <p className="text-muted-foreground">
                  New applications will appear here for your review.
                </p>
              </div>
            ) : (
              applications
                .filter(a => a.status === 'pending' || a.status === 'under-review')
                .map((app) => (
                  <div key={app._id} className="neo-brutal-card p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(app.status)}
                          <span className={`neo-brutal-badge text-xs text-white ${getStatusColor(app.status)}`}>
                            {app.status.replace('-', ' ')}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold">{app.mentee.name}</h3>
                        <p className="text-muted-foreground">{app.mentee.email}</p>
                        {app.mentee.university && (
                          <p className="text-sm text-muted-foreground">{app.mentee.university}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          Applied to: <strong>{app.project.title}</strong>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link 
                          href={`/dsoc/applications/${app._id}`}
                          className="neo-brutal-btn neo-brutal-btn-secondary py-2 px-4 text-sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Link>
                        <button
                          onClick={() => handleApplicationAction(app._id, 'accepted')}
                          className="neo-brutal-btn neo-brutal-btn-success py-2 px-4 text-sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleApplicationAction(app._id, 'rejected')}
                          className="neo-brutal-btn bg-[var(--dsoc-pink)] text-white py-2 px-4 text-sm"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Link href="/dsoc/mentor/projects/new" className="neo-brutal-btn neo-brutal-btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create New Project
              </Link>
            </div>
            
            {projects.length === 0 ? (
              <div className="neo-brutal-card p-12 text-center">
                <Code2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first project to start receiving applications.
                </p>
                <Link href="/dsoc/mentor/projects/new" className="neo-brutal-btn neo-brutal-btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Link>
              </div>
            ) : (
              projects.map((project) => (
                <div key={project._id} className="neo-brutal-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <p className="text-muted-foreground">{project.organization}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.selectedMentees.length}/{project.maxMentees} mentees
                        </span>
                        <span className={`neo-brutal-badge text-xs ${
                          project.status === 'open' ? 'bg-[var(--dsoc-success)]' :
                          project.status === 'in-progress' ? 'bg-[var(--dsoc-accent)]' :
                          'bg-[var(--dsoc-purple)]'
                        } text-[var(--dsoc-dark)]`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        href={`/dsoc/projects/${project._id}`}
                        className="neo-brutal-btn neo-brutal-btn-secondary py-2 px-4 text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Mentees Tab */}
        {activeTab === 'mentees' && (
          <div className="space-y-4">
            {applications.filter(a => a.status === 'accepted').length === 0 ? (
              <div className="neo-brutal-card p-12 text-center">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No Mentees Yet</h3>
                <p className="text-muted-foreground">
                  Once you accept applications, your mentees will appear here.
                </p>
              </div>
            ) : (
              applications
                .filter(a => a.status === 'accepted')
                .map((app) => (
                  <div key={app._id} className="neo-brutal-card p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[var(--dsoc-primary)] border-4 border-[var(--dsoc-dark)] flex items-center justify-center text-white font-bold text-xl">
                          {app.mentee.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{app.mentee.name}</h3>
                          <p className="text-muted-foreground">{app.mentee.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Project: {app.project.title}
                          </p>
                        </div>
                      </div>
                      <a 
                        href="https://discord.com/invite/Cy7Rgkf4Up" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="neo-brutal-btn neo-brutal-btn-secondary py-2 px-4 text-sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </a>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
