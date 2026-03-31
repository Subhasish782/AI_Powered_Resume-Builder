import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { extractTextFromFile } from "@/lib/pdf-parser";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const resumes = await Resume.find({ userId: (session.user as any).id })
      .sort({ createdAt: -1 })
      .select("title createdAt template extractedText");

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from file
    let extractedText = "";
    try {
      extractedText = await extractTextFromFile(buffer, file.type);
      
      // Extraction worked but returned nothing — keep empty so analyze page shows the warning
      if (!extractedText || extractedText.trim().length === 0) {
        console.warn("No text extracted from file — PDF may be image-based or password-protected");
        extractedText = "";
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      extractedText = "";
    }

    await connectDB();

    // Create resume document with minimal required fields
    const resume = await Resume.create({
      userId: (session.user as any).id,
      title: title || file.name,
      extractedText,
      // content will use schema defaults
    });

    return NextResponse.json(
      {
        message: "Resume uploaded successfully",
        resume: {
          id: resume._id.toString(),
          title: resume.title,
          extractedText: resume.extractedText,
          createdAt: resume.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}
