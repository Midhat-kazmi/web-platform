"use client"

import { useState } from "react"
import Link from "next/link"
import { X, Mail, Youtube, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  const [showSponsorModal, setShowSponsorModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  const socialLinks = [
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://www.youtube.com/@devweekends',
    },
    {
      name: 'Discord',
      icon: null, // Custom SVG below
      url: 'https://discord.gg/Cy7Rgkf4Up',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/company/devweekends/',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/devweekends',
    },
    {
      name: 'Linktree',
      icon: null, // Custom SVG below
      url: 'https://linktr.ee/DevWeekends',
    },
  ]

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="block mb-4">
              <span className="text-2xl font-black tracking-tight">Dev Weekends</span>
            </Link>
            <p className="text-sm text-background/60 mb-6 leading-relaxed">
              We don&apos;t just teach code. We build engineers who change lives. 100% free, forever.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground transition-all"
                  aria-label={social.name}
                >
                  {social.icon ? (
                    <social.icon className="w-4 h-4" />
                  ) : social.name === 'Discord' ? (
                    // Discord custom icon
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  ) : social.name === 'Linktree' ? (
                    // Linktree custom icon
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.953 15.066l-.038-4.086 4.286-4.257-4.286 4.257.038 4.086zM12.049 8.727l4.286 4.257-.038 4.086-4.286-4.257.038-4.086zm-4.058 6.339l4.058 4.086 4.058-4.086H8.001zM12.049 5.599l-4.058 4.086h8.116l-4.058-4.086zm0 12.802v5.599l4.058-4.086-4.058-1.513zm0-18.401v5.599l4.058 4.086L12.049 0z"/>
                    </svg>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>

          {/* Fellowship */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[2px] text-background/40 mb-5">
              Fellowship
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/fellowship" className="text-background/70 hover:text-background transition-colors">
                  Apply Now
                </Link>
              </li>
              <li>
                <Link href="/our-story#tracks" className="text-background/70 hover:text-background transition-colors">
                  DSA Track
                </Link>
              </li>
              <li>
                <Link href="/our-story#tracks" className="text-background/70 hover:text-background transition-colors">
                  Engineering Track
                </Link>
              </li>
              <li>
                <Link href="/our-story#tracks" className="text-background/70 hover:text-background transition-colors">
                  Open Source
                </Link>
              </li>
              <li>
                <Link href="/our-story#fellowship" className="text-background/70 hover:text-background transition-colors">
                  Certifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[2px] text-background/40 mb-5">
              Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="https://resources.devweekends.com/resources/cp-dsa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  LeetCode Templates
                </a>
              </li>
              <li>
                <a 
                  href="https://resources.devweekends.com/productivity-sheets/overview" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Study Schedules
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/devweekends" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  GitHub Repos
                </a>
              </li>
              <li>
                <a 
                  href="https://resources.devweekends.com/resources/engineering-channels#weekly-engineering-articles-curated-learning-resources" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Weekly Articles
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@devweekends"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  YouTube Channel
                </a>
              </li>
              <li>
                <Link href="/brand" className="text-background/70 hover:text-background transition-colors">
                  Brand Kit
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[2px] text-background/40 mb-5">
              Community
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/projects" className="text-background/70 hover:text-background transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-background/70 hover:text-background transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <a 
                  href="https://discord.gg/Cy7Rgkf4Up" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Discord Server
                </a>
              </li>
              <li>
                <Link href="/our-story#impact" className="text-background/70 hover:text-background transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/our-story#apply" className="text-background/70 hover:text-background transition-colors">
                  Become a Mentor
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => setShowSponsorModal(true)}
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Sponsor a Student
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="text-background/70 hover:text-background transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[2px] text-background/40 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-background/70 hover:text-background transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/mentorship" className="text-background/70 hover:text-background transition-colors">
                  Mentorship
                </Link>
              </li>
              <li>
                <Link href="/fellowship" className="text-background/70 hover:text-background transition-colors">
                  Fellowship
                </Link>
              </li>
              <li>
                <Link href="/mindmaster" className="text-background/70 hover:text-background transition-colors">
                  MindMaster
                </Link>
              </li>
             {/*  <li>
                <Link href="/ambassador-program" className="text-background/70 hover:text-background transition-colors">
                  Ambassadorship
                </Link>
              </li>

              */}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/40">
            <p>&copy; {new Date().getFullYear()} Dev Weekends. All rights reserved.</p>
            <p>Built with passion for the global engineering community.</p>
          </div>
        </div>
      </div>

      {/* Sponsor Modal */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSponsorModal(false)}
          />
          <div className="relative bg-background text-foreground border border-border max-w-md w-full p-8 shadow-2xl">
            <button 
              onClick={() => setShowSponsorModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-bold mb-3">Sponsor a Student</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Your sponsorship can change a student&apos;s life. Help us provide free education, 
                resources, and mentorship to underserved engineering students across Pakistan.
              </p>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 border border-border">
                  <div className="text-xl font-bold">$25</div>
                  <div className="text-xs text-muted-foreground">1 Month</div>
                </div>
                <div className="p-3 border border-border bg-muted/30">
                  <div className="text-xl font-bold">$100</div>
                  <div className="text-xs text-muted-foreground">6 Months</div>
                </div>
                <div className="p-3 border border-border">
                  <div className="text-xl font-bold">$200</div>
                  <div className="text-xs text-muted-foreground">Full Year</div>
                </div>
              </div>
              
              <a 
                href="mailto:devweekends@gmail.com?subject=I%20Want%20to%20Sponsor%20a%20Student&body=Hi%20Dev%20Weekends%20Team%2C%0A%0AI%20would%20like%20to%20sponsor%20a%20student.%20Please%20share%20more%20details%20about%20how%20I%20can%20help.%0A%0ABest%20regards"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold text-xs uppercase tracking-[1px] hover:opacity-90 transition-all w-full justify-center mb-4"
              >
                <Mail className="w-4 h-4" />
                Get in Touch
              </a>
              
              <p className="text-xs text-muted-foreground">
                100% of donations go directly to student support
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowContactModal(false)}
          />
          <div className="relative bg-background text-foreground border border-border max-w-md w-full p-8 shadow-2xl">
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-bold mb-3">Contact Us</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Have questions about our programs? Want to collaborate or partner with us? 
                We&apos;d love to hear from you.
              </p>
              
              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center gap-3 p-3 border border-border">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="text-sm font-medium">devweekends@gmail.com</div>
                  </div>
                </div>
              </div>
              
              <a 
                href="mailto:devweekends@gmail.com?subject=General%20Inquiry&body=Hi%20Dev%20Weekends%20Team%2C%0A%0A"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold text-xs uppercase tracking-[1px] hover:opacity-90 transition-all w-full justify-center mb-4"
              >
                <Mail className="w-4 h-4" />
                Send Email
              </a>
              
              <p className="text-xs text-muted-foreground">
                We typically respond within 24-48 hours
              </p>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}

