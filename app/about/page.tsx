'use client'

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

interface CoreTeamMember {
  _id: string;
  name: string;
  image: string;
  role: string;
  linkedin: string;
  order?: number;
}

// Members hidden from the "Meet the People Behind" section (matched by
// exact, trimmed, lower-cased name). The records still live in the DB.
const HIDDEN_MEMBERS = new Set(["muhammad ali", "muhammad faraz"]);

// Orders the core team for the "Meet the People Behind" section:
// Founder -> Moeez -> Abdul Moiz -> Chiefs/Officers -> Heads ->
// Senior Leads -> Program/Specialty Leads (GSOC, DevOps, etc.) ->
// generic Technical Leads -> Mentors -> Managers -> everyone else.
// Pinned people are matched by name; everyone else falls into a role tier.
function rankMember(m: CoreTeamMember): number {
  const name = (m.name || "").trim().toLowerCase();
  const role = (m.role || "").toLowerCase();

  if (name === "zeeshan adil" || role === "founder") return 0;
  if (name.includes("moeez")) return 1;
  if (name === "abdul moiz") return 2;

  if (role.includes("chief") || role.includes("officer")) return 10;
  if (role.includes("head")) return 20;
  if ((role.includes("sr.") || role.includes("senior")) && role.includes("lead")) return 30;
  // Specialty / program leads (GSOC, DevOps, Research, etc.) sit above
  // generic technical leads.
  if (role.includes("lead") && role.includes("technical")) return 45;
  if (role.includes("lead")) return 40;
  if (role.includes("mentor")) return 50;
  if (role.includes("manager")) return 60;
  return 70;
}

// Members with an admin-assigned order (> 0) come first, in that order.
// Anyone without an explicit order falls back to the role hierarchy, so the
// section stays sensible until orders are assigned in the admin dashboard.
function compareMembers(a: CoreTeamMember, b: CoreTeamMember): number {
  const oa = a.order && a.order > 0 ? a.order : null;
  const ob = b.order && b.order > 0 ? b.order : null;

  if (oa !== null && ob !== null) return oa - ob;
  if (oa !== null) return -1;
  if (ob !== null) return 1;
  return rankMember(a) - rankMember(b);
}

