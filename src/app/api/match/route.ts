import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { matchJobDescription } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, jobDescription, resumeText: bodyResumeText } = await req.json();

    if (!jobDescription?.trim()) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    // If caller provided raw text directly, use it without a DB lookup
    let resumeText = bodyResumeText?.trim() || "";

    // Otherwise look up from DB
    if (!resumeText && resumeId) {
      await connectDB();

      const resume = await Resume.findOne({
        _id: resumeId,
        userId: (session.user as any).id,
      });

      if (!resume) {
        return NextResponse.json(
          { error: "Resume not found" },
          { status: 404 }
        );
      }

      resumeText = resume.extractedText?.trim() || "";
    }

    if (!resumeText) {
      return NextResponse.json(
        {
          error:
            "No resume text available for matching. Please paste your resume text manually.",
        },
        { status: 400 }
      );
    }

    const matchResult = await matchJobDescription(resumeText, jobDescription);

    return NextResponse.json({
      message: "Job match analysis completed",
      match: matchResult,
    });
  } catch (error) {
    console.error("Error matching job description:", error);
    return NextResponse.json(
      { error: "Failed to analyze job match" },
      { status: 500 }
    );
  }
}
