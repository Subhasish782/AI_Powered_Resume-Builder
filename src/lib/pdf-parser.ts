import mammoth from "mammoth";
import path from "path";

/**
 * PDF parsing using pdfjs-dist (ESM, Node 22-compatible).
 *
 * We use a dynamic import() so Turbopack treats it as a server-only
 * module that is excluded from the client bundle. The worker is pointed
 * at the local file so no network fetch is required at runtime.
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import keeps this out of the client bundle
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // Point the worker at the local copy — required by pdfjs-dist v4+
    const workerPath = path.resolve(
      process.cwd(),
      "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"
    );
    pdfjsLib.GlobalWorkerOptions.workerSrc = `file://${workerPath}`;

    // Convert Buffer → Uint8Array (pdfjs expects typed array, not Buffer)
    const uint8Array = new Uint8Array(buffer);

    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    const textParts: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => item.str ?? "")
        .join(" ");
      textParts.push(pageText);
    }

    return textParts.join("\n").trim();
  } catch (error: any) {
    console.error("PDF parsing error:", error?.message || error);
    return "";
  }
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value?.trim() || "";
  } catch (error: any) {
    console.error("DOCX parsing error:", error?.message || error);
    return "";
  }
}

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf") {
    return extractTextFromPDF(buffer);
  }
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    return extractTextFromDOCX(buffer);
  }
  throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
}
