"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Upload,
  FileSearch,
  PenTool,
  Briefcase,
  History,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  User,
  Settings,
  ChevronUp,
  LayoutTemplate,
} from "lucide-react";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard",  href: "/dashboard",  icon: LayoutDashboard },
  { title: "Upload Resume", href: "/upload",  icon: Upload },
  { title: "Analyze",    href: "/analyze",    icon: FileSearch },
  { title: "Builder",    href: "/builder",    icon: PenTool },
  { title: "Templates",  href: "/templates",  icon: LayoutTemplate },
  { title: "Job Match",  href: "/match",      icon: Briefcase },
  { title: "History",    href: "/history",    icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobileMenuOpen ? 0 : -100 + "%",
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-card border-r border-border",
          "lg:translate-x-0 lg:static"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <PenTool className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">ResumeAI</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-border p-4 space-y-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={toggleTheme}
              suppressHydrationWarning
            >
              {mounted ? (
                theme === "dark" ? (
                  <><Sun className="h-5 w-5" />Light Mode</>
                ) : (
                  <><Moon className="h-5 w-5" />Dark Mode</>
                )
              ) : (
                <><Moon className="h-5 w-5" />Dark Mode</>
              )}
            </Button>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent transition-colors"
              >
                {/* Avatar */}
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold shrink-0">
                  {userInitials}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium truncate">{session?.user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{session?.user?.email || ""}</p>
                </div>
                <ChevronUp
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    !isProfileMenuOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                  >
                    <Link
                      href="/profile"
                      onClick={() => { setIsProfileMenuOpen(false); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                    >
                      <User className="h-4 w-4" />
                      View Profile
                    </Link>
                    <Link
                      href="/profile?tab=settings"
                      onClick={() => { setIsProfileMenuOpen(false); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <div className="border-t border-border" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
