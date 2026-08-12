'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react";
import "../../../../dsoc/styles.css";

const GALLERY_MAX = 5;

interface MentorOption {
  _id: string;
  name: string;
  company?: string;
  jobTitle?: string;
  picture?: string;
  expertise?: string[];
}

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [mentorLoading, setMentorLoading] = useState(true);
  const [mentorError, setMentorError] = useState('');
  const [error, setError] = useState('');
  const [availableMentors, setAvailableMentors] = useState<MentorOption[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryError, setGalleryError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    organization: '',
    repositoryUrls: [''],
    websiteUrl: '',
    timelineUrl: '',
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
    featuredImage: '',
    gallery: [] as string[],
  });

  useEffect(() => {
    fetchMentors();
  }, []);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: name === 'maxMentees' ? Number(value) : value,
    }));
  };

  const handleArrayChange = (
    field: 'requirements' | 'learningOutcomes' | 'repositoryUrls',
    index: number,
    value: string,
  ) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayItem = (field: 'requirements' | 'learningOutcomes' | 'repositoryUrls') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'requirements' | 'learningOutcomes' | 'repositoryUrls', index: number) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  const toggleMentor = (mentorId: string) => {
    setFormData((current) => {
      const isSelected = current.mentors.includes(mentorId);

      return {
        ...current,
        mentors: isSelected
          ? current.mentors.filter((id) => id !== mentorId)
          : [...current.mentors, mentorId],
      };
    });
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

  const handleGalleryAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setGalleryError('');

    const remaining = GALLERY_MAX - formData.gallery.length;
    if (remaining <= 0) {
      setGalleryError(`Gallery is full. Remove an image to add a new one. Max ${GALLERY_MAX}.`);
      e.target.value = '';
      return;
    }

    const accepted = files.slice(0, remaining);
    const dropped = files.length - accepted.length;

    setGalleryUploading(true);

    try {
      const uploaded = await Promise.all(accepted.map(uploadImageToCloudinary));
      setFormData((current) => ({
        ...current,
        gallery: [...current.gallery, ...uploaded].slice(0, GALLERY_MAX),
      }));
      if (dropped > 0) {
        setGalleryError(`Only added ${accepted.length}; gallery is capped at ${GALLERY_MAX} images.`);
      }
    } catch (err) {
      console.error('Gallery upload failed:', err);
      setGalleryError(err instanceof Error ? err.message : 'Failed to upload one or more images');
    } finally {
      setGalleryUploading(false);
      e.target.value = '';
    }
  };

  const handleGalleryRemove = (index: number) => {
    setFormData((current) => ({
      ...current,
      gallery: current.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let featuredImage = formData.featuredImage;

      if (imageFile) {
        setImageUploading(true);
        featuredImage = await uploadImageToCloudinary(imageFile);
      }

      if (!featuredImage) {
        throw new Error('Project image is required');
      }

      const res = await fetch('/api/dsoc/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          repositoryUrls: formData.repositoryUrls.filter(Boolean),
          technologies: formData.technologies.split(',').map((s) => s.trim()).filter(Boolean),
          tags: formData.tags.split(',').map((s) => s.trim()).filter(Boolean),
          mentors: formData.mentors,
          requirements: formData.requirements.filter(Boolean),
          learningOutcomes: formData.learningOutcomes.filter(Boolean),
          featuredImage,
          imageUrl: featuredImage,
          gallery: formData.gallery,
          status: 'draft',
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/dsoc');
      } else {
        setError(data.error || 'Failed to create project');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setImageUploading(false);
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-black mb-6">Create New Project</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-[var(--dsoc-pink)]/10 border-4 border-[var(--dsoc-pink)] text-[var(--dsoc-pink)]">
                  {error}
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
                  <label className="block font-bold text-sm mb-2">Project Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!formData.featuredImage}
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

                <div>
                  <label className="block font-bold text-sm mb-2 flex items-center gap-2">
                    <ImagePlus className="w-4 h-4" />
                    Additional Images (Gallery) — {formData.gallery.length}/{GALLERY_MAX}
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Optional. Shown on the project detail page as a slider. Up to {GALLERY_MAX} images.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryAdd}
                    disabled={galleryUploading || formData.gallery.length >= GALLERY_MAX}
                    className="neo-brutal-input"
                  />
                  {galleryUploading && (
                    <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
                  )}
                  {galleryError && (
                    <p className="mt-2 text-sm text-[var(--dsoc-pink)] font-bold">{galleryError}</p>
                  )}
                  {formData.gallery.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.gallery.map((url, index) => (
                        <div key={url + index} className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-28 object-cover border-4 border-[var(--dsoc-dark)]"
                          />
                          <button
                            type="button"
                            onClick={() => handleGalleryRemove(index)}
                            aria-label="Remove image"
                            className="absolute -top-2 -right-2 w-7 h-7 bg-[var(--dsoc-pink)] text-white border-4 border-[var(--dsoc-dark)] flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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

              {/* Links */}
              <div className="space-y-4">
                <h2 className="font-bold text-lg border-b-2 border-[var(--dsoc-dark)] pb-2">Links & Repositories</h2>

                <div className="space-y-3">
                  <label className="block font-bold text-sm">Repository URLs * (At least one is required)</label>
                  {formData.repositoryUrls.map((repoUrl, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={repoUrl}
                        onChange={(e) => handleArrayChange('repositoryUrls', index, e.target.value)}
                        required={index === 0}
                        className="neo-brutal-input flex-1"
                        placeholder="https://github.com/org/repo"
                      />
                      {formData.repositoryUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('repositoryUrls', index)}
                          className="p-3 bg-[var(--dsoc-pink)] text-white border-4 border-[var(--dsoc-dark)]"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addArrayItem('repositoryUrls')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--dsoc-success)] text-white font-bold border-4 border-[var(--dsoc-dark)] hover:translate-x-1 transition-transform text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Repository URL
                  </button>
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

                <div>
                  <label className="block font-bold text-sm mb-2">Timeline Link</label>
                  <input
                    type="url"
                    name="timelineUrl"
                    value={formData.timelineUrl}
                    onChange={handleChange}
                    className="neo-brutal-input"
                    placeholder="https://example.com/timeline"
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
                      placeholder="e.g., Understanding of microservices architecture"
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

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--dsoc-dark)] text-white font-bold border-4 border-[var(--dsoc-dark)] hover:translate-y-1 transition-transform disabled:opacity-50 w-full"
              >
                <Save className="w-5 h-5" />
                {imageUploading ? 'Uploading Image...' : loading ? 'Creating Project...' : 'Create Project'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}