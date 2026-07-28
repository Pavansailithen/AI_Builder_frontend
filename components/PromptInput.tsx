'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SAMPLE_PROMPTS = [
  { 
    tag: "CRM",
    title: "SaaS CRM", 
    desc: "Auth, stripe, analytics, role-based access",
    full: "Build a CRM with login, contacts, dashboard, role-based access for admin/sales, and premium plan with Stripe payments. Admins can see analytics."
  },
  { 
    tag: "STORE",
    title: "E-Commerce Platform", 
    desc: "Cart, checkout, tracking, admin panel",
    full: "Create an e-commerce platform with products, cart, checkout, order tracking, and admin panel."
  },
  { 
    tag: "KANBAN",
    title: "Jira Task Board", 
    desc: "Boards, tickets, sprints, team roles",
    full: "Build a project management tool like Jira with boards, tickets, sprints, and team roles."
  },
  { 
    tag: "LMS",
    title: "Modern Course App", 
    desc: "Courses, quizzes, student dashboard",
    full: "Create a learning management system with courses, students, instructors, quizzes, and certificates."
  }
]

export default function PromptInput() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate/async`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      if (data.job_id) router.push(`/generate/${data.job_id}`)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit()
  }

  return (
    <div className="min-h-screen md:h-screen bg-[#050507] bg-mesh-dark selection:bg-cyan-500/20 text-zinc-100 flex flex-col font-sans relative overflow-x-hidden overflow-y-auto md:overflow-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-3.5 flex items-center justify-between glass border-b border-zinc-800/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-white/10">
            <span className="text-black font-bold text-lg">✦</span>
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-tight font-mono">SchemaForge AI</div>
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest hidden sm:flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              COMPILE ENGINE v1.2.0 · LIVE
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3.5 sm:gap-4">
          <button
            onClick={() => router.push('/metrics')}
            className="flex items-center gap-1.5 text-xs font-bold font-mono text-zinc-400 hover:text-[#00f0ff] transition-all uppercase tracking-widest"
          >
            Metrics
          </button>
          <div className="h-4 w-px bg-zinc-800/80 hidden sm:block" />
          <a href="https://github.com" target="_blank" className="text-zinc-500 hover:text-[#00f0ff] transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-8 relative">
        
        {/* Futuristic background ambient glows */}
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7000ff]/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00f0ff]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="w-full max-w-4xl text-center mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.05] mb-5">
            Your Idea to <br />
            <span className="text-gradient-cyan">Production Schema</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed font-normal">
            The multi-stage AI pipeline that automates software architecture.
            Describe your application spec, and we compile database models, API layers, and auth policies.
          </p>
        </div>

        {/* Input Card */}
        <div className="w-full max-w-2xl animate-slide-up z-10">
          <div className="glass rounded-2xl p-1.5 shadow-2xl shadow-cyan-950/20 border border-zinc-800/40 hover:border-cyan-500/20 transition-all duration-500">
            <div className="bg-[#08080a]/90 rounded-xl p-5 border border-zinc-900/80 shadow-inner">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your next big system (e.g., 'A real-time logistics dashboard with admin controls and driver updates...')"
                className="w-full h-24 text-sm md:text-base text-zinc-100 placeholder-zinc-700 border-0 outline-none resize-none bg-transparent focus:ring-0 focus:outline-none"
              />
              
              <div className="flex items-center justify-between pt-3.5 border-t border-zinc-900/60">
                <div className="hidden md:flex flex-col">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Shortcut</span>
                  <span className="text-[10px] font-bold text-zinc-600 font-mono">Ctrl + Enter</span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || loading}
                  className="group relative flex items-center gap-2 bg-[#00f0ff] hover:bg-[#00f0ff]/90 disabled:opacity-20 disabled:cursor-not-allowed text-black text-xs font-bold font-mono tracking-wider px-6 py-2.5 rounded-xl transition-all duration-300 overflow-hidden shadow-lg shadow-cyan-500/10 hover:shadow-glow-cyan"
                >
                  {loading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"/>
                      <span>COMPILING ASSETS...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center gap-2">
                        BUILD SCHEMA <span className="text-black font-bold">✦</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Samples */}
        <div className="w-full max-w-4xl mt-8">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono text-center mb-4">
            // Select template prompt to begin
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4">
            {SAMPLE_PROMPTS.map((sample, i) => (
              <button
                key={i}
                onClick={() => setPrompt(sample.full)}
                className="group text-left p-4.5 bg-[#0a0a0c]/60 border border-zinc-900 rounded-xl hover:border-cyan-500/30 hover:bg-[#0c0c0f] hover:shadow-glow-cyan transition-all duration-300"
              >
                <div className="font-mono text-[9px] font-bold text-cyan-400 mb-2 opacity-80 uppercase">
                  [{sample.tag}]
                </div>
                <div className="font-bold text-white text-xs mb-1.5 group-hover:text-cyan-300 transition-colors">
                  {sample.title}
                </div>
                <div className="text-[11px] text-zinc-550 leading-normal line-clamp-2">
                  {sample.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-6 py-4 md:py-3 border-t border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#050507]">
        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest font-mono text-center sm:text-left">
          © 2026 SchemaForge AI · Engine v1.2.0
        </div>
        <div className="flex gap-4">
          <button className="text-[9px] font-bold text-zinc-500 hover:text-cyan-400 uppercase tracking-widest font-mono transition-colors">Docs</button>
          <button className="text-[9px] font-bold text-zinc-500 hover:text-cyan-400 uppercase tracking-widest font-mono transition-colors">API Specification</button>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up { animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  )
}

