"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Trash2, FileText, Loader2, Eye } from "lucide-react";
import Link from "next/link";

interface Resume {
  _id: string;
  title: string;
  createdAt: string;
  template?: string;
}

interface Analysis {
  _id: string;
  resumeId: {
    _id: string;
    title: string;
  };
  atsScore: number;
  createdAt: string;
}

export default function HistoryPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"resumes" | "analyses">("resumes");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resumesRes, analysesRes] = await Promise.all([
        fetch("/api/resumes"),
        fetch("/api/analyze"),
      ]);

      const resumesData = await resumesRes.json();
      const analysesData = await analysesRes.json();

      setResumes(resumesData.resumes || []);
      setAnalyses(analysesData.analyses || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setResumes(resumes.filter((r) => r._id !== id));
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground mt-2">
          View your uploaded resumes and analysis history
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("resumes")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "resumes"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Resumes ({resumes.length})
        </button>
        <button
          onClick={() => setActiveTab("analyses")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "analyses"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Analyses ({analyses.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "resumes" ? (
        resumes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center mb-4">
                No resumes uploaded yet
              </p>
              <Link href="/upload">
                <Button>Upload Your First Resume</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume, index) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                        onClick={() => handleDeleteResume(resume._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg mt-2">{resume.title}</CardTitle>
                    <CardDescription>
                      Uploaded on {formatDate(resume.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Link href={`/analyze?resume=${resume._id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Analyze
                        </Button>
                      </Link>
                      <Link href={`/builder?resume=${resume._id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )
      ) : analyses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <History className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              No analyses performed yet
            </p>
            <Link href="/analyze">
              <Button>Analyze a Resume</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className={`text-3xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                      {analysis.atsScore}
                    </div>
                    <div>
                      <h3 className="font-medium">{analysis.resumeId?.title || "Untitled Resume"}</h3>
                      <p className="text-sm text-muted-foreground">
                        Analyzed on {formatDate(analysis.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Link href={`/analyze?resume=${analysis.resumeId?._id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
