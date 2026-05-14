"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const pathname = usePathname();

  const routes = [
    { href: "/about", label: "About" },
    { href: "/mindmaster", label: "MindMaster" },
    { href: "/careers", label: "Careers" },
    { href: "https://resources.devweekends.com", label: "Resources", external: true },
    { href: "/blog", label: "News & Blog" }, 

  ];

  const communityOptions = [
    { href: "/projects", label: "Projects" },
    { href: "/testimonials", label: "Testimonials" },
  ];

  const applyOptions = [
    { href: "/dsoc", label: "DSOC" },
    { href: "/fellowship", label: "Fellowship" },
    { href: "/mentorship", label: "Mentorship" },
    { href: "/ambassador-program", label: "Ambassadorship" },
    { href: "/weekend-tech-grind", label: "Weekend Grind" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-10 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/our-story" className="flex items-center space-x-2">
              <span className="sm:inline-block text-[1.1rem] sm:text-[1.2rem] font-bold tracking-[-0.015em] leading-none">
                Dev Weekends
              </span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Community Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCommunityOpen(!isCommunityOpen)}
                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${
                  isActive('/projects') || isActive('/testimonials')
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Community
                <ChevronDown className={`w-3 h-3 transition-transform ${isCommunityOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCommunityOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCommunityOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-48 bg-background border border-border shadow-lg z-50 rounded-md overflow-hidden">
                    {communityOptions.map((option) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsCommunityOpen(false)}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Main Routes */}
            {routes.map((route) =>
              route.external ? (
                <a
                  key={route.href}
                  href={route.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {route.label}
                </a>
              ) : (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(route.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {route.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center space-x-4">
            <ModeToggle />

            {/* Join Community */}
            <a
              href="https://discord.gg/Cy7Rgkf4Up"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 border border-foreground/20 text-xs font-semibold uppercase tracking-[1px] hover:bg-foreground hover:text-background transition-all"
            >
              Join Community
            </a>

            {/* Apply Dropdown */}
            <div className="relative hidden md:block">
              <Button
                onClick={() => setIsApplyOpen(!isApplyOpen)}
                className="uppercase tracking-[1px] text-xs font-semibold flex items-center gap-1"
              >
                Apply Now
                <ChevronDown className={`w-3 h-3 transition-transform ${isApplyOpen ? 'rotate-180' : ''}`} />
              </Button>

              {isApplyOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsApplyOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border shadow-lg z-50">
                    {applyOptions.map((option) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        onClick={() => setIsApplyOpen(false)}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {routes.map((route) =>
                route.external ? (
                  <a
                    key={route.href}
                    href={route.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-muted-foreground hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {route.label}
                  </a>
                ) : (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`text-sm font-medium ${
                      isActive(route.href)
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {route.label}
                  </Link>
                )
              )}

              {/* Community */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-[2px] text-muted-foreground mb-3">
                  Community
                </p>
                {communityOptions.map((option) => (
                  <Link
                    key={option.href}
                    href={option.href}
                    className="block py-2 text-sm font-medium text-foreground"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>

              {/* Apply */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-[2px] text-muted-foreground mb-3">
                  Apply
                </p>
                {applyOptions.map((option) => (
                  <Link
                    key={option.href}
                    href={option.href}
                    className="block py-2 text-sm font-medium text-foreground"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}