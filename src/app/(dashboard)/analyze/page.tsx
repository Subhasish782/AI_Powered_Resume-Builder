"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { AnalysisResult } from "@/components/analysis/analysis-result";
import { FileSearch, Loader2, AlertCircle, XCircle } from "lucide-react";

interface Resume {
  _id: string;
  title: string;
  extractedText?: string;
}

function SkeletonLoader() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-48 bg-muted animate-pulse rounded-md" />
        <div className="h-4 w-72 bg-muted animate-pulse rounded-md mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-36 bg-muted animate-pulse rounded-md" />
          <div className="h-[300px] w-full bg-muted animate-pulse rounded-md" />
        </div>
        <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
      </CardContent>
    </Card>
  );
}

export default function AnalyzePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes");
      const data = await response.json();
      setResumes(data.resumes || []);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeSelect = (resumeId: string) => {
    setSelectedResumeId(resumeId);
    if (!resumeId) {
      setResumeText("");
      return;
    }
    const resume = resumes.find((r) => r._id === resumeId);
    // Always update text — clear if no extracted text so user sees the empty state
    setResumeText(resume?.extractedText || "");
  };

  // Can only analyze when there is actual text — either auto-filled from resume OR pasted
  const canAnalyze = resumeText.trim().length > 0;
  // Selected resume has no extracted text — warn user they can still paste manually
  const selectedResume = resumes.find((r) => r._id === selectedResumeId);
  const noExtractedText = selectedResumeId !== "" && !selectedResume?.extractedText;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: selectedResumeId || undefined,
          resumeText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      setAnalysis(data.analysis);
    } catch (err: any) {
      console.error("Error analyzing resume:", err);
      setError(
        err.message ||
          "Failed to analyze resume. Please check your API key configuration."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-9 w-56 bg-muted animate-pulse rounded-md" />
          <div className="h-5 w-80 bg-muted animate-pulse rounded-md mt-2" />
        </div>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Get AI-powered ATS analysis and improvement suggestions
        </p>
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-destructive text-sm">
                      Analysis Failed
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Dismiss error"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!analysis ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSearch className="h-5 w-5" />
              Select Resume to Analyze
            </CardTitle>
            <CardDescription>
              Choose a previously uploaded resume or paste your resume text
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select from uploaded resumes
                </label>
                <Select
                  value={selectedResumeId}
                  onChange={(e) => handleResumeSelect(e.target.value)}
                >
                  <option value="">Choose a resume...</option>
                  {resumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.title}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Warning: resume selected but PDF text extraction failed */}
            {noExtractedText && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-amber-700 dark:text-amber-300">Text extraction failed for this resume</p>
                  <p className="text-amber-600 dark:text-amber-400 mt-0.5">The PDF could not be parsed automatically. Please paste your resume text below to analyze it.</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {resumes.length > 0 ? "Or paste your resume text" : "Paste your resume text"}
              </label>
              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="min-h-[300px]"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              className="w-full"
              isLoading={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing your resume..." : "Analyze Resume"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Analysis Results</h2>
            <Button
              variant="outline"
              onClick={() => {
                setAnalysis(null);
                setError(null);
              }}
            >
              Analyze Another
            </Button>
          </div>
          <AnalysisResult analysis={analysis} />
        </motion.div>
      )}
    </div>
  );
}
