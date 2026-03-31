// Quick smoke-test for pdfjs-dist extraction
// Run: node test-pdf.mjs
import path from "path";
import { fileURLToPath } from "url";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const workerPath = path.resolve(__dirname, "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs");
pdfjsLib.GlobalWorkerOptions.workerSrc = "file:///" + workerPath.split("\\").join("/");

// Minimal valid PDF bytes that contain readable text
// This is a pre-built base64-encoded tiny PDF with "Hello World"
const minimalPdfB64 =
  "JVBERi0xLjQKMSAwIG9iajw8L1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDIgMCBSPj5lbmRvYmoKMiAwIG9iajw8L1R5cGUgL1BhZ2VzIC9LaWRzWzMgMCBSXSAvQ291bnQgMT4+ZW5kb2JqCjMgMCBvYmo8PC9UeXBlIC9QYWdlIC9NZWRpYUJveFswIDAgNjEyIDc5Ml0gL1BhcmVudCAyIDAgUiAvQ29udGVudHMgNCAwIFIgL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA1IDAgUj4+Pj4+PgplbmRvYmoKNCAwIG9iajw8L0xlbmd0aCA0ND4+CnN0cmVhbQpCVCAvRjEgMTIgVGYgMTAwIDcwMCBUZCAoSGVsbG8gV29ybGQpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iajw8L1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhPj5lbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjc0IDAwMDAwIG4gCjAwMDAwMDAzNzAgMDAwMDAgbiAKdHJhaWxlcjw8L1NpemUgNiAvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo0NDEKJSVFT0Y=";

const buf = Buffer.from(minimalPdfB64, "base64");
const uint8Array = new Uint8Array(buf);

console.log("Testing pdfjs-dist PDF extraction...");
const loadingTask = pdfjsLib.getDocument({
  data: uint8Array,
  useWorkerFetch: false,
  isEvalSupported: false,
  useSystemFonts: true,
});

try {
  const pdf = await loadingTask.promise;
  console.log("✅ PDF loaded. Pages:", pdf.numPages);
  const page = await pdf.getPage(1);
  const content = await page.getTextContent();
  const text = content.items.map((i) => i.str ?? "").join(" ").trim();
  console.log("✅ Extracted text:", JSON.stringify(text));
  if (text.length > 0) {
    console.log("\n🎉 PDF extraction is working correctly!");
  } else {
    console.log("\n⚠️  No text found (may be image-based PDF)");
  }
} catch (e) {
  console.log("❌ Error:", e.message);
} finally {
  process.exit(0);
}
