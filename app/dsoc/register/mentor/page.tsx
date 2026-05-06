'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Users, ArrowLeft, CheckCircle } from "lucide-react";
import "../../styles.css";
import DSOCNavbar from "../../components/DSOCNavbar";

export default function MentorRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    company: '',
    jobTitle: '',
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    bio: '',
    expertise: '',
    timezone: '',
    availability: '',
    discordUsername: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/dsoc/mentor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean)
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="neo-brutal-card p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[var(--dsoc-success)] border-4 border-[var(--dsoc-dark)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-black mb-4">Application Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for applying to be a DSOC mentor! Our team will review your application and get back to you soon.
          </p>
          <div className="space-y-3">
            <Link href="/dsoc" className="neo-brutal-btn neo-brutal-btn-primary w-full">
              Back to DSOC
            </Link>
            <a 
              href="https://discord.com/invite/Cy7Rgkf4Up" 
              target="_blank" 
              rel="noopener noreferrer"
              className="neo-brutal-btn neo-brutal-btn-secondary w-full"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DSOCNavbar />
      <div className="pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Link 
            href="/dsoc" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to DSOC
          </Link>

          <div className="neo-brutal-card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[var(--dsoc-secondary)] border-4 border-[var(--dsoc-dark)] flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-black">Become a DSOC Mentor</h1>
              <p className="text-muted-foreground mt-2">
                Share your expertise and guide the next generation of developers
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-[var(--dsoc-pink)]/10 border-4 border-[var(--dsoc-pink)] text-[var(--dsoc-pink)]">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="neo-brutal-input"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm mb-2">Username *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="neo-brutal-input"
                    placeholder="johndoe"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="neo-brutal-input"
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm mb-2">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="neo-brutal-input pr-12"
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-sm mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="neo-brutal-input"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <div className="border-t-4 border-[var(--dsoc-dark)] dark:border-[var(--dsoc-light)] pt-6">
                <h3 className="font-bold mb-4">Professional Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-sm mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="neo-brutal-input"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">Job Title</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="neo-brutal-input"
                      placeholder="Senior Engineer"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t-4 border-[var(--dsoc-dark)] dark:border-[var(--dsoc-light)] pt-6">
                <h3 className="font-bold mb-4">Profile Links</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-sm mb-2">GitHub *</label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      required
                      className="neo-brutal-input"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">LinkedIn</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="neo-brutal-input"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">Twitter</label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="neo-brutal-input"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">Discord Username</label>
                    <input
                      type="text"
                      name="discordUsername"
                      value={formData.discordUsername}
                      onChange={handleChange}
                      className="neo-brutal-input"
                      placeholder="username#1234"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm mb-2">Areas of Expertise *</label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  required
                  className="neo-brutal-input"
                  placeholder="React, Node.js, DevOps (comma separated)"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-sm mb-2">Timezone</label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="neo-brutal-input"
                  >
                    <option value="">Select Timezone</option>
                    <option value="UTC-8">Pacific Time (UTC-8)</option>
                    <option value="UTC-5">Eastern Time (UTC-5)</option>
                    <option value="UTC+0">UTC</option>
                    <option value="UTC+1">Central European (UTC+1)</option>
                    <option value="UTC+5">Pakistan (UTC+5)</option>
                    <option value="UTC+5:30">India (UTC+5:30)</option>
                    <option value="UTC+8">China (UTC+8)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-sm mb-2">Weekly Availability</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="neo-brutal-input"
                  >
                    <option value="">Select Availability</option>
                    <option value="3-5 hours">3-5 hours/week</option>
                    <option value="5-10 hours">5-10 hours/week</option>
                    <option value="10+ hours">10+ hours/week</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-sm mb-2">Bio *</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="neo-brutal-input resize-none"
                  placeholder="Tell us about yourself, your experience, and why you want to mentor..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="neo-brutal-btn neo-brutal-btn-secondary w-full text-lg"
              >
                {loading ? 'Submitting Application...' : 'Apply to Become a Mentor'}
              </button>

              <p className="text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href="/dsoc/login" className="font-bold text-foreground hover:text-[var(--dsoc-primary)]">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
