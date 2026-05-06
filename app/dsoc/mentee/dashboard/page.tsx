'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User,
  FileText,
  Code2,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  MessageCircle
} from "lucide-react";
import "../../styles.css";
import DSOCNavbar from "../../components/DSOCNavbar";

interface Application {
  _id: string;
  status: string;
  createdAt: string;
  project: {
    _id: string;
    title: string;
    organization: string;
    status: string;
  };
}

interface MenteeProfile {
  name: string;
  email: string;
  username: string;
  university?: string;
  skills: string[];
}

export default function MenteeDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<MenteeProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const appsRes = await fetch('/api/dsoc/applications?my=true');
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
    await fetch('/api/dsoc/mentee/logout', { method: 'POST' });
    router.push('/dsoc/login');
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
      <header className="bg-[var(--dsoc-primary)] border-b-4 border-[var(--dsoc-dark)] pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dsoc" className="text-white font-black text-xl">
                DSOC
              </Link>
              <span className="text-white/60">/</span>
              <span className="text-white font-bold">Mentee Dashboard</span>
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
            <div className="text-3xl font-black text-[var(--dsoc-primary)]">
              {applications.length}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mt-1">
              Total Applications
            </div>
          </div>
          <div className="dsoc-stat-card">
            <div className="text-3xl font-black text-[var(--dsoc-accent)]">
              {applications.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mt-1">
              Pending
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
            <div className="text-3xl font-black text-[var(--dsoc-secondary)]">
              {applications.filter(a => a.status === 'under-review').length}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mt-1">
              Under Review
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab('applications')}
            className={`py-3 px-6 font-bold text-sm uppercase tracking-wider border-4 border-[var(--dsoc-dark)] transition-all ${
              activeTab === 'applications'
                ? 'bg-[var(--dsoc-primary)] text-white'
                : 'bg-background hover:bg-muted'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            My Applications
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
            Active Projects
          </button>
        </div>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="neo-brutal-card p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by browsing available projects and submitting your first application!
                </p>
                <Link href="/dsoc/projects" className="neo-brutal-btn neo-brutal-btn-primary">
                  Browse Projects
                </Link>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app._id} className="neo-brutal-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(app.status)}
                        <span className={`neo-brutal-badge text-xs text-white ${getStatusColor(app.status)}`}>
                          {app.status.replace('-', ' ')}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold">{app.project.title}</h3>
                      <p className="text-muted-foreground">{app.project.organization}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link 
                      href={`/dsoc/projects/${app.project._id}`}
                      className="neo-brutal-btn neo-brutal-btn-secondary py-2 px-4 text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Project
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {applications.filter(a => a.status === 'accepted').length === 0 ? (
              <div className="neo-brutal-card p-12 text-center">
                <Code2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No Active Projects</h3>
                <p className="text-muted-foreground mb-6">
                  Once you're accepted to a project, it will appear here.
                </p>
              </div>
            ) : (
              applications
                .filter(a => a.status === 'accepted')
                .map((app) => (
                  <div key={app._id} className="neo-brutal-card p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{app.project.title}</h3>
                        <p className="text-muted-foreground">{app.project.organization}</p>
                        <div className="mt-4 flex gap-3">
                          <Link 
                            href={`/dsoc/projects/${app.project._id}`}
                            className="neo-brutal-btn neo-brutal-btn-primary py-2 px-4 text-sm"
                          >
                            View Details
                          </Link>
                          <a 
                            href="https://discord.com/invite/Cy7Rgkf4Up" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="neo-brutal-btn neo-brutal-btn-secondary py-2 px-4 text-sm"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Discord Channel
                          </a>
                        </div>
                      </div>
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
