"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Code2,
  Users,
  Trophy,
  Target,
  CheckCircle,
  ArrowRight,
  Globe,
  Award,
  Lightbulb,
  Rocket,
  TrendingUp,
  Briefcase,
  Sparkles,
  ChevronRight,
  Play,
  Star,
  Clock,
  Brain,
  Code,
  Database,
  Server,
  Layers,
  Calendar,
  X,
  UserPlus,
  Headphones,
  VideoIcon,
  MessageCircle,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

export default function MentorshipPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0])
  const [timelineProgress, setTimelineProgress] = useState(0)
  const statsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [hasAnimatedStats, setHasAnimatedStats] = useState(false)
  const [hasAnimatedTimeline, setHasAnimatedTimeline] = useState(false)
  const [showModal, setShowModal] = useState(true)

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      setScrollY(window.scrollY)

      if (statsRef.current && !hasAnimatedStats) {
        const rect = statsRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setHasAnimatedStats(true)
          animateStats()
        }
      }

      if (timelineRef.current && !hasAnimatedTimeline) {
        const rect = timelineRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setHasAnimatedTimeline(true)
          animateTimeline()
        }
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [hasAnimatedStats, hasAnimatedTimeline])

  const animateStats = () => {
    const targets = [30, 12, 300, 3]
    const duration = 2000
    const steps = 60
    const increment = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedStats(targets.map((target) => Math.floor(target * easeOut)))

      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedStats(targets)
      }
    }, increment)
  }

  const animateTimeline = () => {
    let progress = 0
    const timer = setInterval(() => {
      progress += 2
      setTimelineProgress(progress)
      if (progress >= 100) {
        clearInterval(timer)
      }
    }, 30)
  }

  const handleApplyClick = () => {
    window.open(
      "https://forms.gle/48tZYzJn2zzUQ1EC6","_blank",
    )
  }

  const levels = [
    {
      level: 0,
      title: "Foundation Track",
      subtitle: "Complete Beginner Journey",
      description: "Perfect for absolute beginners starting their coding journey with comprehensive support",
      duration: "3 months",
      intensity: "Beginner Friendly",
      liveSessions: "20 Live Sessions",
      mentorshipHours: "24 Hours 1:1 Mentorship",
      dsaSessions: "30 DSA Sessions",
      engineeringSessions: "12 Engineering Grind Sessions",
      highlights: [
        "Programming fundamentals from scratch",
        "Web development essentials",
        "Data structures & algorithms basics",
        "Weekly 1:1 mentor sessions",
        "Live coding workshops twice a week",
        "Personal project guidance"
      ],
      icon: <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />,
      achievement: "Mentee → Foundation Level"
    },
    {
      level: 1,
      title: "Professional Track",
      subtitle: "Industry-Ready Development",
      description: "For engineers with basic knowledge aiming for professional excellence",
      duration: "3 months",
      intensity: "Moderate Pace",
      liveSessions: "20 Live Sessions",
      dsaSessions: "30 DSA Sessions",
      engineeringSessions: "12 Engineering Grind Sessions",
      highlights: [
        "Advanced data structures mastery",
        "Complex algorithms & optimization",
        "System design fundamentals",
        "Bi-weekly 1:1 mentor sessions",
        "Mock interviews with feedback",
        "Open source contribution guidance"
      ],
      icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />,
      achievement: "Foundation → Professional Level"
    }
  ]

  const timelineData = [
    {
      month: "Month 1",
      title: "Foundation & Core Skills",
      description: "Master programming fundamentals, DSA basics, and web development essentials through intensive DSA grind sessions and engineering workshops. Build your first portfolio projects with expert mentor guidance.",
      milestone: "Complete Core Foundations & First Projects",
      features: [
        "30 DSA Grind Sessions (3/week)",
        "6 Engineering Grind Sessions",
        "6 Deep Grind Projects",
        "8+ Mentor Sessions (1:1)",
        "LeetCode 100-200 problems",
        "MERN stack fundamentals"
      ]
    },
    {
      month: "Month 2",
      title: "Advanced DSA & System Design",
      description: "Deep dive into complex algorithms, advanced data structures, and system design patterns. Work on real-world projects, contribute to open source, and prepare for technical interviews.",
      milestone: "Advanced Problem Solving & System Design",
      features: [
        "15+ DSA Grind Sessions",
        "3 Engineering Grind Sessions",
        "3 Major Projects",
        "4+ Mentor Sessions (1:1)",
        "LeetCode 300-400 problems",
        "System design fundamentals",
        "Open source contributions"
      ]
    },
    {
      month: "Month 3",
      title: "Industry Readiness & Job Preparation",
      description: "Master advanced system design, work on capstone projects, prepare for interviews with mock sessions, optimize your portfolio, and get ready for job applications with career guidance.",
      milestone: "Industry Ready & Job Placement",
      features: [
        "15+ DSA Grind Sessions",
        "3 Engineering Grind Sessions",
        "3 Portfolio Projects",
        "4+ Mentor Sessions (1:1)",
        "LeetCode 400+ problems",
        "Mock interviews & feedback",
        "Resume & LinkedIn optimization",
        "Job application strategy"
      ]
    }
  ]

  const mentorshipFeatures = [
    {
      title: "Personal Mentor Assignment",
      icon: <UserPlus className="h-6 w-6 sm:h-8 sm:w-8" />,
      description: "Get matched with an experienced industry mentor based on your goals and learning style",
      details: [
        "Dedicated mentor throughout program",
        "Personalized learning path",
        "Career guidance & planning",
        "Project review & feedback",
        "Industry insights & networking"
      ]
    },
    {
      title: "Live Interactive Sessions",
      icon: <VideoIcon className="h-6 w-6 sm:h-8 sm:w-8" />,
      description: "Attend live coding sessions, workshops, and Q&A with instructors and industry experts",
      details: [
        "2 live sessions per week",
        "Interactive problem solving",
        "Real-time doubt clearing",
        "Peer collaboration",
        "Session recordings available"
      ]
    },
    {
      title: "1:1 Mentorship Hours",
      icon: <Headphones className="h-6 w-6 sm:h-8 sm:w-8" />,
      description: "Regular one-on-one sessions with your mentor for personalized guidance and support",
      details: [
        "Weekly/Bi-weekly sessions",
        "Customized problem solving",
        "Code review & optimization",
        "Interview preparation",
        "Career counseling"
      ]
    }
  ]

  const grindSessions = [
    {
      title: "DSA Grind Sessions",
      icon: <Brain className="h-6 w-6 sm:h-8 sm:w-8" />,
      sessions: "30 Deep Sessions",
      description: "Intensive data structures and algorithms training with 20+ hours of pre-recorded content",
      details: [
        "3 sessions per week",
        "2 hours each session",
        "20+ hours of pre-recorded content",
        "LeetCode practice (100, 200, 300, 400, 1000+)",
        "MERN stack integration"
      ]
    },
    {
      title: "Engineering Grind Sessions",
      icon: <Code className="h-6 w-6 sm:h-8 sm:w-8" />,
      sessions: "12 Weekend Sessions",
      description: "Hands-on engineering and project development with 20+ hours of pre-recorded content",
      details: [
        "Every weekend session",
        "20+ hours of pre-recorded content",
        "JS, React, Redux, Node.js",
        "Database design & architecture",
        "Microservices & system design",
        "AWS, Docker, Kubernetes",
        "CI/CD & DevOps practices"
      ]
    },
    {
      title: "Deep Grind Projects",
      icon: <Layers className="h-6 w-6 sm:h-8 sm:w-8" />,
      sessions: "12 Major Projects",
      description: "Real-world project development with expert guidance and 20+ hours of pre-recorded content",
      details: [
        "1 project per weekend",
        "20+ hours of pre-recorded content",
        "Expert mentor guidance",
        "Industry-standard practices",
        "Portfolio-ready applications",
        "Deployment & optimization"
      ]
    }
  ]

  const techStack = [
    { name: "JavaScript", sessions: "2 hours", icon: <Code2 className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: "React", sessions: "2 hours", icon: <Code className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: "Redux", sessions: "2 hours", icon: <Database className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: "Node.js", sessions: "2 hours", icon: <Server className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: "Database Design", sessions: "2 hours", icon: <Database className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: "System Architecture", sessions: "2 hours", icon: <Layers className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: "Next.js", sessions: "2 hours", icon: <Rocket className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: "Microservices", sessions: "3x HLD Design", icon: <Globe className="h-4 w-4 sm:h-5 sm:w-5" /> },
  ]

  const mentorshipPerks = [
    "Free Access to All Live Sessions",
    "Dedicated Personal Mentor",
    "1:1 Mentorship Hours",
    "Job Placement Assistance",
    "Industry Referrals",
    "Mock Interview Practice",
    "Certificate of Completion",
    "Lifetime Community Access",
    "Project Portfolio Development",
    "Resume & LinkedIn Optimization",
    "Exclusive Industry Workshops",
    "Peer Learning Groups",
  ]

  const achievementTags = [
    { level: "Mentee", requirements: "Entry level" },
    { level: "Foundation Level", requirements: "Complete foundation track" },
    { level: "Professional Level", requirements: "Complete professional track" },
    { level: "Industry Ready", requirements: "Job placement achieved" },
  ]

  const stats = [
    {
      number: animatedStats[0],
      suffix: "",
      label: "DSA Grind Sessions",
      icon: <Brain className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
      number: animatedStats[1],
      suffix: "",
      label: "Weekend Projects",
      icon: <Code className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
      number: animatedStats[2],
      suffix: "+",
      label: "LeetCode Problems",
      icon: <Target className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
      number: animatedStats[3],
      suffix: " Months",
      label: "Intensive Program",
      icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
  ]

  const progressMetrics = [
    { label: "Placement Rate", value: 92, icon: <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { label: "Mentor Satisfaction", value: 98, icon: <Star className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { label: "Skill Improvement", value: 95, icon: <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { label: "Project Completion", value: 90, icon: <Trophy className="h-4 w-4 sm:h-5 sm:w-5" /> },
  ]

  return (
    <div>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Overlay for blur and dim, closes modal on click */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300"
            onClick={() => setShowModal(false)}
          />
          <Card className="max-w-md w-full relative z-10 animate-modalIn">
            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="absolute top-2 right-2">
              <X className="w-5 h-5" />
            </Button>
            <CardHeader>
              <CardTitle>3-Month Mentorship Program</CardTitle>
              <CardDescription>
                <span className="font-semibold text-green-600">100% Free - No hidden costs!</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>20 Live interactive sessions with industry experts</li>
                <li>Personal mentor assigned for your entire journey</li>
                <li>Job placement assistance and industry referrals</li>
                <li className="font-bold text-primary">Limited seats - Apply now!</li>
                <li>Selection based on commitment and passion to learn</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
      <div className={`min-h-screen bg-background text-foreground overflow-x-hidden transition-all duration-300 ${showModal ? 'blur-sm brightness-75 pointer-events-none select-none' : ''}`}>
        {/* Hero Section */}
        <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 xl:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/30"></div>
          <div
            className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/5 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          ></div>
          <div
            className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary/3 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          ></div>

          <div className="container mx-auto relative z-10 animate-heroFadeIn">
            <div
              className={`text-center transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <Badge
                variant="outline"
                className="mb-6 sm:mb-8 border-primary text-primary px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm"
              >
                <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                2026 Cohort - 3-Month Mentorship Program
              </Badge>

              <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-8 leading-[1.1] sm:leading-[0.9] tracking-tight">
                Dev Weekends
                <br />
                <span className="relative inline-block mt-2 sm:mt-0">
                  <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 sm:px-4 md:px-6 py-2 sm:py-3 inline-block transform -rotate-1 rounded-lg text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                    Mentorship 2026
                  </span>
                </span>
              </h1>
              <p className="text-sm sm:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4">
                <strong>3-month comprehensive mentorship program with live sessions</strong>
                <br className="hidden sm:block" />
                Get personal mentorship, attend live coding sessions, and become job-ready with our industry-focused curriculum.
              </p>

              <div className="flex flex-row flex-wrap sm:flex-row gap-3 sm:gap-6 justify-center items-center mb-8 sm:mb-16 px-4">
                <Button
                  size="lg"
                  onClick={handleApplyClick}
                  className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 px-4 sm:px-12 py-2.5 sm:py-5 rounded-lg text-sm sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 min-w-[140px] sm:w-auto"
                >
                  Apply for Mentorship
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                {/* <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('mentorship')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex-1 sm:flex-none border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 sm:px-12 py-2.5 sm:py-5 rounded-lg text-sm sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 min-w-[140px] sm:w-auto"
                >
                  Learn About Mentorship
                </Button> */}
              </div>
              <p className="text-center text-xs sm:text-sm text-muted-foreground max-w-3xl mx-auto px-6 ">
                Whether you're starting from scratch or already have experience and feel stuck, this mentorship is for you. Already building? Use our 1:1 guidance to level up and target better companies.
              </p>

              {/* Palestine Support Banner */}
              <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-4 px-6 py-3 bg-primary border border-border">
                  {/* Palestine Flag */}
                  <div className="w-20 h-14 sm:w-24 sm:h-16 relative overflow-hidden flex-shrink-0 border border-white/20">
                    {/* Black stripe */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-black"></div>
                    {/* White stripe */}
                    <div className="absolute top-1/3 left-0 right-0 h-1/3 bg-white"></div>
                    {/* Green stripe */}
                    <div className="absolute top-2/3 left-0 right-0 h-1/3 bg-[#009736]"></div>
                    {/* Red triangle */}
                    <div className="absolute top-0 left-0 w-0 h-0 border-t-[28px] sm:border-t-[32px] border-t-transparent border-b-[28px] sm:border-b-[32px] border-b-transparent border-l-[32px] sm:border-l-[40px] border-l-[#CE1126]"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base font-semibold text-primary-foreground">
                      🇵🇸 We Stand With Palestine
                    </span>
                    <span className="text-xs sm:text-sm text-primary-foreground/70 font-medium">
                      Exclusive Access for Palestinians
                    </span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          ref={statsRef}
          className="py-8 sm:py-12 lg:py-16 bg-primary text-primary-foreground relative overflow-hidden"
        >
          <div
            className="absolute top-0 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-primary-foreground/5 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          ></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-3 sm:mb-4 p-2 sm:p-3 bg-primary-foreground/10 rounded-full w-fit mx-auto group-hover:bg-primary-foreground/20 transition-all duration-300 group-hover:scale-110">
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2 transition-all duration-300">
                    {stat.number}
                    {stat.suffix}
                  </div>
                  <div className="text-primary-foreground/70 font-medium text-xs sm:text-sm lg:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Mentorship Section - NEW */}
        <section
          id="mentorship"
          className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/30"></div>

          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <Badge
                variant="outline"
                className="mb-4 sm:mb-6 border-primary text-primary px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm"
              >
                <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Direct Mentorship Program
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
                Personal Mentorship That Transforms
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Get matched with industry experts who guide you through your entire learning journey with personalized support
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mb-12 sm:mb-16">
              {mentorshipFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-xl group bg-card/80 backdrop-blur-sm hover:-translate-y-1"
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                      {feature.description}
                    </CardDescription>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-muted-foreground">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-primary flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section
          id="timeline"
          ref={timelineRef}
          className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/30"></div>

          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <Badge
                variant="outline"
                className="mb-4 sm:mb-6 border-primary text-primary px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm"
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Program Timeline
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
                Your 3-Month Transformation
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                A structured journey from beginner to industry-ready engineer with continuous mentorship
              </p>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
                Suitable for all levels — start from zero, get unstuck, or accelerate as an experienced engineer with our Foundation and Professional tracks.
              </p>
            </div>

            {/* Desktop Timeline */}
            <div className="hidden lg:block max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-border"></div>
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary transition-all duration-2000 ease-out"
                  style={{ height: `${timelineProgress}%` }}
                ></div>

                {/* Timeline Items */}
                <div className="space-y-16">
                  {timelineData.map((item, index) => (
                    <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                      <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                        <Card className="border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg">
                          <CardHeader className="pb-3">
                            <Badge variant="outline" className="w-fit border-primary text-primary mb-2 text-xs">
                              {item.month}
                            </Badge>
                            <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-muted-foreground mb-3 text-base">{item.description}</p>
                            <div className="flex items-center text-primary font-semibold text-sm mb-3">
                              <Trophy className="h-4 w-4 mr-2" />
                              {item.milestone}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {item.features.map((feature, fIndex) => (
                                <Badge key={fIndex} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Timeline Node */}
                      <div className="relative z-10">
                        <div className="w-6 h-6 bg-primary rounded-full border-4 border-background shadow-lg"></div>
                      </div>

                      <div className="w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Timeline */}
            <div className="lg:hidden max-w-2xl mx-auto">
              <div className="relative">
                {/* Mobile Timeline Line - positioned on the left */}
                <div className="absolute left-6 top-0 w-0.5 h-full bg-border"></div>
                <div
                  className="absolute left-6 top-0 w-0.5 bg-primary transition-all duration-2000 ease-out"
                  style={{ height: `${timelineProgress}%` }}
                ></div>

                {/* Mobile Timeline Items */}
                <div className="space-y-8">
                  {timelineData.map((item, index) => (
                    <div key={index} className="flex items-start">
                      {/* Timeline Node */}
                      <div className="relative z-10 mr-6">
                        <div className="w-3 h-3 bg-primary rounded-full border-2 border-background shadow-lg"></div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <Card className="border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg">
                          <CardHeader className="pb-3">
                            <Badge variant="outline" className="w-fit border-primary text-primary mb-2 text-xs">
                              {item.month}
                            </Badge>
                            <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-muted-foreground mb-3 text-sm">{item.description}</p>
                            <div className="flex items-center text-primary font-semibold text-sm mb-3">
                              <Trophy className="h-3 w-3 mr-2" />
                              {item.milestone}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.features.map((feature, fIndex) => (
                                <Badge key={fIndex} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Overview - Grind Sessions */}
        <section
          id="program"
          className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/30"></div>

          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <Badge
                variant="outline"
                className="mb-4 sm:mb-6 border-primary text-primary px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm"
              >
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Comprehensive Program Structure
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
                What Makes Us Different
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Our comprehensive 3-month program combines intensive DSA training, hands-on engineering projects, and expert
                mentorship to make you industry-ready.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto mb-12 sm:mb-16">
              {grindSessions.map((session, index) => (
                <Card
                  key={index}
                  className="border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-xl group bg-card/80 backdrop-blur-sm hover:-translate-y-1"
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                      {session.icon}
                    </div>
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
                      {session.title}
                    </CardTitle>
                    <Badge variant="outline" className="w-fit border-primary text-primary text-xs">
                      {session.sessions}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                      {session.description}
                    </CardDescription>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {session.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-muted-foreground">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-primary flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Levels Section */}
        <section
          id="levels"
          className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/30"></div>

          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <Badge
                variant="outline"
                className="mb-4 sm:mb-6 border-primary text-primary px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm"
              >
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Choose Your Level
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
                DSA & Engineering Tracks
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Progress through our structured levels designed for different experience stages
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
              {levels.map((level, index) => (
                <Card
                  key={index}
                  className={`relative overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer group ${
                    selectedLevel === index
                      ? "border-primary shadow-xl scale-105"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => setSelectedLevel(index)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-background opacity-50 group-hover:opacity-70 transition-opacity"></div>

                  <CardHeader className="relative z-10 pb-3 sm:pb-4">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          {level.icon}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-muted-foreground">LEVEL {level.level}</div>
                      </div>
                    </div>

                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 tracking-tight">
                      {level.title}
                    </CardTitle>
                    <CardDescription className="text-base sm:text-lg text-muted-foreground font-medium">
                      {level.subtitle}
                    </CardDescription>
                    <p className="text-muted-foreground mt-2 sm:mt-3 leading-relaxed text-sm sm:text-base">
                      {level.description}
                    </p>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                        <div className="text-xs sm:text-sm font-semibold text-muted-foreground">DSA Sessions</div>
                        <div className="text-base sm:text-lg font-bold">{level.dsaSessions}</div>
                      </div>
                      <div className="p-2.5 sm:p-3 bg-muted rounded-lg">
                        <div className="text-xs sm:text-sm font-semibold text-muted-foreground">Engineering</div>
                        <div className="text-base sm:text-lg font-bold">{level.engineeringSessions}</div>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      {level.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex items-center text-muted-foreground">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary flex-shrink-0" />
                          <span className="font-medium text-xs sm:text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-muted rounded-lg">
                      <div className="text-xs sm:text-sm font-semibold text-muted-foreground">Achievement Path</div>
                      <div className="text-foreground font-bold text-sm sm:text-base">{level.achievement}</div>
                    </div>

                    <Button
                      onClick={handleApplyClick}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 sm:py-4 rounded-lg font-semibold group text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Choose This Track
                      <ChevronRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <Badge
                variant="outline"
                className="mb-4 sm:mb-6 border-primary-foreground text-primary-foreground px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm"
              >
                <Code className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Technology Focus
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
                Engineering Grind Sessions
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-primary-foreground/70 max-w-4xl mx-auto leading-relaxed">
                Master modern technologies with dedicated 2-hour sessions each weekend and 20+ hours of pre-sessions content
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {techStack.map((tech, index) => (
                <Card
                  key={index}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-300 group"
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="p-1.5 sm:p-2 bg-primary-foreground/20 rounded-lg group-hover:scale-110 transition-transform">
                        {tech.icon}
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-xs"
                      >
                        {tech.sessions}
                      </Badge>
                    </div>
                    <CardTitle className="text-base sm:text-lg font-bold">{tech.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="mt-12 sm:mt-16 text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Plus Advanced Topics</h3>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                {["ORM (Prisma/TypeORM)", "Microservices", "System Design", "Interview Prep"].map((topic, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-primary-foreground text-primary-foreground px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mentorship Perks */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/30"></div>

          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <Badge
                variant="outline"
                className="mb-4 sm:mb-6 border-primary text-primary px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm"
              >
                <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Exclusive Benefits
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight">
                Mentorship Perks
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Exclusive benefits for all mentorship program participants
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {mentorshipPerks.map((perk, index) => (
                <Card
                  key={index}
                  className="border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-lg group"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-foreground text-sm sm:text-base">{perk}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Application Section */}
        <section
          id="apply"
          className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground relative overflow-hidden"
        >
          <div className="container mx-auto text-center relative z-10">
            <Badge
              variant="outline"
              className="mb-6 sm:mb-8 border-primary-foreground text-primary-foreground px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium text-xs sm:text-sm"
            >
              <Rocket className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Join the Mentorship
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 tracking-tight">
              Ready to Get Industry-Ready?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-primary-foreground/70 mb-12 sm:mb-16 max-w-4xl mx-auto leading-relaxed">
              Join our comprehensive 3-month mentorship program and crack big companies. Limited seats available -
              applications reviewed on rolling basis.
            </p>

            <div className="mb-12 sm:mb-16">
              <Button
                size="lg"
                onClick={handleApplyClick}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-10 sm:px-16 py-4 sm:py-5 rounded-lg text-lg sm:text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                Apply for Fellowship 2026
                <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto">
              {[
                {
                  icon: <Lightbulb className="h-8 w-8 sm:h-10 sm:w-10" />,
                  title: "Application",
                  description: "Submit application with coding background",
                },
                {
                  icon: <Users className="h-8 w-8 sm:h-10 sm:w-10" />,
                  title: "Assessment",
                  description: "Technical assessment and interview",
                },
                {
                  icon: <Rocket className="h-8 w-8 sm:h-10 sm:w-10" />,
                  title: "Start Learning",
                  description: "Begin your 3-month transformation",
                },
              ].map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-primary-foreground/20 transition-all duration-300 group-hover:scale-110">
                    {step.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 tracking-tight">{step.title}</h3>
                  <p className="text-primary-foreground/70 text-base sm:text-lg leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}