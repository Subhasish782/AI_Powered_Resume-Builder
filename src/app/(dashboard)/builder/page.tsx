"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumePreview } from "@/components/resume/resume-preview";
import {
  Plus, Trash2, Loader2, Save, ChevronRight, ChevronLeft,
  User, Briefcase, GraduationCap, Wrench, FolderGit2, Eye,
  CheckCircle2, X
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Experience {
  id: string; company: string; position: string; location: string;
  startDate: string; endDate: string; current: boolean; description: string;
}
interface Education {
  id: string; institution: string; degree: string; field: string;
  location: string; startDate: string; endDate: string; current: boolean; gpa: string;
}
interface Project {
  id: string; name: string; description: string; technologies: string; link: string;
}
interface ResumeData {
  personalInfo: { fullName: string; email: string; phone: string; location: string; linkedin: string; website: string; summary: string; };
  experience: Experience[];
  education: Education[];
  skills: string;
  projects: Project[];
}

const STEPS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderGit2 },
];

const TEMPLATES = [
  { id: "modern",       label: "Modern",       accent: "bg-blue-600",    badge: "⭐ Popular" },
  { id: "classic",      label: "Classic",       accent: "bg-gray-800",    badge: "" },
  { id: "minimal",      label: "Minimal",       accent: "bg-slate-300",   badge: "" },
  { id: "professional", label: "Pro",           accent: "bg-emerald-600", badge: "" },
  { id: "executive",    label: "Executive",     accent: "bg-yellow-600",  badge: "✨ Premium" },
  { id: "creative",     label: "Creative",      accent: "bg-purple-600",  badge: "🎨 Bold" },
  { id: "tech",         label: "Tech",          accent: "bg-slate-900",   badge: "💻 Dark" },
  { id: "corporate",    label: "Corporate",     accent: "bg-blue-800",    badge: "" },
];

