"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResumePreview } from "@/components/resume/resume-preview";
import { PenTool, ExternalLink, CheckCircle } from "lucide-react";

const TEMPLATES = [
  {
    id: "modern",
    label: "Modern",
    description: "Clean blue gradient header with pill-shaped skill tags. Perfect for tech and creative roles.",
    badge: "⭐ Most Popular",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    accent: "from-blue-600 to-blue-400",
    tags: ["Tech", "Creative", "Marketing"],
  },
  {
    id: "classic",
    label: "Classic",
    description: "Timeless serif typography with a centered header. A traditional choice for finance, law, and academia.",
    badge: "🏛️ Timeless",
    badgeColor: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    accent: "from-gray-800 to-gray-600",
    tags: ["Finance", "Law", "Academia"],
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Light weight with generous whitespace and a two-column date layout. Less is more.",
    badge: "🤍 Clean",
    badgeColor: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    accent: "from-slate-400 to-slate-200",
    tags: ["Design", "Writing", "Consulting"],
  },
  {
    id: "professional",
    label: "Professional",
    description: "Emerald sidebar with timeline accents. Great for operations, management, and healthcare.",
    badge: "💼 Business",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    accent: "from-emerald-700 to-emerald-500",
    tags: ["Management", "Healthcare", "Operations"],
  },
  {
    id: "executive",
    label: "Executive",
    description: "Dark navy with gold accents and a two-column layout. Commanding presence for senior leadership.",
    badge: "✨ Premium",
    badgeColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    accent: "from-yellow-700 to-yellow-500",
    tags: ["C-Suite", "VP", "Director"],
  },
  {
    id: "creative",
    label: "Creative",
    description: "Purple-to-pink gradient with an avatar circle. Stand out in design, media, and startups.",
    badge: "🎨 Bold & Vibrant",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    accent: "from-purple-600 to-pink-500",
    tags: ["Design", "Media", "Startups"],
  },
  {
    id: "tech",
    label: "Tech / Dark",
    description: "Dark theme with monospace font and code-comment style headings. For engineers who want to show personality.",
    badge: "💻 Dark Mode",
    badgeColor: "bg-slate-800 text-slate-200",
    accent: "from-slate-900 to-slate-700",
    tags: ["Engineering", "DevOps", "Data Science"],
  },
  {
    id: "corporate",
    label: "Corporate",
    description: "Royal blue with subtle top & bottom stripe accents and a clean sidebar. Ideal for enterprise roles.",
    badge: "🏢 Enterprise",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    accent: "from-blue-900 to-blue-600",
    tags: ["Enterprise", "Banking", "Consulting"],
  },
];

// Demo resume data used in previews
const DEMO_DATA = {
  personalInfo: {
    fullName: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 012-3456",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    website: "alexjohnson.dev",
    summary:
      "Results-driven software engineer with 6+ years building scalable full-stack applications. Passionate about clean code, developer experience, and mentoring teams.",
  },
  experience: [
    {
      id: "1",
      company: "Acme Corp",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "",
      current: true,
      description:
        "• Led a team of 5 engineers to deliver a real-time analytics dashboard used by 500K users\n• Reduced API latency by 40% through query optimization and caching strategies\n• Championed TypeScript migration across the entire frontend codebase",
    },
    {
      id: "2",
      company: "Beta Technologies",
      position: "Software Engineer",
      location: "Remote",
      startDate: "2020-06",
      endDate: "2022-02",
      current: false,
      description:
        "• Built and maintained 15+ RESTful APIs serving 2M daily requests\n• Implemented CI/CD pipelines reducing deployment time by 60%",
    },
  ],
  education: [
    {
      id: "1",
      institution: "Stanford University",
      degree: "B.S.",
      field: "Computer Science",
      location: "Stanford, CA",
      startDate: "2016-09",
      endDate: "2020-05",
      current: false,
      gpa: "3.8",
    },
  ],
  skills: "React, TypeScript, Node.js, Python, PostgreSQL, AWS, Docker, Kubernetes",
  projects: [
    {
      id: "1",
      name: "OpenMetrics",
      description: "Open-source observability platform with 2K GitHub stars. Built with Rust and React.",
      technologies: "Rust, React, PostgreSQL, Prometheus",
      link: "github.com/alex/openmetrics",
    },
  ],
};

export default function TemplatesPage() {
  const [activePreview, setActivePreview] = useState<string | null>(null);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Templates</h1>
        <p className="text-muted-foreground mt-2">
          Choose from {TEMPLATES.length} professionally designed templates — click any card to preview it full-size.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
        {TEMPLATES.map((tmpl, i) => (
          <motion.div
            key={tmpl.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group rounded-2xl border bg-card shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            {/* Thumbnail preview */}
            <div
              className="relative overflow-hidden bg-white cursor-pointer"
              style={{ height: "280px" }}
              onClick={() => setActivePreview(activePreview === tmpl.id ? null : tmpl.id)}
            >
              {/* Gradient accent strip aligned to template */}
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tmpl.accent}`} />

              {/* Scaled-down live preview */}
              <div
                className="absolute inset-0 origin-top-left overflow-hidden pointer-events-none"
                style={{ transform: "scale(0.42)", width: "238%", height: "238%" }}
              >
                <ResumePreview data={DEMO_DATA} template={tmpl.id} />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                  {activePreview === tmpl.id ? "Close preview ↑" : "Full preview ↓"}
                </span>
              </div>
            </div>

            {/* Expanded live preview */}
            {activePreview === tmpl.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t overflow-hidden bg-gray-50 dark:bg-gray-900"
              >
                <div className="overflow-y-auto max-h-[600px] p-3">
                  <div
                    className="origin-top-left"
                    style={{ transform: "scale(0.65)", width: "154%", marginBottom: "-35%" }}
                  >
                    <ResumePreview data={DEMO_DATA} template={tmpl.id} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Card info */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-semibold text-base">{tmpl.label}</h2>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tmpl.badgeColor}`}>
                      {tmpl.badge}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tmpl.description}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tmpl.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex gap-2 mt-4">
                <Link href={`/builder?template=${tmpl.id}`} className="flex-1">
                  <Button className="w-full" size="sm">
                    <PenTool className="h-3.5 w-3.5 mr-1.5" />
                    Use This Template
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActivePreview(activePreview === tmpl.id ? null : tmpl.id)}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="rounded-2xl border bg-primary/5 border-primary/20 p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">All templates are ATS-friendly</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Every template is designed to pass ATS scanners while looking stunning to human recruiters.
          </p>
        </div>
        <Link href="/builder">
          <Button size="lg">
            <PenTool className="h-4 w-4 mr-2" />
            Start Building Your Resume
          </Button>
        </Link>
      </div>
    </div>
  );
}
