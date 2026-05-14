'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowLeft,
  Plus,
  Code2,
  Users,
  FileText,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye
} from "lucide-react";
import "../../dsoc/styles.css";

interface Project {
  _id: string;
  title: string;
  organization: string;
  status: string;
  difficulty: string;
  technologies: string[];
  mentors: { _id: string; name: string }[];
  selectedMentees: { _id: string; name: string }[];
  maxMentees: number;
  createdAt: string;
}

interface Application {
  _id: string;
  status: string;
  createdAt: string;
  mentee: { _id: string; name: string; email: string };
  project: { _id: string; title: string };
}

interface Mentor {
  _id: string;
  name: string;
  email: string;
  company?: string;
  jobTitle?: string;
  picture?: string;
  expertise?: string[];
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
}

interface Mentee {
  _id: string;
  name: string;
  email: string;
  university?: string;
  degree?: string;
  picture?: string;
  skills?: string[];
  mentor?: { _id: string; name: string; company?: string; jobTitle?: string; picture?: string } | string;
  projects?: Array<string | { _id: string }>;
  applications?: Array<string | { _id: string }>;
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
}

interface Stats {
  projects: { total: number; open: number; inProgress: number; completed: number };
  mentors: number;
  mentees: number;
  applications: number;
}

export default function AdminDSOCPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, projectsRes, appsRes, mentorsRes, menteesRes] = await Promise.all([
        fetch('/api/dsoc/stats'),
        fetch('/api/dsoc/projects?limit=100'),
        fetch('/api/dsoc/applications'),
        fetch('/api/dsoc/mentors'),
        fetch('/api/dsoc/mentees')
      ]);

      const [statsData, projectsData, appsData, mentorsData, menteesData] = await Promise.all([
        statsRes.json(),
        projectsRes.json(),
        appsRes.json(),
        mentorsRes.json(),
        menteesRes.json()
      ]);

      if (statsData.success) setStats(statsData.data);
      if (projectsData.success) setProjects(projectsData.data);
      if (appsData.success) setApplications(appsData.data);
      if (mentorsData.success) setMentors(mentorsData.data || []);
      if (menteesData.success) setMentees(menteesData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const res = await fetch(`/api/dsoc/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleApplicationAction = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      const res = await fetch(`/api/dsoc/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': case 'accepted': return 'bg-[var(--dsoc-success)]';
      case 'in-progress': case 'under-review': return 'bg-[var(--dsoc-accent)]';
      case 'completed': return 'bg-[var(--dsoc-purple)]';
      case 'pending': return 'bg-[var(--dsoc-secondary)]';
      case 'rejected': return 'bg-[var(--dsoc-pink)]';
      default: return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[var(--dsoc-primary)] border-t-transparent animate-spin" />
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[var(--dsoc-dark)] border-b-4 border-[var(--dsoc-primary)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-white/60 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-white font-black text-xl">DSOC Admin</h1>
            </div>
            <Link href="/dsoc" className="neo-brutal-btn neo-brutal-btn-accent py-2 px-4 text-sm">
              <Eye className="w-4 h-4 mr-2" />
              View Public Page
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="dsoc-stat-card">
            <div className="text-3xl font-black text-[var(--dsoc-primary)]">
              {stats?.projects.total || 0}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mt-1">Projects</div>
          </div>
          <div className="dsoc-stat-card">
            <div className="text-3xl font-black text-[var(--dsoc-success)]">
              {stats?.projects.open || 0}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mt-1">Open</div>
          </div>
          <div className="dsoc-stat-card">
            <div className="text-3xl font-black text-[var(--dsoc-secondary)]">
              {stats?.mentors || 0}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mt-1">Mentors</div>
          </div>
          <div className="dsoc-stat-card">
            <div className="text-3xl font-black text-[var(--dsoc-purple)]">
              {stats?.mentees || 0}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mt-1">Mentees</div>
          </div>
          <div className="dsoc-stat-card">
            <div className="text-3xl font-black text-[var(--dsoc-accent)]">
              {stats?.applications || 0}
            </div>
            <div className="text-sm font-bold uppercase tracking-wider mt-1">Applications</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-0 mb-6">
          {['overview', 'projects', 'applications', 'mentors', 'mentees'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-6 font-bold text-sm uppercase tracking-wider border-4 border-[var(--dsoc-dark)] first:border-l-4 border-l-0 transition-all ${
                activeTab === tab
                  ? 'bg-[var(--dsoc-primary)] text-white'
                  : 'bg-background hover:bg-muted'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="neo-brutal-input pl-12"
                />
              </div>
              <Link href="/admin/dsoc/projects/new" className="neo-brutal-btn neo-brutal-btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-4 border-[var(--dsoc-dark)] dark:border-[var(--dsoc-light)]">
                    <th className="text-left py-3 px-4 font-bold uppercase text-sm">Project</th>
                    <th className="text-left py-3 px-4 font-bold uppercase text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-bold uppercase text-sm">Difficulty</th>
                    <th className="text-left py-3 px-4 font-bold uppercase text-sm">Mentees</th>
                    <th className="text-left py-3 px-4 font-bold uppercase text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects
                    .filter(p => 
                      p.title.toLowerCase().includes(search.toLowerCase()) ||
                      p.organization.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((project) => (
                      <tr key={project._id} className="border-b border-muted">
                        <td className="py-4 px-4">
                          <div className="font-bold">{project.title}</div>
                          <div className="text-sm text-muted-foreground">{project.organization}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`neo-brutal-badge text-xs text-white ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`neo-brutal-badge text-xs ${
                            project.difficulty === 'beginner' ? 'bg-[var(--dsoc-success)]' :
                            project.difficulty === 'intermediate' ? 'bg-[var(--dsoc-accent)]' :
                            'bg-[var(--dsoc-pink)]'
                          } text-[var(--dsoc-dark)]`}>
                            {project.difficulty}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {project.selectedMentees?.length || 0} / {project.maxMentees}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/dsoc/projects/${project._id}`}
                              className="p-2 bg-[var(--dsoc-secondary)] text-white border-2 border-[var(--dsoc-dark)] hover:opacity-80"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/dsoc/projects/${project._id}/edit`}
                              className="p-2 bg-[var(--dsoc-accent)] text-[var(--dsoc-dark)] border-2 border-[var(--dsoc-dark)] hover:opacity-80"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProject(project._id)}
                              className="p-2 bg-[var(--dsoc-pink)] text-white border-2 border-[var(--dsoc-dark)] hover:opacity-80"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="neo-brutal-card p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`neo-brutal-badge text-xs text-white ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-bold">{app.mentee.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {app.mentee.email} → {app.project.title}
                    </div>
                  </div>
                  {app.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApplicationAction(app._id, 'accepted')}
                        className="p-2 bg-[var(--dsoc-success)] text-white border-2 border-[var(--dsoc-dark)]"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleApplicationAction(app._id, 'rejected')}
                        className="p-2 bg-[var(--dsoc-pink)] text-white border-2 border-[var(--dsoc-dark)]"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="neo-brutal-card p-6">
              <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--dsoc-primary)]" />
                Recent Applications
              </h2>
              <div className="space-y-3">
                {applications.slice(0, 5).map((app) => (
                  <div key={app._id} className="flex items-center justify-between p-3 bg-muted/50">
                    <div>
                      <div className="font-bold text-sm">{app.mentee.name}</div>
                      <div className="text-xs text-muted-foreground">{app.project.title}</div>
                    </div>
                    <span className={`neo-brutal-badge text-xs text-white ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('applications')}
                className="neo-brutal-btn neo-brutal-btn-secondary w-full mt-4"
              >
                View All Applications
              </button>
            </div>

            <div className="neo-brutal-card p-6">
              <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[var(--dsoc-secondary)]" />
                Recent Projects
              </h2>
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <div key={project._id} className="flex items-center justify-between p-3 bg-muted/50">
                    <div>
                      <div className="font-bold text-sm">{project.title}</div>
                      <div className="text-xs text-muted-foreground">{project.organization}</div>
                    </div>
                    <span className={`neo-brutal-badge text-xs text-white ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('projects')}
                className="neo-brutal-btn neo-brutal-btn-secondary w-full mt-4"
              >
                View All Projects
              </button>
            </div>
          </div>
        )}

        {/* Mentors Tab */}
        {activeTab === 'mentors' && (
          <div className="space-y-6">
            <div className="neo-brutal-card p-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-xl font-bold mb-1">Mentor Management</h3>
                <p className="text-muted-foreground">
                  Review mentor profiles, see verification state, and open the public mentor page.
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider">
                <span className="neo-brutal-badge bg-[var(--dsoc-secondary)] text-white">
                  Total {mentors.length}
                </span>
                <span className="neo-brutal-badge bg-[var(--dsoc-success)] text-white">
                  Active {mentors.filter((mentor) => mentor.isActive).length}
                </span>
              </div>
            </div>

            {mentors.length === 0 ? (
              <div className="neo-brutal-card p-12 text-center">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No mentors found</h3>
                <p className="text-muted-foreground">
                  Create a mentor from the DSOC mentor registration page or seed one in the database.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {mentors.map((mentor) => (
                  <div key={mentor._id} className="neo-brutal-card p-5 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-[var(--dsoc-dark)] bg-[var(--dsoc-dark)] text-white flex items-center justify-center font-black shrink-0">
                        {mentor.picture ? (
                          <img src={mentor.picture} alt={mentor.name} className="w-full h-full object-cover" />
                        ) : (
                          mentor.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-lg leading-tight">{mentor.name}</h4>
                        <p className="text-sm text-muted-foreground truncate">{mentor.email}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {mentor.jobTitle || 'Mentor'}{mentor.company ? ` · ${mentor.company}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
                      <span className={`neo-brutal-badge ${mentor.isActive ? 'bg-[var(--dsoc-success)] text-white' : 'bg-gray-300 text-black'}`}>
                        {mentor.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`neo-brutal-badge ${mentor.isVerified ? 'bg-[var(--dsoc-primary)] text-white' : 'bg-[var(--dsoc-pink)] text-white'}`}>
                        {mentor.isVerified ? 'Verified' : 'Pending Review'}
                      </span>
                    </div>

                    {mentor.expertise && mentor.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.slice(0, 4).map((skill) => (
                          <span key={skill} className="px-2 py-1 text-xs font-bold border-2 border-[var(--dsoc-dark)] bg-background">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      href="/mentor"
                      className="neo-brutal-btn neo-brutal-btn-secondary w-full justify-center"
                    >
                      View Mentor Portal
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mentees Tab */}
        {activeTab === 'mentees' && (
          <div className="space-y-6">
            <div className="neo-brutal-card p-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-xl font-bold mb-1">Mentee Management</h3>
                <p className="text-muted-foreground">
                  Review mentee profiles, verify status, and see their mentor/project connections.
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider">
                <span className="neo-brutal-badge bg-[var(--dsoc-secondary)] text-white">
                  Total {mentees.length}
                </span>
                <span className="neo-brutal-badge bg-[var(--dsoc-success)] text-white">
                  Active {mentees.filter((mentee) => mentee.isActive).length}
                </span>
              </div>
            </div>

            {mentees.length === 0 ? (
              <div className="neo-brutal-card p-12 text-center">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No mentees found</h3>
                <p className="text-muted-foreground">
                  Create a mentee from the DSOC mentee registration page or seed one in the database.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {mentees.map((mentee) => {
                  const mentorName = typeof mentee.mentor === 'object' ? mentee.mentor.name : null;

                  return (
                    <div key={mentee._id} className="neo-brutal-card p-5 flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-[var(--dsoc-dark)] bg-[var(--dsoc-dark)] text-white flex items-center justify-center font-black shrink-0">
                          {mentee.picture ? (
                            <img src={mentee.picture} alt={mentee.name} className="w-full h-full object-cover" />
                          ) : (
                            mentee.name
                              .split(' ')
                              .map((part) => part[0])
                              .join('')
                              .slice(0, 2)
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-lg leading-tight">{mentee.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{mentee.email}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {mentee.degree || 'Mentee'}{mentee.university ? ` · ${mentee.university}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
                        <span className={`neo-brutal-badge ${mentee.isActive ? 'bg-[var(--dsoc-success)] text-white' : 'bg-gray-300 text-black'}`}>
                          {mentee.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`neo-brutal-badge ${mentee.isVerified ? 'bg-[var(--dsoc-primary)] text-white' : 'bg-[var(--dsoc-pink)] text-white'}`}>
                          {mentee.isVerified ? 'Verified' : 'Pending Review'}
                        </span>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><span className="font-bold text-foreground">Mentor:</span> {mentorName || 'Unassigned'}</p>
                        <p><span className="font-bold text-foreground">Projects:</span> {mentee.projects?.length || 0}</p>
                        <p><span className="font-bold text-foreground">Applications:</span> {mentee.applications?.length || 0}</p>
                      </div>

                      {mentee.skills && mentee.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {mentee.skills.slice(0, 4).map((skill) => (
                            <span key={skill} className="px-2 py-1 text-xs font-bold border-2 border-[var(--dsoc-dark)] bg-background">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link
                        href="/dsoc/register/mentee"
                        className="neo-brutal-btn neo-brutal-btn-secondary w-full justify-center"
                      >
                        View Mentee Portal
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