const initialData: ResumeData = {
  personalInfo: { fullName: "", email: "", phone: "", location: "", linkedin: "", website: "", summary: "" },
  experience: [], education: [], skills: "", projects: [],
};

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resume");
  const templateParam = searchParams.get("template");

  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [activeTemplate, setActiveTemplate] = useState(
    TEMPLATES.find(t => t.id === templateParam) ? templateParam! : "modern"
  );
  const [activeStep, setActiveStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!resumeId);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [showPreview, setShowPreview] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (resumeId) fetchResume();
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      const res = await fetch(`/api/resumes/${resumeId}`);
      const data = await res.json();
      if (data.resume?.content) {
        const c = data.resume.content;
        setResumeData({
          personalInfo: c.personalInfo || initialData.personalInfo,
          experience: c.experience || [],
          education: c.education || [],
          skills: (c.skills || []).join(", "),
          projects: (c.projects || []).map((p: any) => ({
            ...p, technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies || ""
          })),
        });
      }
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const setPersonal = (field: string, value: string) =>
    setResumeData(p => ({ ...p, personalInfo: { ...p.personalInfo, [field]: value } }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    const existing = resumeData.skills ? resumeData.skills.split(",").map(x => x.trim()) : [];
    if (!existing.includes(s)) {
      setResumeData(p => ({ ...p, skills: [...existing, s].join(", ") }));
    }
    setSkillInput("");
  };
  const removeSkill = (skill: string) => {
    const updated = resumeData.skills.split(",").map(x => x.trim()).filter(x => x !== skill);
    setResumeData(p => ({ ...p, skills: updated.join(", ") }));
  };
  const skillTags = resumeData.skills ? resumeData.skills.split(",").map(x => x.trim()).filter(Boolean) : [];

  // Experience
  const addExp = () => setResumeData(p => ({
    ...p, experience: [...p.experience, { id: Date.now().toString(), company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" }]
  }));
  const updateExp = (id: string, field: string, value: any) =>
    setResumeData(p => ({ ...p, experience: p.experience.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  const removeExp = (id: string) =>
    setResumeData(p => ({ ...p, experience: p.experience.filter(e => e.id !== id) }));

  // Education
  const addEdu = () => setResumeData(p => ({
    ...p, education: [...p.education, { id: Date.now().toString(), institution: "", degree: "", field: "", location: "", startDate: "", endDate: "", current: false, gpa: "" }]
  }));
  const updateEdu = (id: string, field: string, value: any) =>
    setResumeData(p => ({ ...p, education: p.education.map(e => e.id === id ? { ...e, [field]: value } : e) }));
  const removeEdu = (id: string) =>
    setResumeData(p => ({ ...p, education: p.education.filter(e => e.id !== id) }));

  // Projects
  const addProj = () => setResumeData(p => ({
    ...p, projects: [...p.projects, { id: Date.now().toString(), name: "", description: "", technologies: "", link: "" }]
  }));
  const updateProj = (id: string, field: string, value: string) =>
    setResumeData(p => ({ ...p, projects: p.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj) }));
  const removeProj = (id: string) =>
    setResumeData(p => ({ ...p, projects: p.projects.filter(proj => proj.id !== id) }));

  const handleSave = async () => {
    setIsSaving(true); setSaveStatus("idle");
    try {
      const payload = {
        title: resumeData.personalInfo.fullName || "Untitled Resume",
        content: { ...resumeData, skills: skillTags },
        template: activeTemplate,
      };
      const url = resumeId ? `/api/resumes/${resumeId}` : "/api/resumes/create";
      const method = resumeId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setSaveStatus(res.ok ? "success" : "error");
      if (res.ok) setTimeout(() => setSaveStatus("idle"), 3000);
    } catch { setSaveStatus("error"); } finally { setIsSaving(false); }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading your resume...</p>
    </div>
  );

  const StepIcon = STEPS[activeStep].icon;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Builder</h1>
          <p className="text-muted-foreground mt-1">Build your professional resume step by step</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className="lg:hidden">
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Edit" : "Preview"}
          </Button>
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            size="sm"
            className={saveStatus === "success" ? "bg-green-600 hover:bg-green-700 text-white" : ""}
          >
            {saveStatus === "success" ? (
              <><CheckCircle2 className="h-4 w-4 mr-2" />Saved!</>
            ) : (
              <><Save className="h-4 w-4 mr-2" />Save Resume</>
            )}
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === activeStep;
          const isDone = i < activeStep;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                ${isActive ? "bg-primary text-primary-foreground shadow-sm" :
                  isDone ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{step.label}</span>
              {i < STEPS.length - 1 && (
                <ChevronRight className={`h-3 w-3 ml-1 ${isActive || isDone ? "text-primary/50" : "text-muted-foreground/30"}`} />
              )}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_480px]">
        {/* Form Panel */}
        <div className={showPreview ? "hidden lg:block" : "block"}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* ── Personal Info ── */}
              {activeStep === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { field: "fullName", label: "Full Name", placeholder: "Jane Doe", type: "text" },
                        { field: "email", label: "Email Address", placeholder: "jane@example.com", type: "email" },
                        { field: "phone", label: "Phone Number", placeholder: "+91 98765 43210", type: "tel" },
                        { field: "location", label: "Location", placeholder: "New Delhi, India", type: "text" },
                        { field: "linkedin", label: "LinkedIn URL", placeholder: "linkedin.com/in/janedoe", type: "text" },
                        { field: "website", label: "Portfolio / Website", placeholder: "janedoe.dev", type: "text" },
                      ].map(({ field, label, placeholder, type }) => (
                        <div key={field} className="space-y-1.5">
                          <Label>{label}</Label>
                          <Input
                            type={type}
                            value={(resumeData.personalInfo as any)[field]}
                            onChange={e => setPersonal(field, e.target.value)}
                            placeholder={placeholder}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Professional Summary</Label>
                      <Textarea
                        value={resumeData.personalInfo.summary}
                        onChange={e => setPersonal("summary", e.target.value)}
                        placeholder="Results-driven software engineer with 5+ years building scalable web applications..."
                        className="min-h-[120px] resize-none"
                      />
                      <p className="text-xs text-muted-foreground">{resumeData.personalInfo.summary.length} characters — aim for 2–4 strong sentences</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ── Experience ── */}
              {activeStep === 1 && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Work Experience
                    </CardTitle>
                    <Button onClick={addExp} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resumeData.experience.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed rounded-xl">
                        <Briefcase className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground text-sm">No experience added yet</p>
                        <Button onClick={addExp} size="sm" className="mt-3"><Plus className="h-4 w-4 mr-1" />Add Experience</Button>
                      </div>
                    )}
                    {resumeData.experience.map((exp, idx) => (
                      <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="border rounded-xl p-4 space-y-3 bg-muted/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Experience #{idx + 1}</span>
                          <Button variant="ghost" size="icon" onClick={() => removeExp(exp.id)} className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1"><Label className="text-xs">Company</Label>
                            <Input placeholder="Google" value={exp.company} onChange={e => updateExp(exp.id, "company", e.target.value)} /></div>
                          <div className="space-y-1"><Label className="text-xs">Job Title</Label>
                            <Input placeholder="Senior Engineer" value={exp.position} onChange={e => updateExp(exp.id, "position", e.target.value)} /></div>
                          <div className="space-y-1"><Label className="text-xs">Location</Label>
                            <Input placeholder="Bangalore, India" value={exp.location} onChange={e => updateExp(exp.id, "location", e.target.value)} /></div>
                          <div className="space-y-1"><Label className="text-xs">Start Date</Label>
                            <Input type="month" value={exp.startDate} onChange={e => updateExp(exp.id, "startDate", e.target.value)} /></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                            <input type="checkbox" checked={exp.current} onChange={e => updateExp(exp.id, "current", e.target.checked)} className="rounded" />
                            Currently working here
                          </label>
                          {!exp.current && (
                            <div className="flex-1 space-y-1">
                              <Input type="month" placeholder="End Date" value={exp.endDate} onChange={e => updateExp(exp.id, "endDate", e.target.value)} />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1"><Label className="text-xs">Description & Achievements</Label>
                          <Textarea placeholder="• Led a team of 5 engineers to deliver..."
                            value={exp.description} onChange={e => updateExp(exp.id, "description", e.target.value)}
                            className="min-h-[100px] resize-none text-sm" /></div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* ── Education ── */}
              {activeStep === 2 && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Education
                    </CardTitle>
                    <Button onClick={addEdu} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resumeData.education.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed rounded-xl">
                        <GraduationCap className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground text-sm">No education added yet</p>
                        <Button onClick={addEdu} size="sm" className="mt-3"><Plus className="h-4 w-4 mr-1" />Add Education</Button>
                      </div>
                    )}
                    {resumeData.education.map((edu, idx) => (
                      <motion.div key={edu.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="border rounded-xl p-4 space-y-3 bg-muted/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Education #{idx + 1}</span>
                          <Button variant="ghost" size="icon" onClick={() => removeEdu(edu.id)} className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1 col-span-2"><Label className="text-xs">Institution</Label>
                            <Input placeholder="IIT Delhi" value={edu.institution} onChange={e => updateEdu(edu.id, "institution", e.target.value)} /></div>
                          <div className="space-y-1"><Label className="text-xs">Degree</Label>
                            <Input placeholder="B.Tech" value={edu.degree} onChange={e => updateEdu(edu.id, "degree", e.target.value)} /></div>
                          <div className="space-y-1"><Label className="text-xs">Field of Study</Label>
                            <Input placeholder="Computer Science" value={edu.field} onChange={e => updateEdu(edu.id, "field", e.target.value)} /></div>
                          <div className="space-y-1"><Label className="text-xs">Start Date</Label>
                            <Input type="month" value={edu.startDate} onChange={e => updateEdu(edu.id, "startDate", e.target.value)} /></div>
                          <div className="space-y-1"><Label className="text-xs">GPA / Score</Label>
                            <Input placeholder="8.5 / 10" value={edu.gpa} onChange={e => updateEdu(edu.id, "gpa", e.target.value)} /></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                            <input type="checkbox" checked={edu.current} onChange={e => updateEdu(edu.id, "current", e.target.checked)} className="rounded" />
                            Currently studying here
                          </label>
                          {!edu.current && (
                            <div className="flex-1 space-y-1">
                              <Input type="month" placeholder="End Date" value={edu.endDate} onChange={e => updateEdu(edu.id, "endDate", e.target.value)} />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* ── Skills ── */}
              {activeStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-primary" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a skill and press Enter or Add..."
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                      />
                      <Button onClick={addSkill} variant="outline" size="sm" className="shrink-0">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                    {skillTags.length > 0 ? (
                      <div className="flex flex-wrap gap-2 p-3 border rounded-xl min-h-[80px] bg-muted/20">
                        {skillTags.map(skill => (
                          <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full font-medium">
                            {skill}
                            <button onClick={() => removeSkill(skill)} className="hover:text-primary/60 transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-xl text-muted-foreground text-sm">
                        Start typing skills above — e.g. React, Python, Figma
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">{skillTags.length} skill{skillTags.length !== 1 ? "s" : ""} added</p>
                  </CardContent>
                </Card>
              )}

              {/* ── Projects ── */}
              {activeStep === 4 && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FolderGit2 className="h-5 w-5 text-primary" />
                      Projects
                    </CardTitle>
                    <Button onClick={addProj} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resumeData.projects.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed rounded-xl">
                        <FolderGit2 className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground text-sm">No projects added yet</p>
                        <Button onClick={addProj} size="sm" className="mt-3"><Plus className="h-4 w-4 mr-1" />Add Project</Button>
                      </div>
                    )}
                    {resumeData.projects.map((proj, idx) => (
                      <motion.div key={proj.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="border rounded-xl p-4 space-y-3 bg-muted/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Project #{idx + 1}</span>
                          <Button variant="ghost" size="icon" onClick={() => removeProj(proj.id)} className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1"><Label className="text-xs">Project Name</Label>
                            <Input placeholder="Portfolio Website" value={proj.name} onChange={e => updateProj(proj.id, "name", e.target.value)} /></div>
                          <div className="space-y-1"><Label className="text-xs">Live / GitHub Link</Label>
                            <Input placeholder="github.com/user/project" value={proj.link} onChange={e => updateProj(proj.id, "link", e.target.value)} /></div>
                          <div className="space-y-1 col-span-2"><Label className="text-xs">Technologies Used</Label>
                            <Input placeholder="React, TypeScript, Tailwind CSS" value={proj.technologies} onChange={e => updateProj(proj.id, "technologies", e.target.value)} /></div>
                        </div>
                        <div className="space-y-1"><Label className="text-xs">Description</Label>
                          <Textarea placeholder="Describe what you built, your role, and the impact..."
                            value={proj.description} onChange={e => updateProj(proj.id, "description", e.target.value)}
                            className="min-h-[90px] resize-none text-sm" /></div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setActiveStep(s => Math.max(0, s - 1))} disabled={activeStep === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button onClick={() => setActiveStep(s => Math.min(STEPS.length - 1, s + 1))} disabled={activeStep === STEPS.length - 1}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`space-y-4 ${showPreview ? "block" : "hidden lg:block"}`}>
          <div className="lg:sticky lg:top-6 space-y-4">
            {/* Template Picker */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Template — {TEMPLATES.find(t => t.id === activeTemplate)?.label}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-4 gap-2 pt-0">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate(t.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all relative
                      ${activeTemplate === t.id ? "border-primary bg-primary/5" : "border-transparent hover:border-muted-foreground/30"}`}
                  >
                    {t.badge && (
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[8px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full whitespace-nowrap font-medium z-10">
                        {t.badge}
                      </span>
                    )}
                    <div className="w-full h-12 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden relative mt-1">
                      <div className={`h-2 w-full ${t.accent}`} />
                      <div className="p-1 space-y-0.5">
                        <div className="h-1 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium ${activeTemplate === t.id ? "text-primary" : "text-muted-foreground"}`}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Resume Preview */}
            <div className="border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">Live Preview</span>
              </div>
              <div className="overflow-y-auto max-h-[700px] p-2 bg-gray-100 dark:bg-gray-900">
                <div className="transform scale-[0.65] origin-top-left" style={{ width: "154%", marginBottom: "-35%" }}>
                  <ResumePreview data={resumeData} template={activeTemplate} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
