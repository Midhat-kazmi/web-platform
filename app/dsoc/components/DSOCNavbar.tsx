'use client';

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  Code2, 
  Users, 
  Rocket, 
  MessageCircle,
  Zap,
  Star,
  ChevronDown,
  Menu,
  X,
  LogIn,
  Home
} from "lucide-react";
import "../styles.css";

export default function DSOCNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const joinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setExploreOpen(false);
      }
      if (joinRef.current && !joinRef.current.contains(event.target as Node)) {
        setJoinOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="dsoc-navbar fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/dsoc" className="flex items-center gap-2 no-underline">
            <div className="w-10 h-10 bg-[var(--dsoc-primary)] border-3 border-[var(--dsoc-dark)] flex items-center justify-center shadow-[3px_3px_0_var(--dsoc-dark)]">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-xl text-[var(--dsoc-dark)]">DSOC</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Explore Dropdown */}
            <div ref={exploreRef} className="relative">
              <button
                onClick={() => { setExploreOpen(!exploreOpen); setJoinOpen(false); }}
                className="dsoc-nav-link flex items-center gap-1"
              >
                Explore
                <ChevronDown className={`w-4 h-4 transition-transform ${exploreOpen ? 'rotate-180' : ''}`} />
              </button>
              {exploreOpen && (
                <div className="dsoc-dropdown">
                  <Link href="/dsoc/projects" className="dsoc-dropdown-item" onClick={() => setExploreOpen(false)}>
                    <Code2 className="w-4 h-4" />
                    <div>
                      <div className="font-bold">Projects</div>
                      <div className="text-xs opacity-70">Browse open source projects</div>
                    </div>
                  </Link>
                  <Link href="/dsoc/projects?difficulty=beginner" className="dsoc-dropdown-item" onClick={() => setExploreOpen(false)}>
                    <Star className="w-4 h-4" />
                    <div>
                      <div className="font-bold">Beginner Friendly</div>
                      <div className="text-xs opacity-70">Perfect for first-timers</div>
                    </div>
                  </Link>
                  <Link href="/dsoc/projects?status=open" className="dsoc-dropdown-item" onClick={() => setExploreOpen(false)}>
                    <Zap className="w-4 h-4" />
                    <div>
                      <div className="font-bold">Open Now</div>
                      <div className="text-xs opacity-70">Accepting applications</div>
                    </div>
                  </Link>
                  <div className="border-t border-white/10 my-2" />
                  <a href="https://discord.com/invite/Cy7Rgkf4Up" target="_blank" rel="noopener noreferrer" className="dsoc-dropdown-item">
                    <MessageCircle className="w-4 h-4" />
                    <div>
                      <div className="font-bold">Community</div>
                      <div className="text-xs opacity-70">Join our Discord</div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            <Link href="/dsoc/projects" className="dsoc-nav-link">
              Projects
            </Link>

            <a href="https://discord.com/invite/Cy7Rgkf4Up" target="_blank" rel="noopener noreferrer" className="dsoc-nav-link">
              Community
            </a>

            {/* Join Dropdown */}
            <div ref={joinRef} className="relative">
              <button
                onClick={() => { setJoinOpen(!joinOpen); setExploreOpen(false); }}
                className="dsoc-nav-link flex items-center gap-1"
              >
                Join
                <ChevronDown className={`w-4 h-4 transition-transform ${joinOpen ? 'rotate-180' : ''}`} />
              </button>
              {joinOpen && (
                <div className="dsoc-dropdown">
                  <Link href="/dsoc/register/mentee" className="dsoc-dropdown-item" onClick={() => setJoinOpen(false)}>
                    <Rocket className="w-4 h-4" />
                    <div>
                      <div className="font-bold">Apply as Mentee</div>
                      <div className="text-xs opacity-70">Start your journey</div>
                    </div>
                  </Link>
                  <Link href="/dsoc/register/mentor" className="dsoc-dropdown-item" onClick={() => setJoinOpen(false)}>
                    <Users className="w-4 h-4" />
                    <div>
                      <div className="font-bold">Become a Mentor</div>
                      <div className="text-xs opacity-70">Guide the next generation</div>
                    </div>
                  </Link>
                  <div className="border-t border-white/10 my-2" />
                  <Link href="/dsoc/login" className="dsoc-dropdown-item" onClick={() => setJoinOpen(false)}>
                    <LogIn className="w-4 h-4" />
                    <div>
                      <div className="font-bold">Login</div>
                      <div className="text-xs opacity-70">Already registered?</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="/our-story" 
              className="dsoc-nav-link" 
              title="Dev Weekends"
            >
              <Home className="w-5 h-5" />
            </a>
            <Link href="/dsoc/login" className="dsoc-nav-link">
              <LogIn className="w-4 h-4 mr-1" />
              Login
            </Link>
            <Link href="/dsoc/register/mentee" className="neo-brutal-btn neo-brutal-btn-accent py-2 px-4 text-sm">
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[var(--dsoc-dark)]"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden dsoc-mobile-menu">
            <a href="/our-story" className="dsoc-mobile-link" onClick={() => setIsOpen(false)}>
              <Home className="w-5 h-5" /> Dev Weekends
            </a>
            <Link href="/dsoc/projects" className="dsoc-mobile-link" onClick={() => setIsOpen(false)}>
              <Code2 className="w-5 h-5" /> Projects
            </Link>
            <Link href="/dsoc/projects?difficulty=beginner" className="dsoc-mobile-link" onClick={() => setIsOpen(false)}>
              <Star className="w-5 h-5" /> Beginner Friendly
            </Link>
            <a href="https://discord.com/invite/Cy7Rgkf4Up" target="_blank" rel="noopener noreferrer" className="dsoc-mobile-link">
              <MessageCircle className="w-5 h-5" /> Community
            </a>
            <div className="border-t border-[var(--dsoc-dark)]/10 my-3" />
            <Link href="/dsoc/register/mentee" className="dsoc-mobile-link" onClick={() => setIsOpen(false)}>
              <Rocket className="w-5 h-5" /> Apply as Mentee
            </Link>
            <Link href="/dsoc/register/mentor" className="dsoc-mobile-link" onClick={() => setIsOpen(false)}>
              <Users className="w-5 h-5" /> Become a Mentor
            </Link>
            <Link href="/dsoc/login" className="dsoc-mobile-link" onClick={() => setIsOpen(false)}>
              <LogIn className="w-5 h-5" /> Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
