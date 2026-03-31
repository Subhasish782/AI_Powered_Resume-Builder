"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
};

export function FileUpload({
  onFileSelect,
  onClear,
  accept = ACCEPTED_TYPES,
  maxSize = 10 * 1024 * 1024,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError("");
      if (rejectedFiles.length > 0) {
        const code = rejectedFiles[0].errors[0].code;
        setError(
          code === "file-too-large"
            ? "File is too large. Maximum size is 10MB."
            : "Invalid file type. Please upload a PDF or DOCX file."
        );
        return;
      }
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept, maxSize, multiple: false,
  });

  const clearFile = () => {
    setSelectedFile(null);
    setError("");
    onClear?.();
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const isPDF = selectedFile?.type === "application/pdf";

  // ── Selected file state ──────────────────────────────────────
  if (selectedFile) {
    return (
      <div className="relative flex items-center gap-4 rounded-xl border-2 border-primary/30 bg-primary/5 px-4 py-4 transition-all">
        {/* File type badge */}
        <div className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white",
          isPDF ? "bg-red-500" : "bg-blue-500"
        )}>
          {isPDF ? "PDF" : "DOC"}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{selectedFile.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{formatSize(selectedFile.size)}</p>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <button
            onClick={clearFile}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Drop zone ────────────────────────────────────────────────
  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-primary bg-primary/8 scale-[1.01]"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/40",
          error && "border-destructive/50 bg-destructive/5"
        )}
      >
        <input {...getInputProps()} />

        {/* Icon */}
        <div className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
          isDragActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          {isDragActive
            ? <FileText className="h-8 w-8" />
            : <Upload className="h-8 w-8" />
          }
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-base">
            {isDragActive ? "Release to upload" : "Drag & drop your resume here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or <span className="text-primary font-medium">click to browse</span>
          </p>
        </div>

        {/* Supported formats */}
        <div className="flex items-center gap-2">
          {["PDF", "DOCX", "DOC"].map(fmt => (
            <span key={fmt} className="rounded-full border border-muted-foreground/20 bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {fmt}
            </span>
          ))}
          <span className="text-xs text-muted-foreground">· up to 10MB</span>
        </div>
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
