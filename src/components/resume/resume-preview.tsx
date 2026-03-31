"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ResumeData {
  personalInfo: {
    fullName: string; email: string; phone: string; location: string;
    linkedin: string; website: string; summary: string;
  };
  experience: Array<{ id: string; company: string; position: string; location: string; startDate: string; endDate: string; current: boolean; description: string; }>;
  education: Array<{ id: string; institution: string; degree: string; field: string; startDate: string; endDate: string; current: boolean; gpa: string; }>;
  skills: string;
  projects: Array<{ id: string; name: string; description: string; technologies: string; link: string; }>;
}

interface ResumePreviewProps { data: ResumeData; template: string; }

const formatDate = (d: string) => {
  if (!d) return "";
  const [y, m] = d.split("-");
  if (!m) return d;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m) - 1]} ${y}`;
};

export function ResumePreview({ data, template }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!resumeRef.current) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <title>Resume - ${data.personalInfo.fullName || "Resume"}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, Arial, sans-serif; line-height: 1.5; color: #111; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
    </head><body>${resumeRef.current.innerHTML}</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  const name = data.personalInfo.fullName || "Your Name";
  const skillTags = data.skills ? data.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
  const contactItems = [
    data.personalInfo.email, data.personalInfo.phone,
    data.personalInfo.location, data.personalInfo.linkedin,
    data.personalInfo.website,
  ].filter(Boolean);

  const templateProps = { data, name, contactItems, skillTags };

  return (
    <div className="space-y-3">
      <div ref={resumeRef} className="bg-white text-black" style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>
        {template === "modern"       && <ModernTemplate       {...templateProps} />}
        {template === "classic"      && <ClassicTemplate      {...templateProps} />}
        {template === "minimal"      && <MinimalTemplate      {...templateProps} />}
        {template === "professional" && <ProfessionalTemplate {...templateProps} />}
        {template === "executive"    && <ExecutiveTemplate    {...templateProps} />}
        {template === "creative"     && <CreativeTemplate     {...templateProps} />}
        {template === "tech"         && <TechTemplate         {...templateProps} />}
        {template === "corporate"    && <CorporateTemplate    {...templateProps} />}
      </div>
      <Button onClick={handlePrint} className="w-full" variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Download / Print as PDF
      </Button>
    </div>
  );
}

const SectionBlock = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: "16px" }}>{children}</div>
);

// ─── MODERN ─────────────────────────────────────────────────────
function ModernTemplate({ data, name, contactItems, skillTags }: any) {
  return (
    <div style={{ minHeight: "1000px" }}>
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", color: "#fff", padding: "32px 40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "4px" }}>{name}</h1>
        {data.personalInfo.summary && (
          <p style={{ fontSize: "13px", opacity: 0.85, marginBottom: "12px", maxWidth: "520px", lineHeight: 1.6 }}>
            {data.personalInfo.summary}
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "12px", opacity: 0.9 }}>
          {contactItems.map((c: string, i: number) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {i > 0 && <span style={{ opacity: 0.5 }}>•</span>} {c}
            </span>
          ))}
        </div>
      </div>
      <div style={{ padding: "28px 40px" }}>
        {data.experience.length > 0 && (
          <SectionBlock>
            <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#2563eb", letterSpacing: "1.5px", textTransform: "uppercase", borderBottom: "2px solid #2563eb", paddingBottom: "4px", marginBottom: "14px" }}>Work Experience</h2>
            {data.experience.map((exp: any) => (
              <div key={exp.id} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px" }}>{exp.position || "Position"}</div>
                    <div style={{ fontSize: "13px", color: "#2563eb", fontWeight: 500 }}>{exp.company || "Company"}{exp.location ? ` · ${exp.location}` : ""}</div>
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap" }}>
                    {formatDate(exp.startDate)} {exp.startDate ? "–" : ""} {exp.current ? "Present" : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && <p style={{ fontSize: "12.5px", color: "#374151", marginTop: "5px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{exp.description}</p>}
              </div>
            ))}
          </SectionBlock>
        )}
        {data.education.length > 0 && (
          <SectionBlock>
            <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#2563eb", letterSpacing: "1.5px", textTransform: "uppercase", borderBottom: "2px solid #2563eb", paddingBottom: "4px", marginBottom: "14px" }}>Education</h2>
            {data.education.map((edu: any) => (
              <div key={edu.id} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>{edu.institution || "Institution"}</div>
                  <div style={{ fontSize: "13px", color: "#4b5563" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</div>
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>{formatDate(edu.startDate)} {edu.startDate ? "–" : ""} {edu.current ? "Present" : formatDate(edu.endDate)}</div>
              </div>
            ))}
          </SectionBlock>
        )}
        {data.projects.length > 0 && (
          <SectionBlock>
            <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#2563eb", letterSpacing: "1.5px", textTransform: "uppercase", borderBottom: "2px solid #2563eb", paddingBottom: "4px", marginBottom: "14px" }}>Projects</h2>
            {data.projects.map((p: any) => (
              <div key={p.id} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>{p.name || "Project"}</div>
                  {p.link && <a href={p.link} style={{ fontSize: "11px", color: "#2563eb" }}>{p.link}</a>}
                </div>
                {p.technologies && <div style={{ fontSize: "12px", color: "#2563eb", marginTop: "2px" }}>{p.technologies}</div>}
                {p.description && <p style={{ fontSize: "12.5px", color: "#374151", marginTop: "4px", lineHeight: 1.6 }}>{p.description}</p>}
              </div>
            ))}
          </SectionBlock>
        )}
        {skillTags.length > 0 && (
          <SectionBlock>
            <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#2563eb", letterSpacing: "1.5px", textTransform: "uppercase", borderBottom: "2px solid #2563eb", paddingBottom: "4px", marginBottom: "12px" }}>Skills</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skillTags.map((s: string, i: number) => (
                <span key={i} style={{ fontSize: "12px", padding: "3px 10px", background: "#eff6ff", color: "#1d4ed8", borderRadius: "999px", border: "1px solid #bfdbfe" }}>{s}</span>
              ))}
            </div>
          </SectionBlock>
        )}
      </div>
    </div>
  );
}

// ─── CLASSIC ────────────────────────────────────────────────────
function ClassicTemplate({ data, name, contactItems, skillTags }: any) {
  return (
    <div style={{ padding: "40px", minHeight: "1000px" }}>
      <div style={{ textAlign: "center", borderBottom: "3px double #111", paddingBottom: "16px", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, fontFamily: "Georgia, serif", letterSpacing: "2px", textTransform: "uppercase" }}>{name}</h1>
        <div style={{ fontSize: "12px", color: "#444", marginTop: "8px", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px" }}>
          {contactItems.map((c: string, i: number) => (
            <span key={i}>{i > 0 && <span style={{ margin: "0 4px", opacity: 0.4 }}>|</span>}{c}</span>
          ))}
        </div>
      </div>
      {data.personalInfo.summary && (
        <SectionBlock>
          <h2 style={{ fontSize: "13px", fontWeight: 700, fontFamily: "Georgia, serif", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Objective</h2>
          <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#333" }}>{data.personalInfo.summary}</p>
        </SectionBlock>
      )}
      {data.experience.length > 0 && (
        <SectionBlock>
          <h2 style={{ fontSize: "13px", fontWeight: 700, fontFamily: "Georgia, serif", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #999", paddingBottom: "4px", marginBottom: "12px" }}>Professional Experience</h2>
          {data.experience.map((exp: any) => (
            <div key={exp.id} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><span style={{ fontWeight: 700, fontSize: "13.5px" }}>{exp.position || "Position"}</span>, <span style={{ fontStyle: "italic", fontSize: "13px" }}>{exp.company || "Company"}</span></div>
                <span style={{ fontSize: "12px", color: "#555" }}>{formatDate(exp.startDate)}{exp.startDate ? " – " : ""}{exp.current ? "Present" : formatDate(exp.endDate)}</span>
              </div>
              {exp.location && <div style={{ fontSize: "12px", color: "#666", marginTop: "1px" }}>{exp.location}</div>}
              {exp.description && <p style={{ fontSize: "12.5px", color: "#333", marginTop: "5px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{exp.description}</p>}
            </div>
          ))}
        </SectionBlock>
      )}
      {data.education.length > 0 && (
        <SectionBlock>
          <h2 style={{ fontSize: "13px", fontWeight: 700, fontFamily: "Georgia, serif", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #999", paddingBottom: "4px", marginBottom: "12px" }}>Education</h2>
          {data.education.map((edu: any) => (
            <div key={edu.id} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "13.5px" }}>{edu.institution || "Institution"}</div>
                <div style={{ fontSize: "13px", fontStyle: "italic", color: "#444" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</div>
                {edu.gpa && <div style={{ fontSize: "12px", color: "#555" }}>GPA: {edu.gpa}</div>}
              </div>
              <span style={{ fontSize: "12px", color: "#555" }}>{formatDate(edu.startDate)}{edu.startDate ? " – " : ""}{edu.current ? "Present" : formatDate(edu.endDate)}</span>
            </div>
          ))}
        </SectionBlock>
      )}
      {data.projects.length > 0 && (
        <SectionBlock>
          <h2 style={{ fontSize: "13px", fontWeight: 700, fontFamily: "Georgia, serif", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #999", paddingBottom: "4px", marginBottom: "12px" }}>Projects</h2>
          {data.projects.map((p: any) => (
            <div key={p.id} style={{ marginBottom: "10px" }}>
              <div style={{ fontWeight: 700, fontSize: "13.5px" }}>{p.name || "Project"}{p.link ? <a href={p.link} style={{ fontWeight: 400, fontSize: "12px", color: "#444", marginLeft: "8px" }}>{p.link}</a> : ""}</div>
              {p.technologies && <div style={{ fontSize: "12px", fontStyle: "italic", color: "#555" }}>{p.technologies}</div>}
              {p.description && <p style={{ fontSize: "12.5px", color: "#333", marginTop: "4px", lineHeight: 1.6 }}>{p.description}</p>}
            </div>
          ))}
        </SectionBlock>
      )}
      {skillTags.length > 0 && (
        <SectionBlock>
          <h2 style={{ fontSize: "13px", fontWeight: 700, fontFamily: "Georgia, serif", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid #999", paddingBottom: "4px", marginBottom: "8px" }}>Skills</h2>
          <p style={{ fontSize: "13px", color: "#333", lineHeight: 1.8 }}>{skillTags.join(" · ")}</p>
        </SectionBlock>
      )}
    </div>
  );
}

// ─── MINIMAL ────────────────────────────────────────────────────
function MinimalTemplate({ data, name, contactItems, skillTags }: any) {
  return (
    <div style={{ padding: "36px 44px", minHeight: "1000px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: 300, letterSpacing: "-1px", color: "#111" }}>{name}</h1>
        <div style={{ fontSize: "12px", color: "#888", marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {contactItems.map((c: string, i: number) => <span key={i}>{c}</span>)}
        </div>
        {data.personalInfo.summary && <p style={{ fontSize: "13px", color: "#555", marginTop: "10px", lineHeight: 1.7, maxWidth: "560px" }}>{data.personalInfo.summary}</p>}
      </div>
      {data.experience.length > 0 && (
        <SectionBlock>
          <h2 style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Experience</h2>
          {data.experience.map((exp: any) => (
            <div key={exp.id} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px", marginBottom: "16px" }}>
              <div style={{ fontSize: "11.5px", color: "#999", paddingTop: "2px" }}>{formatDate(exp.startDate)}<br />{exp.current ? "Present" : formatDate(exp.endDate)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>{exp.position || "Position"}</div>
                <div style={{ fontSize: "12.5px", color: "#666" }}>{exp.company || "Company"}{exp.location ? `, ${exp.location}` : ""}</div>
                {exp.description && <p style={{ fontSize: "12.5px", color: "#444", marginTop: "5px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{exp.description}</p>}
              </div>
            </div>
          ))}
        </SectionBlock>
      )}
      {data.education.length > 0 && (
        <SectionBlock>
          <h2 style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Education</h2>
          {data.education.map((edu: any) => (
            <div key={edu.id} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "12px", marginBottom: "12px" }}>
              <div style={{ fontSize: "11.5px", color: "#999" }}>{formatDate(edu.startDate)}<br />{edu.current ? "Present" : formatDate(edu.endDate)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>{edu.institution || "Institution"}</div>
                <div style={{ fontSize: "12.5px", color: "#666" }}>{edu.degree}{edu.field ? ` · ${edu.field}` : ""}{edu.gpa ? ` · ${edu.gpa}` : ""}</div>
              </div>
            </div>
          ))}
        </SectionBlock>
      )}
      {data.projects.length > 0 && (
        <SectionBlock>
          <h2 style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Projects</h2>
          {data.projects.map((p: any) => (
            <div key={p.id} style={{ marginBottom: "12px" }}>
              <div style={{ fontWeight: 600, fontSize: "14px" }}>{p.name || "Project"}{p.link ? <span style={{ fontSize: "11px", color: "#888", marginLeft: "10px", fontWeight: 400 }}>{p.link}</span> : ""}</div>
              {p.technologies && <div style={{ fontSize: "12px", color: "#888" }}>{p.technologies}</div>}
              {p.description && <p style={{ fontSize: "12.5px", color: "#444", marginTop: "4px", lineHeight: 1.6 }}>{p.description}</p>}
            </div>
          ))}
        </SectionBlock>
      )}
      {skillTags.length > 0 && (
        <SectionBlock>
          <h2 style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Skills</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {skillTags.map((s: string, i: number) => (
              <span key={i} style={{ fontSize: "12px", padding: "2px 10px", border: "1px solid #ddd", borderRadius: "3px", color: "#444" }}>{s}</span>
            ))}
          </div>
        </SectionBlock>
      )}
    </div>
  );
}

// ─── PROFESSIONAL ────────────────────────────────────────────────
function ProfessionalTemplate({ data, name, contactItems, skillTags }: any) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", minHeight: "1000px" }}>
      <div style={{ background: "#064e3b", color: "#fff", padding: "32px 20px" }}>
        <div style={{ marginBottom: "28px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: 700, marginBottom: "12px" }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontSize: "11px", opacity: 0.7, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Contact</div>
          {contactItems.map((c: string, i: number) => (
            <div key={i} style={{ fontSize: "11.5px", opacity: 0.85, marginBottom: "5px", lineHeight: 1.5, wordBreak: "break-all" }}>{c}</div>
          ))}
        </div>
        {skillTags.length > 0 && (
          <div>
            <div style={{ fontSize: "11px", opacity: 0.7, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Skills</div>
            {skillTags.map((s: string, i: number) => (
              <div key={i} style={{ fontSize: "11.5px", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "4px", opacity: 0.9 }}>{s}</div>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: "32px 28px" }}>
        <div style={{ marginBottom: "24px", borderBottom: "3px solid #064e3b", paddingBottom: "16px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#064e3b", letterSpacing: "-0.5px" }}>{name}</h1>
          {data.personalInfo.summary && <p style={{ fontSize: "12.5px", color: "#555", marginTop: "8px", lineHeight: 1.7 }}>{data.personalInfo.summary}</p>}
        </div>
        {data.experience.length > 0 && (
          <SectionBlock>
            <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#064e3b", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Work Experience</h2>
            {data.experience.map((exp: any) => (
              <div key={exp.id} style={{ marginBottom: "14px", paddingLeft: "10px", borderLeft: "3px solid #10b981" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700, fontSize: "13.5px" }}>{exp.position || "Position"}</div>
                  <div style={{ fontSize: "11.5px", color: "#888" }}>{formatDate(exp.startDate)}{exp.startDate ? " – " : ""}{exp.current ? "Present" : formatDate(exp.endDate)}</div>
                </div>
                <div style={{ fontSize: "12.5px", color: "#047857", fontWeight: 600 }}>{exp.company || "Company"}{exp.location ? ` · ${exp.location}` : ""}</div>
                {exp.description && <p style={{ fontSize: "12.5px", color: "#374151", marginTop: "5px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{exp.description}</p>}
              </div>
            ))}
          </SectionBlock>
        )}
        {data.education.length > 0 && (
          <SectionBlock>
            <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#064e3b", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Education</h2>
            {data.education.map((edu: any) => (
              <div key={edu.id} style={{ marginBottom: "10px", paddingLeft: "10px", borderLeft: "3px solid #10b981" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700, fontSize: "13.5px" }}>{edu.institution || "Institution"}</div>
                  <div style={{ fontSize: "11.5px", color: "#888" }}>{formatDate(edu.startDate)}{edu.startDate ? " – " : ""}{edu.current ? "Present" : formatDate(edu.endDate)}</div>
                </div>
                <div style={{ fontSize: "12.5px", color: "#374151" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</div>
              </div>
            ))}
          </SectionBlock>
        )}
        {data.projects.length > 0 && (
          <SectionBlock>
            <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#064e3b", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Projects</h2>
            {data.projects.map((p: any) => (
              <div key={p.id} style={{ marginBottom: "10px", paddingLeft: "10px", borderLeft: "3px solid #10b981" }}>
                <div style={{ fontWeight: 700, fontSize: "13.5px" }}>{p.name || "Project"}{p.link ? <a href={p.link} style={{ fontWeight: 400, fontSize: "11.5px", color: "#047857", marginLeft: "8px" }}>{p.link}</a> : ""}</div>
                {p.technologies && <div style={{ fontSize: "12px", color: "#047857", marginTop: "2px" }}>{p.technologies}</div>}
                {p.description && <p style={{ fontSize: "12.5px", color: "#374151", marginTop: "4px", lineHeight: 1.6 }}>{p.description}</p>}
              </div>
            ))}
          </SectionBlock>
        )}
      </div>
    </div>
  );
}

// ─── EXECUTIVE ──────────────────────────────────────────────────
function ExecutiveTemplate({ data, name, contactItems, skillTags }: any) {
  return (
    <div style={{ minHeight: "1000px", fontFamily: "'Georgia', serif" }}>
      {/* Gold header bar */}
      <div style={{ background: "#1a1a2e", borderBottom: "5px solid #c9a84c", padding: "36px 44px 28px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#fff", letterSpacing: "1px", marginBottom: "4px" }}>{name}</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "12px", color: "#c9a84c", marginTop: "10px" }}>
          {contactItems.map((c: string, i: number) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {i > 0 && <span style={{ opacity: 0.4 }}>◆</span>} {c}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: "0" }}>
        {/* Main content */}
        <div style={{ padding: "28px 36px 28px 44px", borderRight: "1px solid #e5e7eb" }}>
          {data.personalInfo.summary && (
            <SectionBlock>
              <h2 style={{ fontSize: "11px", fontWeight: 700, color: "#c9a84c", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>Executive Profile</h2>
              <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.8, fontStyle: "italic", borderLeft: "3px solid #c9a84c", paddingLeft: "12px" }}>{data.personalInfo.summary}</p>
            </SectionBlock>
          )}
          {data.experience.length > 0 && (
            <SectionBlock>
              <h2 style={{ fontSize: "11px", fontWeight: 700, color: "#c9a84c", letterSpacing: "3px", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "6px", marginBottom: "14px" }}>Career History</h2>
              {data.experience.map((exp: any) => (
                <div key={exp.id} style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a2e" }}>{exp.position || "Position"}</div>
                    <div style={{ fontSize: "11.5px", color: "#9ca3af", fontStyle: "italic" }}>{formatDate(exp.startDate)}{exp.startDate ? " – " : ""}{exp.current ? "Present" : formatDate(exp.endDate)}</div>
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "5px" }}>{exp.company || "Company"}{exp.location ? ` | ${exp.location}` : ""}</div>
                  {exp.description && <p style={{ fontSize: "12.5px", color: "#374151", lineHeight: 1.7, whiteSpace: "pre-line" }}>{exp.description}</p>}
                </div>
              ))}
            </SectionBlock>
          )}
          {data.education.length > 0 && (
            <SectionBlock>
              <h2 style={{ fontSize: "11px", fontWeight: 700, color: "#c9a84c", letterSpacing: "3px", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "6px", marginBottom: "14px" }}>Education</h2>
              {data.education.map((edu: any) => (
                <div key={edu.id} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#1a1a2e" }}>{edu.institution || "Institution"}</div>
                    <div style={{ fontSize: "11.5px", color: "#9ca3af" }}>{formatDate(edu.startDate)}{edu.startDate ? " – " : ""}{edu.current ? "Present" : formatDate(edu.endDate)}</div>
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</div>
                </div>
              ))}
            </SectionBlock>
          )}
          {data.projects.length > 0 && (
            <SectionBlock>
              <h2 style={{ fontSize: "11px", fontWeight: 700, color: "#c9a84c", letterSpacing: "3px", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", paddingBottom: "6px", marginBottom: "14px" }}>Key Projects</h2>
              {data.projects.map((p: any) => (
                <div key={p.id} style={{ marginBottom: "12px" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#1a1a2e" }}>{p.name || "Project"}</div>
                  {p.technologies && <div style={{ fontSize: "12px", color: "#c9a84c" }}>{p.technologies}</div>}
                  {p.description && <p style={{ fontSize: "12.5px", color: "#374151", marginTop: "4px", lineHeight: 1.6 }}>{p.description}</p>}
                </div>
              ))}
            </SectionBlock>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ padding: "28px 20px", background: "#f9f7f0" }}>
          {skillTags.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ fontSize: "10px", fontWeight: 700, color: "#c9a84c", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Core Competencies</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {skillTags.map((s: string, i: number) => (
                  <div key={i} style={{ fontSize: "12px", color: "#374151", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#c9a84c", flexShrink: 0, display: "inline-block" }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CREATIVE ────────────────────────────────────────────────────
function CreativeTemplate({ data, name, contactItems, skillTags }: any) {
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div style={{ minHeight: "1000px" }}>
      {/* Purple gradient header */}
      <div style={{ background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)", padding: "36px 40px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: "-30px", right: "60px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <h1 style={{ fontSize: "30px", fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>{name}</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "8px", fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>
              {contactItems.map((c: string, i: number) => <span key={i}>{c}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 190px" }}>
        <div style={{ padding: "28px 32px 28px 40px" }}>
          {data.personalInfo.summary && (
            <SectionBlock>
              <div style={{ background: "linear-gradient(135deg, #f5f3ff, #fdf2f8)", borderRadius: "12px", padding: "14px 16px", marginBottom: "4px" }}>
                <p style={{ fontSize: "13px", color: "#4c1d95", lineHeight: 1.7 }}>{data.personalInfo.summary}</p>
              </div>
            </SectionBlock>
          )}
          {data.experience.length > 0 && (
            <SectionBlock>
              <h2 style={{ fontSize: "13px", fontWeight: 800, color: "#7c3aed", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "20px", height: "3px", background: "linear-gradient(90deg,#7c3aed,#db2777)", display: "inline-block", borderRadius: "2px" }} />
                Experience
              </h2>
              {data.experience.map((exp: any) => (
                <div key={exp.id} style={{ marginBottom: "16px", paddingLeft: "14px", borderLeft: "3px solid #e9d5ff" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#1f1235" }}>{exp.position || "Position"}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "12.5px", color: "#7c3aed", fontWeight: 600 }}>{exp.company || "Company"}{exp.location ? ` · ${exp.location}` : ""}</div>
                    <div style={{ fontSize: "11px", color: "#9ca3af", background: "#f5f3ff", padding: "2px 8px", borderRadius: "999px" }}>{formatDate(exp.startDate)}{exp.startDate ? "–" : ""}{exp.current ? "Now" : formatDate(exp.endDate)}</div>
                  </div>
                  {exp.description && <p style={{ fontSize: "12.5px", color: "#374151", marginTop: "5px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{exp.description}</p>}
                </div>
              ))}
            </SectionBlock>
          )}
          {data.education.length > 0 && (
            <SectionBlock>
              <h2 style={{ fontSize: "13px", fontWeight: 800, color: "#db2777", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "20px", height: "3px", background: "linear-gradient(90deg,#db2777,#7c3aed)", display: "inline-block", borderRadius: "2px" }} />
                Education
              </h2>
              {data.education.map((edu: any) => (
                <div key={edu.id} style={{ marginBottom: "12px", paddingLeft: "14px", borderLeft: "3px solid #fce7f3" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#1f1235" }}>{edu.institution || "Institution"}</div>
                  <div style={{ fontSize: "12.5px", color: "#db2777", fontWeight: 600 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</div>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>{formatDate(edu.startDate)}{edu.startDate ? " – " : ""}{edu.current ? "Present" : formatDate(edu.endDate)}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</div>
                </div>
              ))}
            </SectionBlock>
          )}
          {data.projects.length > 0 && (
            <SectionBlock>
              <h2 style={{ fontSize: "13px", fontWeight: 800, color: "#7c3aed", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "20px", height: "3px", background: "linear-gradient(90deg,#7c3aed,#db2777)", display: "inline-block", borderRadius: "2px" }} />
                Projects
              </h2>
              {data.projects.map((p: any) => (
                <div key={p.id} style={{ marginBottom: "12px", paddingLeft: "14px", borderLeft: "3px solid #e9d5ff" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#1f1235" }}>{p.name || "Project"}</div>
                  {p.technologies && <div style={{ fontSize: "12px", color: "#7c3aed" }}>{p.technologies}</div>}
                  {p.description && <p style={{ fontSize: "12.5px", color: "#374151", marginTop: "4px", lineHeight: 1.6 }}>{p.description}</p>}
                </div>
              ))}
            </SectionBlock>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ background: "#faf5ff", padding: "28px 16px", borderLeft: "1px solid #e9d5ff" }}>
          {skillTags.length > 0 && (
            <div>
              <h2 style={{ fontSize: "10px", fontWeight: 800, color: "#7c3aed", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px" }}>Skills</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {skillTags.map((s: string, i: number) => (
                  <div key={i} style={{ fontSize: "11.5px", padding: "4px 10px", background: "white", borderRadius: "6px", color: "#4c1d95", border: "1px solid #ddd6fe", fontWeight: 500 }}>{s}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TECH / DARK ─────────────────────────────────────────────────
function TechTemplate({ data, name, contactItems, skillTags }: any) {
  return (
    <div style={{ background: "#0f172a", color: "#e2e8f0", minHeight: "1000px", fontFamily: "'Courier New', monospace" }}>
      {/* Header */}
      <div style={{ padding: "32px 40px", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span style={{ color: "#38bdf8", fontSize: "14px", fontWeight: 700 }}>$&gt;</span>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.5px" }}>{name}</h1>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "10px", fontSize: "11px", color: "#64748b" }}>
          {contactItems.map((c: string, i: number) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ color: "#38bdf8" }}>//</span> {c}
            </span>
          ))}
        </div>
        {data.personalInfo.summary && (
          <p style={{ fontSize: "12.5px", color: "#94a3b8", marginTop: "12px", lineHeight: 1.7, borderLeft: "2px solid #38bdf8", paddingLeft: "12px" }}>{data.personalInfo.summary}</p>
        )}
      </div>

      <div style={{ padding: "24px 40px" }}>
        {data.experience.length > 0 && (
          <SectionBlock>
            <h2 style={{ fontSize: "11px", color: "#38bdf8", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "14px" }}>
              <span style={{ color: "#64748b" }}>// </span>EXPERIENCE
            </h2>
            {data.experience.map((exp: any) => (
              <div key={exp.id} style={{ marginBottom: "18px", paddingLeft: "16px", borderLeft: "2px solid #1e3a5f" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#f1f5f9" }}>{exp.position || "Position"}</div>
                  <div style={{ fontSize: "11px", color: "#475569", fontFamily: "system-ui" }}>{formatDate(exp.startDate)}{exp.startDate ? " → " : ""}{exp.current ? "now" : formatDate(exp.endDate)}</div>
                </div>
                <div style={{ fontSize: "12.5px", color: "#38bdf8", marginBottom: "5px" }}>{exp.company || "Company"}{exp.location ? ` @ ${exp.location}` : ""}</div>
                {exp.description && <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.8, whiteSpace: "pre-line", fontFamily: "system-ui" }}>{exp.description}</p>}
              </div>
            ))}
          </SectionBlock>
        )}
        {data.education.length > 0 && (
          <SectionBlock>
            <h2 style={{ fontSize: "11px", color: "#38bdf8", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "14px" }}>
              <span style={{ color: "#64748b" }}>// </span>EDUCATION
            </h2>
            {data.education.map((edu: any) => (
              <div key={edu.id} style={{ marginBottom: "12px", paddingLeft: "16px", borderLeft: "2px solid #1e3a5f" }}>
                <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#f1f5f9" }}>{edu.institution || "Institution"}</div>
                <div style={{ fontSize: "12.5px", color: "#38bdf8" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</div>
                <div style={{ fontSize: "11px", color: "#475569", fontFamily: "system-ui" }}>{formatDate(edu.startDate)}{edu.startDate ? " – " : ""}{edu.current ? "Present" : formatDate(edu.endDate)}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</div>
              </div>
            ))}
          </SectionBlock>
        )}
        {data.projects.length > 0 && (
          <SectionBlock>
            <h2 style={{ fontSize: "11px", color: "#38bdf8", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "14px" }}>
              <span style={{ color: "#64748b" }}>// </span>PROJECTS
            </h2>
            {data.projects.map((p: any) => (
              <div key={p.id} style={{ marginBottom: "14px", paddingLeft: "16px", borderLeft: "2px solid #1e3a5f" }}>
                <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#f1f5f9" }}>{p.name || "Project"}{p.link ? <span style={{ fontSize: "11px", color: "#38bdf8", marginLeft: "10px", fontWeight: 400 }}>→ {p.link}</span> : ""}</div>
                {p.technologies && <div style={{ fontSize: "11.5px", color: "#22d3ee", marginTop: "2px" }}>[{p.technologies}]</div>}
                {p.description && <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px", lineHeight: 1.7, fontFamily: "system-ui" }}>{p.description}</p>}
              </div>
            ))}
          </SectionBlock>
        )}
        {skillTags.length > 0 && (
          <SectionBlock>
            <h2 style={{ fontSize: "11px", color: "#38bdf8", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>
              <span style={{ color: "#64748b" }}>// </span>TECH_STACK
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skillTags.map((s: string, i: number) => (
                <span key={i} style={{ fontSize: "11.5px", padding: "3px 10px", background: "#1e293b", color: "#38bdf8", borderRadius: "4px", border: "1px solid #334155", fontFamily: "monospace" }}>"{s}"</span>
              ))}
            </div>
          </SectionBlock>
        )}
      </div>
    </div>
  );
}

// ─── CORPORATE ───────────────────────────────────────────────────
function CorporateTemplate({ data, name, contactItems, skillTags }: any) {
  return (
    <div style={{ minHeight: "1000px", fontFamily: "'Arial', sans-serif" }}>
      {/* Top stripe */}
      <div style={{ height: "6px", background: "linear-gradient(90deg, #1e40af, #0369a1, #0891b2)" }} />

      {/* Header */}
      <div style={{ padding: "28px 44px 24px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "30px", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px" }}>{name}</h1>
          {data.personalInfo.summary && <p style={{ fontSize: "12.5px", color: "#475569", marginTop: "6px", lineHeight: 1.7, maxWidth: "480px" }}>{data.personalInfo.summary}</p>}
        </div>
        <div style={{ textAlign: "right", fontSize: "11.5px", color: "#64748b", lineHeight: 1.8 }}>
          {contactItems.map((c: string, i: number) => <div key={i}>{c}</div>)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px" }}>
        {/* Main */}
        <div style={{ padding: "24px 32px 24px 44px", borderRight: "1px solid #e2e8f0" }}>
          {data.experience.length > 0 && (
            <SectionBlock>
              <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#1e40af", letterSpacing: "2px", textTransform: "uppercase", paddingBottom: "6px", borderBottom: "2px solid #bfdbfe", marginBottom: "14px" }}>Professional Experience</h2>
              {data.experience.map((exp: any) => (
                <div key={exp.id} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>{exp.position || "Position"}</div>
                      <div style={{ fontSize: "12.5px", color: "#1e40af", fontWeight: 600 }}>{exp.company || "Company"}{exp.location ? ` | ${exp.location}` : ""}</div>
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#94a3b8", textAlign: "right", minWidth: "90px" }}>
                      {formatDate(exp.startDate)}<br />{exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && <p style={{ fontSize: "12.5px", color: "#374151", marginTop: "6px", lineHeight: 1.7, whiteSpace: "pre-line" }}>{exp.description}</p>}
                </div>
              ))}
            </SectionBlock>
          )}
          {data.education.length > 0 && (
            <SectionBlock>
              <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#1e40af", letterSpacing: "2px", textTransform: "uppercase", paddingBottom: "6px", borderBottom: "2px solid #bfdbfe", marginBottom: "14px" }}>Education</h2>
              {data.education.map((edu: any) => (
                <div key={edu.id} style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#0f172a" }}>{edu.institution || "Institution"}</div>
                    <div style={{ fontSize: "12.5px", color: "#475569" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</div>
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#94a3b8", textAlign: "right" }}>{formatDate(edu.startDate)}<br />{edu.current ? "Present" : formatDate(edu.endDate)}</div>
                </div>
              ))}
            </SectionBlock>
          )}
          {data.projects.length > 0 && (
            <SectionBlock>
              <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#1e40af", letterSpacing: "2px", textTransform: "uppercase", paddingBottom: "6px", borderBottom: "2px solid #bfdbfe", marginBottom: "14px" }}>Notable Projects</h2>
              {data.projects.map((p: any) => (
                <div key={p.id} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#0f172a" }}>{p.name || "Project"}</div>
                    {p.link && <a href={p.link} style={{ fontSize: "11.5px", color: "#1e40af" }}>{p.link}</a>}
                  </div>
                  {p.technologies && <div style={{ fontSize: "12px", color: "#1e40af", marginTop: "2px" }}>{p.technologies}</div>}
                  {p.description && <p style={{ fontSize: "12.5px", color: "#374151", marginTop: "4px", lineHeight: 1.6 }}>{p.description}</p>}
                </div>
              ))}
            </SectionBlock>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ padding: "24px 20px", background: "#f8fafc" }}>
          {skillTags.length > 0 && (
            <div>
              <h2 style={{ fontSize: "10px", fontWeight: 700, color: "#1e40af", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px", paddingBottom: "4px", borderBottom: "1px solid #bfdbfe" }}>Core Skills</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {skillTags.map((s: string, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#374151", padding: "4px 0", borderBottom: "1px solid #f1f5f9" }}>
                    <span style={{ width: "6px", height: "6px", background: "#1e40af", borderRadius: "50%", flexShrink: 0, display: "inline-block" }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom stripe */}
      <div style={{ height: "4px", background: "linear-gradient(90deg, #0891b2, #0369a1, #1e40af)", marginTop: "auto" }} />
    </div>
  );
}
