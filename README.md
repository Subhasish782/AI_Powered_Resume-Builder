

# ✨ ResumeAI — Intelligent Resume Builder

**Build smarter resumes. Land better jobs.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[🚀 Live Demo](#) • [📖 Docs](#features) • [🐛 Report Bug](../../issues) • [💡 Request Feature](../../issues)

</div>

---

## 📸 Preview

> **ResumeAI** is a full-stack, AI-powered resume builder that analyzes your resume for ATS compatibility, matches it against job descriptions, and helps you craft the perfect resume — all in a modern, beautiful dashboard.

---

## 🌟 Features

| Feature | Description |
|---|---|
| 🤖 **AI Resume Analysis** | ATS score, strengths, weaknesses, keyword gaps & section scores |
| 🎯 **Job Match Engine** | Compares your resume to any job description with % match score |
| 📄 **Resume Builder** | Drag-and-drop editor with live preview |
| 🎨 **8 Premium Templates** | Modern, Classic, Minimal, Professional, Executive, Creative, Tech, Corporate |
| 📤 **PDF Export** | Export your resume as a polished PDF instantly |
| 📁 **File Upload** | Upload existing resumes in PDF or DOCX format |
| 🔐 **Auth System** | Secure sign up / sign in via NextAuth.js |
| 📊 **Dashboard** | History, analytics, and profile management |
| 🌙 **Dark Mode** | Full dark/light mode support |

---

## 🧠 AI Architecture

ResumeAI uses a **multi-model fallback strategy** to guarantee reliable AI responses:

```
1️⃣  Groq  →  llama-3.1-8b-instant  (Primary — FREE tier)
2️⃣  OpenAI → gpt-3.5-turbo          (Fallback)
3️⃣  Mock   → Pre-built response      (Offline safe fallback)
```

- **Groq** is used as the primary provider (blazing fast, free tier available at [console.groq.com](https://console.groq.com))
- **OpenAI** is an optional paid fallback
- If all providers fail, a sensible mock response is returned — no crashes

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** — App Router, Server Components, API Routes
- **[React 19](https://react.dev/)** — Latest stable with concurrent features
- **[TypeScript 5](https://www.typescriptlang.org/)** — End-to-end type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** — Smooth animations
- **[Lucide React](https://lucide.dev/)** — Beautiful icon library
- **[Recharts](https://recharts.org/)** — Analytics and score charts

### Backend & Data
- **[MongoDB Atlas](https://www.mongodb.com/atlas)** — Cloud database
- **[Mongoose](https://mongoosejs.com/)** — ODM for schema modeling
- **[NextAuth.js](https://next-auth.js.org/)** — Authentication with JWT sessions
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js/)** — Password hashing

### AI & Document Processing
- **[Groq API](https://console.groq.com)** — Primary LLM (Llama 3) — FREE
- **[OpenAI API](https://platform.openai.com)** — GPT-3.5 fallback
- **[pdf-parse](https://www.npmjs.com/package/pdf-parse)** — PDF text extraction
- **[mammoth](https://github.com/mwilliamson/mammoth.js)** — DOCX text extraction
- **[@react-pdf/renderer](https://react-pdf.org/)** — PDF generation

---

## 📁 Project Structure

```
resume-builder/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login & Register pages
│   │   ├── (home)/             # Landing page
│   │   ├── (dashboard)/        # Protected dashboard
│   │   │   ├── analyze/        # Resume analysis page
│   │   │   ├── builder/        # Resume editor
│   │   │   ├── dashboard/      # Overview & stats
│   │   │   ├── history/        # Past resume scans
│   │   │   ├── match/          # Job match page
│   │   │   ├── profile/        # User profile
│   │   │   ├── templates/      # Template browser
│   │   │   └── upload/         # File upload page
│   │   └── api/
│   │       ├── analyze/        # POST /api/analyze
│   │       ├── auth/           # NextAuth handlers
│   │       ├── match/          # POST /api/match
│   │       └── resume/         # Resume CRUD APIs
│   ├── components/             # Reusable UI components
│   ├── lib/
│   │   ├── ai-service.ts       # AI orchestration layer
│   │   ├── auth.ts             # NextAuth config
│   │   ├── mongodb.ts          # DB connection
│   │   ├── openai.ts           # Groq + OpenAI callers
│   │   ├── pdf-parser.ts       # PDF/DOCX parsing
│   │   └── utils.ts            # Helpers
│   ├── models/                 # Mongoose models
│   ├── templates/              # Resume PDF templates
│   └── types/                  # TypeScript interfaces
├── public/                     # Static assets
├── middleware.ts               # Auth route protection
├── next.config.ts              # Next.js config
└── .env.local                  # Environment variables (not committed)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.x`
- **npm** `>= 9.x`
- A **MongoDB Atlas** account (free tier works perfectly)
- A **Groq API key** (free at [console.groq.com](https://console.groq.com))

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/resume-builder.git
cd resume-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# ─── MongoDB ───────────────────────────────────────
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/resume_builder"

# ─── NextAuth ──────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your-super-secret-key-here"

# ─── AI Providers ──────────────────────────────────
# PRIMARY — Get your FREE key at https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here

# FALLBACK — Optional, only if Groq is unavailable
# OPENAI_API_KEY=sk-proj-your-openai-key-here
```

> ⚠️ **Never commit `.env.local` to Git.** It's already listed in `.gitignore`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## 🔑 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string |
| `NEXTAUTH_URL` | ✅ Yes | Base URL of your app |
| `NEXTAUTH_SECRET` | ✅ Yes | Random secret for JWT signing |
| `GROQ_API_KEY` | ⭐ Recommended | Primary AI provider (free) |
| `OPENAI_API_KEY` | 🔧 Optional | Fallback AI provider (paid) |

---

## 🧪 Available Scripts

```bash
npm run dev      # Start development server on http://localhost:3000
npm run build    # Build production bundle
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 📊 Key Pages & Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/login` | User login |
| `/register` | Create account |
| `/dashboard` | Main dashboard overview |
| `/upload` | Upload existing resume (PDF/DOCX) |
| `/analyze` | AI-powered ATS analysis |
| `/match` | Job description matching |
| `/builder` | Interactive resume editor |
| `/templates` | Browse resume templates |
| `/history` | Past analysis history |
| `/profile` | Account settings |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Groq](https://groq.com/) for blazing-fast, free LLM inference
- [Next.js](https://nextjs.org/) for the incredible full-stack framework
- [MongoDB Atlas](https://www.mongodb.com/atlas) for the free cloud database
- [Vercel](https://vercel.com/) for seamless deployment

---

