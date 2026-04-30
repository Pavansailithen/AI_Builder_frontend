'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SAMPLE_PROMPTS = [
  { 
    title: "SaaS CRM", 
    desc: "Auth, stripe, analytics, role-based access",
    full: "Build a CRM with login, contacts, dashboard, role-based access for admin/sales, and premium plan with Stripe payments. Admins can see analytics."
  },
  { 
    title: "E-Commerce", 
    desc: "Cart, checkout, tracking, admin panel",
    full: "Create an e-commerce platform with products, cart, checkout, order tracking, and admin panel."
  },
  { 
    title: "Jira Clone", 
    desc: "Boards, tickets, sprints, team roles",
    full: "Build a project management tool like Jira with boards, tickets, sprints, and team roles."
  },
  { 
    title: "Modern LMS", 
    desc: "Courses, quizzes, certificates, student dashboard",
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
    <div className="min-h-screen bg-[#FAFAFA] bg-mesh-light selection:bg-violet-100 flex flex-col font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between glass border-b border-zinc-200/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
            <span className="text-white text-lg">✦</span>
          </div>
          <div>
            <div className="font-bold text-zinc-900 text-sm tracking-tight">App Compiler</div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">v1.0.0 · AI Engine</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/metrics')}
            className="hidden md:flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-all uppercase tracking-widest"
          >
            Metrics
          </button>
          <div className="h-4 w-px bg-zinc-200 hidden md:block" />
          <a href="https://github.com" target="_blank" className="text-zinc-400 hover:text-zinc-900 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-10 relative overflow-hidden">
        
        {/* Background visual */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-100/20 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="w-full max-w-4xl text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-600 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 animate-fade-in">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
            V1.0 Now in Production
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight leading-[1.1] mb-4">
            Your Idea to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Production Schema</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-sm text-zinc-400 leading-relaxed font-medium">
            The multi-stage AI pipeline that automates software architecture. 
            Describe your app, and we'll handle the rest.
          </p>
        </div>

        {/* Input Card */}
        <div className="w-full max-w-2xl animate-slide-up">
          <div className="glass rounded-[1.5rem] p-2 shadow-xl shadow-violet-200/30">
            <div className="bg-white rounded-[1rem] p-4 shadow-inner border border-zinc-100">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your next big idea..."
                className="w-full h-24 text-base text-zinc-800 placeholder-zinc-300 border-0 outline-none resize-none bg-transparent"
              />
              
              <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                <div className="hidden md:flex flex-col">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Shortcut</span>
                  <span className="text-[10px] font-bold text-zinc-300">⌘ + Enter</span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || loading}
                  className="group relative flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed text-white text-xs font-bold px-6 py-3 rounded-xl transition-all overflow-hidden"
                >
                  {loading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                      <span>Compiling...</span>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center gap-2">
                        Build App <span className="text-violet-400 text-xs">✦</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Condenced Bento Samples */}
        <div className="w-full max-w-4xl mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 px-4">
          {SAMPLE_PROMPTS.map((sample, i) => (
            <button
              key={i}
              onClick={() => setPrompt(sample.full)}
              className="group text-left p-3 bg-white border border-zinc-100 rounded-xl hover:border-violet-200 hover:shadow-lg transition-all"
            >
              <div className="font-bold text-zinc-900 text-[11px] mb-0.5">{sample.title}</div>
              <div className="text-[10px] text-zinc-400 leading-tight line-clamp-1">{sample.desc}</div>
            </button>
          ))}
        </div>

        {/* Minimal Pipeline Visual */}
        <div className="w-full max-w-2xl mt-12 border-t border-zinc-100 pt-8 hidden md:block">
          <div className="flex justify-between items-center opacity-40">
            {['Intent', 'System', 'Schema', 'Refine', 'Verify'].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{step}</span>
                {i < 4 && <span className="text-zinc-200">→</span>}
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between">
        <div className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">
          © 2026 App Compiler AI
        </div>
        <div className="flex gap-4">
          <button className="text-[9px] font-bold text-zinc-300 hover:text-zinc-900 uppercase tracking-widest transition-colors">Docs</button>
          <button className="text-[9px] font-bold text-zinc-300 hover:text-zinc-900 uppercase tracking-widest transition-colors">API</button>
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
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-slide-up { animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  )
}
