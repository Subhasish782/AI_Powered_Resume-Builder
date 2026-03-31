import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, template } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const resume = await Resume.create({
      userId: (session.user as any).id,
      title,
      content,
      template: template || "modern",
    });

    return NextResponse.json(
      {
        message: "Resume created successfully",
        resume: {
          id: resume._id.toString(),
          title: resume.title,
          createdAt: resume.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}
