import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import Analysis from "@/models/Analysis";
import { analyzeResume } from "@/lib/ai-service";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, resumeText } = await req.json();

    if (!resumeText && !resumeId) {
      return NextResponse.json(
        { error: "Resume text or resume ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    let textToAnalyze = resumeText || "";
    let resumeDoc = null;

    // If resumeId is provided, fetch the resume from DB
    if (resumeId) {
      resumeDoc = await Resume.findOne({
        _id: resumeId,
        userId: (session.user as any).id,
      });

      if (!resumeDoc) {
        return NextResponse.json(
          { error: "Resume not found" },
          { status: 404 }
        );
      }

      // Use stored extractedText if available, otherwise keep the pasted text
      if (resumeDoc.extractedText?.trim()) {
        textToAnalyze = resumeDoc.extractedText;
      }
      // else: textToAnalyze stays as the pasted resumeText from request body
    }

    if (!textToAnalyze?.trim()) {
      return NextResponse.json(
        {
          error:
            "No resume text to analyze. Please paste your resume text in the text area below.",
        },
        { status: 400 }
      );
    }

    // Call OpenAI to analyze the resume
    const analysisResult = await analyzeResume(textToAnalyze);

    // Save analysis to database if resumeId is provided
    if (resumeDoc) {
      await Analysis.create({
        resumeId: resumeDoc._id,
        userId: (session.user as any).id,
        ...analysisResult,
      });
    }

    return NextResponse.json({
      message: "Analysis completed successfully",
      analysis: analysisResult,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("resumeId");

    await connectDB();

    const query: any = { userId: (session.user as any).id };
    if (resumeId) {
      query.resumeId = resumeId;
    }

    const analyses = await Analysis.find(query)
      .sort({ createdAt: -1 })
      .populate("resumeId", "title");

    return NextResponse.json({ analyses });
  } catch (error) {
    console.error("Error fetching analyses:", error);
    return NextResponse.json(
      { error: "Failed to fetch analyses" },
      { status: 500 }
    );
  }
}
