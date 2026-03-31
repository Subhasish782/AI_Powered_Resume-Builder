"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Upload,
  FileSearch,
  PenTool,
  Briefcase,
  History,
  LogOut,
  User,
  Settings,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const features = [
  {
    title: "Upload Resume",
    description: "Upload your existing PDF or DOCX resume for AI-powered analysis",
    icon: Upload,
    href: "/upload",
    color: "bg-blue-500",
    lightColor: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Analyze Resume",
    description: "Get ATS score, strengths, weaknesses and improvement suggestions",
    icon: FileSearch,
    href: "/analyze",
    color: "bg-green-500",
    lightColor: "bg-green-50 dark:bg-green-950/30",
    textColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Build Resume",
    description: "Create a professional resume from scratch with multiple templates",
    icon: PenTool,
    href: "/builder",
    color: "bg-purple-500",
    lightColor: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Job Match",
    description: "Match your resume against job descriptions for best fit",
    icon: Briefcase,
    href: "/match",
    color: "bg-orange-500",
    lightColor: "bg-orange-50 dark:bg-orange-950/30",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  {
    title: "Dashboard",
    description: "View your stats, analytics and recent activity at a glance",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "bg-pink-500",
    lightColor: "bg-pink-50 dark:bg-pink-950/30",
    textColor: "text-pink-600 dark:text-pink-400",
  },
  {
    title: "History",
    description: "Browse all your previously uploaded and analyzed resumes",
    icon: History,
    href: "/history",
    color: "bg-teal-500",
    lightColor: "bg-teal-50 dark:bg-teal-950/30",
    textColor: "text-teal-600 dark:text-teal-400",
  },
];

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for theme
  useEffect(() => { setMounted(true); }, []);

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <PenTool className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">ResumeAI</span>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/home" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/upload" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Upload
            </Link>
            <Link href="/builder" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Builder
            </Link>
          </nav>

          {/* Right Side - Theme + Profile */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
              suppressHydrationWarning
            >
              {mounted ? (
                theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 hover:bg-accent transition-colors"
              >
                {/* Avatar */}
                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {userInitials}
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {session?.user?.name?.split(" ")[0] || "User"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg overflow-hidden"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-border bg-muted/30">
                    <p className="text-sm font-semibold truncate">{session?.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      View Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile?tab=settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Settings
                    </Link>
                  </div>

                  <div className="border-t border-border py-1">
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Welcome back,{" "}
              <span className="text-primary">
                {session?.user?.name?.split(" ")[0] || "User"}
              </span>{" "}
              👋
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Your AI-powered resume toolkit. Build, analyze, and match your resume
              to land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Upload className="h-5 w-5" />
                  Upload Your Resume
                </Button>
              </Link>
              <Link href="/builder">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <PenTool className="h-5 w-5" />
                  Build from Scratch
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-center mb-10">What would you like to do?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link href={feature.href}>
                      <div className={`group rounded-xl p-6 border border-border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer`}>
                        <div className={`h-12 w-12 rounded-xl ${feature.lightColor} flex items-center justify-center mb-4`}>
                          <Icon className={`h-6 w-6 ${feature.textColor}`} />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            <FileText className="h-4 w-4" />
            ResumeAI — AI-powered resume builder &amp; analyzer
          </p>
        </div>
      </footer>
    </div>
  );
}
