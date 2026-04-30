# App Compiler — Frontend

> Clean developer UI for the App Compiler pipeline

## 🚀 Live URL

`https://ai-builder-frontend-ten.vercel.app`

## 📄 Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Prompt input with example prompts |
| Results | `/generate/{job_id}` | Live pipeline progress + schema viewer |
| Metrics | `/metrics` | Evaluation metrics dashboard |

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 |
| Styling | Tailwind CSS |
| Syntax Highlighting | react-syntax-highlighter |
| Deployment | Vercel |

## 🏃 Local Setup

```bash
git clone https://github.com/Pavansailithen/AI_Builder_frontend.git
cd AI_Builder_frontend
npm install
# Add NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 to .env.local
npm run dev
```

## 🔗 Backend

API: `https://app-compiler-api.onrender.com`
