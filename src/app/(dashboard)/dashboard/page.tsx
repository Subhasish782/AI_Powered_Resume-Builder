import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import Analysis from "@/models/Analysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSearch, PenTool, Briefcase, TrendingUp, Award, FileText } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await connectDB();

  const userId = session?.user ? (session.user as any).id : null;
  
  if (!userId) {
    redirect("/login");
  }

  // Fetch stats
  const totalResumes = await Resume.countDocuments({ userId });
  const totalAnalyses = await Analysis.countDocuments({ userId });
  const latestAnalysis = await Analysis.findOne({ userId })
    .sort({ createdAt: -1 })
    .limit(1);

  const averageScore = latestAnalysis ? latestAnalysis.atsScore : 0;

  const quickActions = [
    {
      title: "Upload Resume",
      description: "Upload your existing resume for analysis",
      icon: Upload,
      href: "/upload",
      color: "bg-blue-500",
    },
    {
      title: "Analyze Resume",
      description: "Get AI-powered ATS analysis",
      icon: FileSearch,
      href: "/analyze",
      color: "bg-green-500",
    },
    {
      title: "Build Resume",
      description: "Create a new resume from scratch",
      icon: PenTool,
      href: "/builder",
      color: "bg-purple-500",
    },
    {
      title: "Job Match",
      description: "Compare with job descriptions",
      icon: Briefcase,
      href: "/match",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session?.user?.name || "User"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Here&apos;s what&apos;s happening with your resumes
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResumes}</div>
            <p className="text-xs text-muted-foreground">
              Resumes created or uploaded
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnalyses}</div>
            <p className="text-xs text-muted-foreground">
              AI-powered resume analyses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest ATS Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageScore > 0 ? `${averageScore}/100` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {averageScore > 0 ? "Your most recent score" : "No analysis yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-6">
            {totalResumes === 0 && totalAnalyses === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No activity yet. Start by uploading or creating a resume!
                </p>
                <Link href="/upload">
                  <Button>Upload Resume</Button>
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground">
                You have {totalResumes} resume(s) and {totalAnalyses} analysis(es).
                Check your <Link href="/history" className="text-primary hover:underline">history</Link> for details.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