export default function AboutPage() {
  const [coreTeam, setCoreTeam] = useState<CoreTeamMember[]>([]);
  const [loadingCore, setLoadingCore] = useState(true);

  useEffect(() => {
    fetch('/api/core-team')
      .then(res => res.json())
      .then(data => {
        const list: CoreTeamMember[] = Array.isArray(data) ? data : [];
        setCoreTeam(
          list
            .filter((m) => !HIDDEN_MEMBERS.has((m.name || "").trim().toLowerCase()))
            .sort(compareMembers)
        );
      })
      .finally(() => setLoadingCore(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-16 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="max-w-[1100px] mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] font-semibold tracking-[3px] uppercase text-muted-foreground mb-4">
                About Dev Weekends
              </p>
              <h1 className="text-[clamp(32px,5vw,48px)] font-bold tracking-tight mb-6 leading-[1.1]">
                We Build{" "}
                <span className="relative inline-block">
                  Engineers
                  <span className="absolute -bottom-1 left-0 w-full h-2 bg-yellow-300 -z-10"></span>
                </span>{" "}
                Who Change Lives
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Your Gateway to becoming a better Software Engineer
              </p>
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/our-story" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold text-xs uppercase tracking-[1px] hover:opacity-90 transition-all"
                >
                  Our Full Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a 
                  href="https://discord.gg/Cy7Rgkf4Up"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-foreground/20 font-semibold text-xs uppercase tracking-[1px] hover:bg-foreground hover:text-background transition-all"
                >
                  Join Community
                </a>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden">
              <Image 
                src="https://res.cloudinary.com/dcrgvq3lf/image/upload/v1748606356/about_img_lcygp4.jpg" 
                alt="Dev Weekends Meetup" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 px-6 lg:px-12 bg-foreground text-background">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "20K+", label: "Community Members" },
              { value: "1600+", label: "Engineers Trained" },
              { value: "200+", label: "Sessions Delivered" },
              { value: "100%", label: "Free Forever" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-[10px] tracking-[2px] uppercase text-background/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-16 px-6 lg:px-12 bg-muted/20">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[3px] uppercase text-muted-foreground mb-4">
              Our Mission
            </p>
            <h2 className="text-[clamp(28px,4vw,42px)] font-bold tracking-tight mb-4">
              Why We Exist
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1px] bg-border">
            <div className="bg-background p-8 lg:col-span-2">
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                We started Dev Weekends because we saw brilliant minds falling through the cracks. 
                Students with incredible potential but no roadmap. Engineers who could build anything 
                but didn&apos;t know where to start. A generation of talent lost to a broken system.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                So we built something different. A community where engineers at top companies mentor 
                the next generation. Where practice isn&apos;t optional—it&apos;s daily. Where success is measured 
                not by what you know, but by how many lives you change after your own transformation.
              </p>
            </div>
            <div className="bg-background p-8">
              <h3 className="text-base font-bold mb-4">What We Believe</h3>
              <ul className="space-y-3">
                {[
                  "Talent is everywhere, opportunity is not",
                  "The best mentors are those who remember struggling",
                  "Practice beats theory, always",
                  "Community accelerates everything",
                  "Free education is a right, not a privilege",
                ].map((belief, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2.5">
                    <span className="w-1 h-1 bg-foreground/30 mt-2 flex-shrink-0"></span>
                    <span>{belief}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Circles Ecosystem */}
      <section className="py-12 md:py-16 px-6 lg:px-12 bg-muted/20">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[3px] uppercase text-muted-foreground mb-4">
              The Circles Ecosystem
            </p>
            <h2 className="text-[clamp(28px,4vw,42px)] font-bold tracking-tight mb-4">
              Specialized Communities Within
            </h2>
            <p className="text-base text-muted-foreground max-w-[500px] mx-auto">
              Join focused circles based on your interests and goals
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Open Source Alpha", desc: "Beginner open source contributors", color: "border-l-blue-500" },
              { title: "Open Source Beta", desc: "Intermediate contributors on real projects", color: "border-l-purple-500" },
              { title: "X-Team", desc: "Elite performers building production systems", color: "border-l-red-500" },
              { title: "Co-Working", desc: "Virtual sessions for focused productivity", color: "border-l-green-500" },
              { title: "ICPC Team", desc: "Competitive programming for ICPC", color: "border-l-orange-500" },
              { title: "GSoC Prep", desc: "Google Summer of Code preparation", color: "border-l-cyan-500" },
              { title: "Interview Prep", desc: "Mock interviews and placement prep", color: "border-l-pink-500" },
              { title: "2-Day Startup", desc: "Onsite weekend sprints to beat procrastination", color: "border-l-yellow-500" },
              { title: "Hackathon Circle", desc: "Building flawlessly engineered products", color: "border-l-emerald-500" },
              { title: "Weekend Deep-Dives", desc: "Topic-focused intensive sessions", color: "border-l-amber-500" },
              { title: "Remote Job Placement", desc: "Landing international remote opportunities", color: "border-l-teal-500" },
            ].map((circle, i) => (
              <div 
                key={i} 
                className={`bg-muted/30 p-5 border-l-4 ${circle.color} hover:bg-muted/50 transition-all duration-300`}
              >
                <h4 className="text-sm font-bold mb-1">{circle.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{circle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Internal Engine */}
      <section className="py-12 md:py-16 px-6 lg:px-12 bg-muted/20">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[3px] uppercase text-muted-foreground mb-4">
              The Internal Engine
            </p>
            <h2 className="text-[clamp(28px,4vw,42px)] font-bold tracking-tight mb-4">
              How We Stay Cutting Edge
            </h2>
            <p className="text-base text-muted-foreground max-w-[500px] mx-auto">
              Our internal teams ensure you always get the best guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-border">
            {[
              {
                title: "Policy & Strategy Team",
                points: [
                  "Continuously evaluating approaches",
                  "Rethinking resources and methods",
                  "Testing everything before deployment",
                ],
              },
              {
                title: "Curriculum Development",
                points: [
                  "Well-planned and tested assignments",
                  "Personalized guidance, no generic advice",
                  "Regular updates based on industry trends",
                ],
              },
              {
                title: "Resource Curation",
                points: [
                  "Weekly article sharing (3 articles/week)",
                  "Curated book recommendations",
                  "Interview question databases",
                ],
              },
              {
                title: "Quality Assurance",
                points: [
                  "Mock interviews (up to 5 levels)",
                  "Project audits and case studies",
                  "Resume, LinkedIn, portfolio reviews",
                ],
              },
            ].map((team, i) => (
              <div 
                key={i} 
                className="bg-background p-7"
              >
                <h3 className="text-base font-bold mb-4">{team.title}</h3>
                <ul className="space-y-2">
                  {team.points.map((point, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2.5">
                      <span className="w-1 h-1 bg-foreground/30 mt-2 flex-shrink-0"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-16 px-6 lg:px-12 bg-foreground text-background">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[3px] uppercase text-background/40 mb-4">
              Core Team
            </p>
            <h2 className="text-[clamp(28px,4vw,42px)] font-bold tracking-tight">
              Meet the People Behind
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-background/10">
            {loadingCore ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-foreground p-6 text-center animate-pulse">
                  <div className="w-20 h-20 mx-auto mb-4 bg-background/20 rounded-full" />
                  <div className="h-4 w-24 mx-auto bg-background/20 mb-2" />
                  <div className="h-3 w-16 mx-auto bg-background/10" />
                </div>
              ))
            ) : (
              coreTeam.map((member) => (
                <a
                  key={member._id}
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-foreground p-6 text-center group hover:bg-foreground/90 transition-all"
                >
                  <div className="relative w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full">
                    <Image
                      src={member.image || '/placeholder-avatar.jpg'}
                      alt={member.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-semibold mb-1 group-hover:underline">{member.name}</h3>
                  <p className="text-xs text-background/50">{member.role}</p>
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-6 lg:px-12 text-center bg-muted/20">
        <div className="max-w-[600px] mx-auto">
          <h2 className="text-[clamp(28px,4vw,42px)] font-bold tracking-tight mb-4">
            Ready to Transform?
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Join 20,000+ engineers who chose to stop waiting and start building. 
            Your transformation starts with one decision. It&apos;s free, forever.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a 
              href="https://discord.gg/Cy7Rgkf4Up"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background font-semibold text-xs uppercase tracking-[2px] hover:opacity-90 transition-all"
            >
              Join Discord Community
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link 
              href="/fellowship" 
              className="inline-flex items-center gap-2 px-8 py-4 border border-foreground/20 font-semibold text-xs uppercase tracking-[2px] hover:bg-foreground hover:text-background transition-all"
            >
              Apply for Fellowship
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}




