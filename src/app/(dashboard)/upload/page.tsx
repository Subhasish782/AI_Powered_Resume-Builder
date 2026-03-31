"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileUpload } from "@/components/resume/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle, AlertCircle, Upload, Sparkles,
  FileSearch, ArrowRight, BarChart3
} from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [extractionStatus, setExtractionStatus] = useState<"" | "ok" | "failed">("");

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setTitle(selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    setUploadStatus("idle");
    setErrorMessage("");
    setExtractionStatus("");
  };

  const handleClear = () => {
    setFile(null);
    setTitle("");
    setUploadStatus("idle");
    setErrorMessage("");
    setExtractionStatus("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadStatus("idle");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name);

      const response = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to upload resume");

      setExtractionStatus(data.resume?.extractedText?.trim() ? "ok" : "failed");
      setUploadStatus("success");

      setTimeout(() => router.push("/analyze"), 2500);
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Resume</h1>
        <p className="text-muted-foreground mt-2">
          Upload your resume in PDF or DOCX format for AI-powered analysis
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Upload, label: "Upload", desc: "PDF or DOCX" },
          { icon: Sparkles, label: "AI Extracts", desc: "Text & data" },
          { icon: BarChart3, label: "Analyze", desc: "ATS score & tips" },
        ].map(({ icon: Icon, label, desc }, i) => (
          <div key={label} className="flex flex-col items-center gap-2 rounded-xl border bg-muted/30 p-3 text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            {i < 2 && (
              <ArrowRight className="absolute right-0 top-1/2 h-3 w-3 text-muted-foreground hidden" />
            )}
          </div>
        ))}
      </div>

      {/* Upload Card */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b">
          <h2 className="font-semibold text-base flex items-center gap-2">
            <FileSearch className="h-4 w-4 text-primary" />
            Select Your Resume
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Drag & drop or click to browse — PDF, DOCX, DOC (max 10MB)
          </p>
        </div>

        <div className="p-6 space-y-5">
          <FileUpload onFileSelect={handleFileSelect} onClear={handleClear} />

          <AnimatePresence>
            {file && uploadStatus !== "success" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Title input */}
                <div className="space-y-1.5">
                  <Label htmlFor="resume-title">Resume Title</Label>
                  <Input
                    id="resume-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Software Engineer Resume 2025"
                  />
                  <p className="text-xs text-muted-foreground">
                    Give your resume a memorable name to identify it later
                  </p>
                </div>

                {/* Upload button */}
                <Button
                  onClick={handleUpload}
                  className="w-full"
                  isLoading={isUploading}
                  disabled={isUploading}
                  size="lg"
                >
                  {isUploading ? (
                    "Uploading & extracting text..."
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resume
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error message */}
          <AnimatePresence>
            {uploadStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
              >
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm text-destructive">Upload failed</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{errorMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success message */}
          <AnimatePresence>
            {uploadStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 p-5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-700 dark:text-green-300">
                      Resume uploaded successfully!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Redirecting to analyze page...
                    </p>
                  </div>
                </div>

                {extractionStatus === "failed" && (
                  <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2 text-xs">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-amber-700 dark:text-amber-300">
                      Text extraction from PDF failed — you can paste your resume text manually on the Analyze page.
                    </p>
                  </div>
                )}

                {extractionStatus === "ok" && (
                  <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    Text extracted successfully — ready for AI analysis
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl border bg-muted/20 p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tips for best results</p>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {[
            "Use a text-based PDF (not a scanned image) for best text extraction",
            "DOCX files almost always extract perfectly",
            "Avoid password-protected files",
            "Single-column layouts extract more accurately than multi-column",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
