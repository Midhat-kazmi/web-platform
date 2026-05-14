'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Users
} from "lucide-react";
import "../../../../../dsoc/styles.css";

interface MentorOption {
  _id: string;
  name: string;
  company?: string;
  jobTitle?: string;
  picture?: string;
  expertise?: string[];
}

export default function EditProjectPage() {
  const routeParams = useParams<{ id: string }>();
  const projectId = routeParams?.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mentorLoading, setMentorLoading] = useState(true);
  const [mentorError, setMentorError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [availableMentors, setAvailableMentors] = useState<MentorOption[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    organization: '',
    repositoryUrl: '',
    websiteUrl: '',
    difficulty: 'intermediate',
    duration: '3 months',
    technologies: '',
    tags: '',
    maxMentees: 3,
    applicationDeadline: '',
    startDate: '',
    endDate: '',
    mentors: [] as string[],
    requirements: [''],
    learningOutcomes: [''],
    season: '2026',
    status: 'draft',
    featuredImage: ''
  });

  useEffect(() => {
    fetchProject();
    fetchMentors();
  }, [projectId]);

  const fetchMentors = async () => {
    try {
      const res = await fetch('/api/dsoc/mentors');
      const data = await res.json();

      if (data.success) {
        setAvailableMentors(data.data || []);
      } else {
        setMentorError(data.error || 'Failed to load mentors');
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setMentorError('Failed to load mentors');
    } finally {
      setMentorLoading(false);
    }
  };

  const fetchProject = async () => {
    if (!projectId) {
      setLoading(true);
      return;
    }

    try {
      const res = await fetch(`/api/dsoc/projects/${projectId}`);
      const data = await res.json();

      if (data.success) {
        const project = data.data;
        setFormData({
          title: project.title || '',
          description: project.description || '',
          longDescription: project.longDescription || '',
          organization: project.organization || '',
          repositoryUrl: project.repositoryUrl || '',
          websiteUrl: project.websiteUrl || '',
          difficulty: project.difficulty || 'intermediate',
          duration: project.duration || '3 months',
          technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
          tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
          maxMentees: project.maxMentees || 3,
          mentors: Array.isArray(project.mentors)
            ? project.mentors.map((mentor: any) => (typeof mentor === 'string' ? mentor : mentor?._id)).filter(Boolean)
            : [],
          applicationDeadline: project.applicationDeadline ? new Date(project.applicationDeadline).toISOString().split('T')[0] : '',
          startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
          endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
          requirements: project.requirements && project.requirements.length > 0 ? project.requirements : [''],
          learningOutcomes: project.learningOutcomes && project.learningOutcomes.length > 0 ? project.learningOutcomes : [''],
          season: project.season || '2025',
          status: project.status || 'draft',
          featuredImage: project.featuredImage || project.imageUrl || ''
        });
      } else {
        setError(data.error || 'Failed to load project');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field: 'requirements' | 'learningOutcomes', index: number, value: string) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const toggleMentor = (mentorId: string) => {
    setFormData((current) => {
      const isSelected = current.mentors.includes(mentorId);

      return {
        ...current,
        mentors: isSelected
          ? current.mentors.filter((id) => id !== mentorId)
          : [...current.mentors, mentorId]
      };
    });
  };

  const addArrayItem = (field: 'requirements' | 'learningOutcomes') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'requirements' | 'learningOutcomes', index: number) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (!file) {
      setImagePreview('');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToCloudinary = async (file: File) => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: uploadFormData,
    });

    if (!uploadRes.ok) {
      throw new Error('Image upload failed');
    }

    const uploadData = await uploadRes.json();
    return uploadData.url as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      let featuredImage = formData.featuredImage;

      if (imageFile) {
        setImageUploading(true);
        featuredImage = await uploadImageToCloudinary(imageFile);
      }

      const res = await fetch(`/api/dsoc/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          longDescription: formData.longDescription,
          organization: formData.organization,
          repositoryUrl: formData.repositoryUrl,
          websiteUrl: formData.websiteUrl,
          difficulty: formData.difficulty,
          duration: formData.duration,
          technologies: formData.technologies.split(',').map(s => s.trim()).filter(Boolean),
          tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
          maxMentees: parseInt(formData.maxMentees as unknown as string),
          mentors: formData.mentors,
          applicationDeadline: formData.applicationDeadline,
          startDate: formData.startDate,
          endDate: formData.endDate,
          requirements: formData.requirements.filter(Boolean),
          learningOutcomes: formData.learningOutcomes.filter(Boolean),
          season: formData.season,
          status: formData.status,
          featuredImage,
          imageUrl: featuredImage
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/dsoc');
        }, 1500);
      } else {
        setError(data.error || 'Failed to update project');
      }
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setImageUploading(false);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--dsoc-dark)] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link 
            href="/admin/dsoc"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to DSOC Admin
          </Link>

          <div className="neo-brutal-card p-8">
            <h1 className="text-3xl font-black mb-6">Edit Project</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-[var(--dsoc-pink)]/10 border-4 border-[var(--dsoc-pink)] text-[var(--dsoc-pink)] flex gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 bg-[var(--dsoc-success)]/10 border-4 border-[var(--dsoc-success)] text-[var(--dsoc-success)]">
                  ✓ Project updated successfully! Redirecting...
                </div>
              )}

              {/* Basic Info */}
              <div className="space-y-4">
                <h2 className="font-bold text-lg border-b-2 border-[var(--dsoc-dark)] pb-2">Basic Information</h2>
                
                <div>
                  <label className="block font-bold text-sm mb-2">Project Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="neo-brutal-input"
                    placeholder="e.g., Build a Real-time Chat Application"
                  />
                </div>

                <div>
                  <label className="block font-bold text-sm mb-2">Organization *</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                    className="neo-brutal-input"
                    placeholder="e.g., Dev Weekends"
                  />
                </div>

                <div>
                  <label className="block font-bold text-sm mb-2">Short Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="neo-brutal-input resize-none"
                    placeholder="Brief description (shown in project cards)"
                  />
                </div>

                <div>
                  <label className="block font-bold text-sm mb-2">Long Description</label>
                  <textarea
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleChange}
                    rows={6}
                    className="neo-brutal-input resize-none"
                    placeholder="Detailed description (shown on project page)"
                  />
                </div>

                <div>
                  <label className="block font-bold text-sm mb-2">Project Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="neo-brutal-input"
                  />
                  {(imagePreview || formData.featuredImage) && (
                    <div className="mt-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview || formData.featuredImage}
                        alt="Project preview"
                        className="w-full max-w-md h-52 object-cover border-4 border-[var(--dsoc-dark)]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <h2 className="font-bold text-lg border-b-2 border-[var(--dsoc-dark)] pb-2">Links</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-sm mb-2">Repository URL *</label>
                    <input
                      type="url"
                      name="repositoryUrl"
                      value={formData.repositoryUrl}
                      onChange={handleChange}
                      required
                      className="neo-brutal-input"
                      placeholder="https://github.com/org/repo"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">Website URL</label>
                    <input
                      type="url"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      className="neo-brutal-input"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <h2 className="font-bold text-lg border-b-2 border-[var(--dsoc-dark)] pb-2">Project Details</h2>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-sm mb-2">Difficulty *</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      className="neo-brutal-input"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">Duration *</label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="neo-brutal-input"
                    >
                      <option value="1 month">1 month</option>
                      <option value="6 weeks">6 weeks</option>
                      <option value="2 months">2 months</option>
                      <option value="3 months">3 months</option>
                      <option value="4 months">4 months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">Max Mentees *</label>
                    <input
                      type="number"
                      name="maxMentees"
                      value={formData.maxMentees}
                      onChange={handleChange}
                      min={1}
                      max={10}
                      className="neo-brutal-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-sm mb-2">Technologies *</label>
                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleChange}
                    required
                    className="neo-brutal-input"
                    placeholder="React, Node.js, MongoDB (comma separated)"
                  />
                </div>

                <div>
                  <label className="block font-bold text-sm mb-2">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="neo-brutal-input"
                    placeholder="web, fullstack, api (comma separated)"
                  />
                </div>

                <div>
                  <label className="block font-bold text-sm mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="neo-brutal-input"
                  >
                    <option value="draft">Draft</option>
                    <option value="open">Open for Applications</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Mentors */}
              <div className="space-y-4">
                <h2 className="font-bold text-lg border-b-2 border-[var(--dsoc-dark)] pb-2 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Select Mentors
                </h2>

                {mentorLoading ? (
                  <div className="p-4 border-2 border-dashed border-[var(--dsoc-dark)] text-sm text-muted-foreground">
                    Loading mentors...
                  </div>
                ) : mentorError ? (
                  <div className="p-4 bg-[var(--dsoc-pink)]/10 border-4 border-[var(--dsoc-pink)] text-[var(--dsoc-pink)]">
                    {mentorError}
                  </div>
                ) : availableMentors.length === 0 ? (
                  <div className="p-4 border-2 border-dashed border-[var(--dsoc-dark)] text-sm text-muted-foreground">
                    No mentors found. Create and verify a mentor first.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {availableMentors.map((mentor) => {
                      const isSelected = formData.mentors.includes(mentor._id);

                      return (
                        <button
                          key={mentor._id}
                          type="button"
                          onClick={() => toggleMentor(mentor._id)}
                          className={`text-left p-4 border-4 transition-all ${
                            isSelected
                              ? 'border-[var(--dsoc-success)] bg-[var(--dsoc-success)]/10'
                              : 'border-[var(--dsoc-dark)] bg-background hover:-translate-y-1'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-full bg-[var(--dsoc-dark)] text-white flex items-center justify-center font-bold overflow-hidden shrink-0">
                              {mentor.picture ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={mentor.picture} alt={mentor.name} className="w-full h-full object-cover" />
                              ) : (
                                mentor.name
                                  .split(' ')
                                  .map((part) => part[0])
                                  .join('')
                                  .slice(0, 2)
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-bold text-lg leading-tight">{mentor.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {mentor.jobTitle || 'Mentor'}{mentor.company ? ` · ${mentor.company}` : ''}
                                  </p>
                                </div>
                                {isSelected && <CheckCircle2 className="w-5 h-5 text-[var(--dsoc-success)] shrink-0" />}
                              </div>

                              {mentor.expertise && mentor.expertise.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {mentor.expertise.slice(0, 3).map((skill) => (
                                    <span key={skill} className="px-2 py-1 text-xs font-bold border-2 border-[var(--dsoc-dark)] bg-background">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {formData.mentors.length > 0 && (
                  <p className="text-sm font-medium text-[var(--dsoc-success)]">
                    {formData.mentors.length} mentor{formData.mentors.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h2 className="font-bold text-lg border-b-2 border-[var(--dsoc-dark)] pb-2">Timeline</h2>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-sm mb-2">Application Deadline *</label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      required
                      className="neo-brutal-input"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="neo-brutal-input"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">End Date *</label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="neo-brutal-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-sm mb-2">Season *</label>
                  <input
                    type="text"
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    required
                    className="neo-brutal-input"
                    placeholder="e.g., 2025, Summer 2025"
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                <h2 className="font-bold text-lg border-b-2 border-[var(--dsoc-dark)] pb-2">Requirements</h2>
                
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                      className="neo-brutal-input flex-1"
                      placeholder="e.g., Basic knowledge of JavaScript"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requirements', index)}
                        className="p-3 bg-[var(--dsoc-pink)] text-white border-4 border-[var(--dsoc-dark)]"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--dsoc-success)] text-white font-bold border-4 border-[var(--dsoc-dark)] hover:translate-x-1 transition-transform"
                >
                  <Plus className="w-5 h-5" />
                  Add Requirement
                </button>
              </div>

              {/* Learning Outcomes */}
              <div className="space-y-4">
                <h2 className="font-bold text-lg border-b-2 border-[var(--dsoc-dark)] pb-2">Learning Outcomes</h2>
                
                {formData.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => handleArrayChange('learningOutcomes', index, e.target.value)}
                      className="neo-brutal-input flex-1"
                      placeholder="e.g., Learn real-time communication patterns"
                    />
                    {formData.learningOutcomes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('learningOutcomes', index)}
                        className="p-3 bg-[var(--dsoc-pink)] text-white border-4 border-[var(--dsoc-dark)]"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem('learningOutcomes')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--dsoc-success)] text-white font-bold border-4 border-[var(--dsoc-dark)] hover:translate-x-1 transition-transform"
                >
                  <Plus className="w-5 h-5" />
                  Add Learning Outcome
                </button>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t-2 border-[var(--dsoc-dark)]">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-[var(--dsoc-dark)] text-white font-bold border-4 border-[var(--dsoc-dark)] hover:translate-y-1 transition-transform disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {imageUploading ? 'Uploading Image...' : submitting ? 'Saving...' : 'Save Changes'}
                </button>
                
                <Link
                  href="/admin/dsoc"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-black font-bold border-4 border-[var(--dsoc-dark)] hover:translate-y-1 transition-transform"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
