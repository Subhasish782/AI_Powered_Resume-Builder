"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Briefcase, CheckCircle, XCircle, Target, AlertCircle,
  Lightbulb, ArrowUpRight, FileText,
} from "lucide-react";

interface Resume {
  _id: string;
  title: string;
  extractedText?: string;
}

interface MatchResult {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export default function MatchPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const res = await fetch("/api/resumes");
      const data = await res.json();
      const list: Resume[] = data.resumes || [];
      setResumes(list);
      if (list.length > 0) {
        setSelectedResumeId(list[0]._id);
        setResumeText(list[0].extractedText || "");
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeSelect = (id: string) => {
    setSelectedResumeId(id);
    const resume = resumes.find(r => r._id === id);
    setResumeText(resume?.extractedText || "");
    setError("");
  };

  const selectedResume = resumes.find(r => r._id === selectedResumeId);
  const hasExtractedText = !!selectedResume?.extractedText?.trim();
  const canMatch = jobDescription.trim().length > 0 && resumeText.trim().length > 0;

  const handleMatch = async () => {
    if (!canMatch) return;
    setIsMatching(true);
    setError("");

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: selectedResumeId || undefined,
          resumeText,
          jobDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze job match");
      setMatchResult(data.match);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsMatching(false);
    }
  };

  const scoreColor = (s: number) =>
    s >= 80 ? "text-green-500" : s >= 60 ? "text-yellow-500" : s >= 40 ? "text-orange-500" : "text-red-500";
  const scoreRingColor = (s: number) =>
    s >= 80 ? "#22c55e" : s >= 60 ? "#eab308" : s >= 40 ? "#f97316" : "#ef4444";
  const scoreLabel = (s: number) =>
    s >= 80 ? "Excellent match! You're a strong candidate." :
    s >= 60 ? "Good match with a few areas to improve." :
    s >= 40 ? "Fair match — consider updating your resume." :
    "Low match. Significant improvements needed.";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-9 w-48 bg-muted animate-pulse rounded-md" />
          <div className="h-5 w-72 bg-muted animate-pulse rounded-md mt-2" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map(i => (
            <div key={i} className="rounded-2xl border bg-card p-6 space-y-4">
              <div className="h-6 w-36 bg-muted animate-pulse rounded-md" />
              <div className="h-32 w-full bg-muted animate-pulse rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Match</h1>
        <p className="text-muted-foreground mt-2">
          Compare your resume against any job description to see your match score
        </p>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
          >
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-sm text-destructive">Match Failed</p>
              <p className="text-sm text-muted-foreground mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError("")} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {!matchResult ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Resume */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Your Resume
              </CardTitle>
              <CardDescription>
                Select an uploaded resume or paste your resume text
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumes.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Select resume</label>
                  <Select
                    value={selectedResumeId}
                    onChange={e => handleResumeSelect(e.target.value)}
                  >
                    <option value="">Choose a resume...</option>
                    {resumes.map(r => (
                      <option key={r._id} value={r._id}>{r.title}</option>
                    ))}
                  </Select>
                </div>
              )}

              {/* Warn if no extracted text */}
              {selectedResumeId && !hasExtractedText && (
                <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2 text-xs">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-amber-700 dark:text-amber-300">
                    Text extraction wasn&apos;t available for this resume. Please paste your resume text below.
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  {hasExtractedText ? "Resume text (auto-filled)" : "Paste your resume text"}
                </label>
                <Textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here — name, experience, skills, education..."
                  className="min-h-[220px] text-xs"
                />
                {resumeText.trim() && (
                  <p className="text-xs text-muted-foreground">
                    {resumeText.trim().split(/\s+/).length} words ready for matching
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right: Job Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Job Description
              </CardTitle>
              <CardDescription>
                Paste the full job posting you want to match against
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder={"We are looking for a Senior Software Engineer...\n\nRequirements:\n• 5+ years of experience\n• React and TypeScript\n• Strong problem-solving skills"}
                className="min-h-[220px] text-xs"
              />
              {jobDescription.trim() && (
                <p className="text-xs text-muted-foreground">
                  {jobDescription.trim().split(/\s+/).length} words
                </p>
              )}

              <Button
                onClick={handleMatch}
                disabled={!canMatch || isMatching}
                className="w-full"
                size="lg"
                isLoading={isMatching}
              >
                {isMatching ? "Analyzing match..." : "Analyze Job Match"}
              </Button>

              {!resumeText.trim() && (
                <p className="text-xs text-center text-muted-foreground">
                  ← Add your resume text on the left to enable matching
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Match Results</h2>
            <Button variant="outline" onClick={() => { setMatchResult(null); setError(""); }}>
              Try Another Job
            </Button>
          </div>

          {/* Score card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* Circular progress */}
                <div className="relative w-44 h-44 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke={scoreRingColor(matchResult.matchPercentage)}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${matchResult.matchPercentage * 2.638} 264`}
                      style={{ transition: "stroke-dasharray 1s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${scoreColor(matchResult.matchPercentage)}`}>
                      {matchResult.matchPercentage}%
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">Match Score</span>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="flex-1 space-y-3 w-full">
                  <p className={`text-lg font-semibold ${scoreColor(matchResult.matchPercentage)}`}>
                    {scoreLabel(matchResult.matchPercentage)}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">{matchResult.matchingSkills.length}</p>
                      <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">Matching skills</p>
                    </div>
                    <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 text-center">
                      <p className="text-2xl font-bold text-red-600">{matchResult.missingSkills.length}</p>
                      <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">Missing skills</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Match strength</span>
                      <span>{matchResult.matchPercentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${matchResult.matchPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: scoreRingColor(matchResult.matchPercentage) }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-green-200 dark:border-green-900">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-600 text-base">
                  <CheckCircle className="h-4 w-4" /> Matching Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                {matchResult.matchingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matchingSkills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                        <CheckCircle className="h-3 w-3" /> {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No strong skill matches found.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-900">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-600 text-base">
                  <XCircle className="h-4 w-4" /> Missing Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                {matchResult.missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {matchResult.missingSkills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium">
                        <ArrowUpRight className="h-3 w-3" /> {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-green-600 font-medium">🎉 No major skill gaps found!</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          {matchResult.recommendations.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightbulb className="h-4 w-4 text-yellow-500" /> Recommendations
                </CardTitle>
                <CardDescription>Actionable steps to improve your match score</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {matchResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
