'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Users,
  Users2,
  CalendarDays,
  Network,
  Globe,
  BookOpen,
  Tag,
  Briefcase,
  Rocket,
  MessageSquareQuote,
  FileText // <-- added for Blog
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { title: 'Ambassadors', href: '/admin/dashboard/ambassadors', icon: <Users className="w-5 h-5" /> },
  { title: 'Core Team', href: '/admin/dashboard/core-team', icon: <Users2 className="w-5 h-5" /> },
  { title: 'Sessions', href: '/admin/dashboard/sessions', icon: <CalendarDays className="w-5 h-5" /> },
  { title: 'Mentorship', href: '/admin/dashboard/mentorship', icon: <Network className="w-5 h-5" /> },
  { title: 'Network', href: '/admin/dashboard/add-mentorship', icon: <Globe className="w-5 h-5" /> },
  { title: 'Jobs', href: '/admin/dashboard/jobs', icon: <Briefcase className="w-5 h-5" /> },
  { title: 'Tags', href: '/admin/dashboard/tags', icon: <Tag className="w-5 h-5" /> },
  { title: 'MindMaster', href: '/admin/dashboard/mindmaster', icon: <BookOpen className="w-5 h-5" /> },
  { title: 'Resources', href: '/admin/dashboard/resources', icon: <BookOpen className="w-5 h-5" /> },
  { title: 'Projects', href: '/admin/dashboard/projects', icon: <Rocket className="w-5 h-5" /> },
  { title: 'Testimonials', href: '/admin/dashboard/testimonials', icon: <MessageSquareQuote className="w-5 h-5" /> },

  //  New Blog Route
  { title: 'News & Blog', href: '/blog', icon: <FileText className="w-5 h-5" /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
  const [collapsed, setCollapsed] = useState(false); // for desktop

  // Logout handler
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin';
  };

  // Sidebar width classes
  const sidebarWidth = collapsed ? 'w-20' : 'w-56';

  return (
    <div className="min-h-screen flex bg-background pt-16 md:pt-0">
      
      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-40 top-16 md:top-0 left-0 h-[calc(100vh-4rem)] md:h-auto ${sidebarWidth} border-r border-border flex flex-col transition-all duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          shadow-lg md:shadow-none
        `}
        style={{ minHeight: 'calc(100vh - 4rem)' }}
      >
        {/* Top: Toggle only */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {/* Collapse/Expand toggle (desktop only) */}
          <Button
            variant="ghost"
            size="icon"
            className={`hidden md:inline-flex rounded-full ${collapsed ? 'mx-auto' : ''}`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? <Menu className="w-6 h-6" /> : <X className="w-6 h-6" />}
          </Button>

          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-auto"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-1 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-lg px-2 py-2.5 my-1 transition-all duration-200
                ${pathname === item.href
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'hover:bg-muted text-muted-foreground'}
                ${collapsed ? 'justify-center px-0' : 'px-3'}
              `}
              onClick={() => setSidebarOpen(false)}
              title={collapsed ? item.title : undefined}
            >
              {item.icon}
              {!collapsed && <span className="text-base font-medium">{item.title}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout at bottom */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className={`w-full flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg ${collapsed ? 'px-0' : ''}`}
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Sidebar toggle button (hamburger, mobile only) */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed mt-4 top-14 left-4 z-50 md:hidden"
        aria-label="Open sidebar"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </Button>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-4 md:p-8 bg-background">
        {children}
      </main>
    </div>
  );
}