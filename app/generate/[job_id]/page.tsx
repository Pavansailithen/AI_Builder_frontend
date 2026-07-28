'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import SimulatedOutput from '@/components/SimulatedOutput'

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then(mod => mod.Prism),
  { ssr: false }
)
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const STAGES = [
  { key: 'intent_extraction', label: 'Intent Extraction', icon: '🔍', desc: 'Parsing requirements...' },
  { key: 'system_design', label: 'System Design', icon: '🏗️', desc: 'Architecture planning...' },
  { key: 'schema_generation', label: 'Schema Generation', icon: '⚙️', desc: 'Writing JSON code...' },
  { key: 'refinement', label: 'Refinement', icon: '✦', desc: 'Fixing consistency...' },
  { key: 'validation', label: 'Validation', icon: '🛡️', desc: 'Final audit...' },
]

const SCHEMA_TABS = [
  { id: 'ui', label: 'UI Layers', icon: '🎨' },
  { id: 'api', label: 'Endpoints', icon: '🔌' },
  { id: 'database', label: 'Models', icon: '💾' },
  { id: 'auth', label: 'Policies', icon: '🔐' },
  { id: 'business_logic', label: 'Logic', icon: '🧠' },
  { id: 'metadata', label: 'Context', icon: 'ℹ️' }
]

export default function GeneratePage() {
  const params = useParams()
  const router = useRouter()
  const job_id = params.job_id as string

  const [status, setStatus] = useState('created')
  const [currentStage, setCurrentStage] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('ui')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!job_id) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/status/${job_id}`)
        const data = await res.json()
        setStatus(data.status)
        setCurrentStage(data.current_stage)
        setProgress(data.progress || 0)

        if (data.status === 'completed') {
          clearInterval(interval)
          const resultRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/result/${job_id}`)
          const resultData = await resultRes.json()
          setResult(resultData.result?.schema || null)
        }
        if (data.status === 'failed') {
          clearInterval(interval)
          setError(data.error || 'Pipeline failed')
        }
      } catch (e) { console.error(e) }
    }, 3000)
    return () => clearInterval(interval)
  }, [job_id])

  const stageIndex = STAGES.findIndex(s => s.key === currentStage)

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result[activeTab], null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#050507] bg-mesh-dark flex flex-col font-sans text-zinc-100">
      
      {/* Dynamic Header */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between glass border-b border-zinc-800/40">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center text-white border border-zinc-800/60 hover:bg-[#0c0c0f] hover:border-[#00f0ff]/40 transition-colors">
            <span className="text-sm">←</span>
          </button>
          <div className="hidden md:block">
            <div className="font-bold text-white text-sm tracking-tight font-mono">Compiling App</div>
            <div className="text-[10px] text-[#00f0ff] font-bold uppercase tracking-widest font-mono truncate max-w-[150px]">ID: {job_id}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all font-mono ${
            status === 'completed' ? 'bg-emerald-950/40 border-emerald-800/30 text-emerald-400' :
            status === 'failed' ? 'bg-rose-950/40 border-rose-800/30 text-rose-400' :
            'bg-cyan-950/40 border-cyan-800/30 text-cyan-400 animate-pulse'
          }`}>
            {status.replace('_', ' ')}
          </div>
          {status === 'completed' && (
             <button onClick={() => router.push('/')} className="bg-[#00f0ff] text-black px-4 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wider shadow-lg shadow-cyan-500/10 hover:bg-cyan-400 hover:shadow-glow-cyan transition-all">
                NEW BUILD
             </button>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 pt-28 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Engine Status (Bento Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-[2rem] p-6 shadow-xl shadow-cyan-950/10 border border-zinc-800/40 bg-[#08080a]/60">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono">// Pipeline Monitor</h3>
              <span className="text-xs font-mono font-bold text-[#00f0ff]">{progress}%</span>
            </div>

            {/* Steps Visual */}
            <div className="relative space-y-8">
              {/* Connecting line */}
              <div className="absolute left-6 top-4 bottom-4 w-px bg-zinc-800" />
              
              {STAGES.map((stage, i) => {
                const completed = status === 'completed' || (stageIndex !== -1 && stageIndex > i)
                const active = stageIndex === i && status !== 'failed' && status !== 'completed'
                const failed = status === 'failed' && stageIndex === i

                return (
                  <div key={stage.key} className="relative flex items-start gap-5 group">
                    <div className={`relative z-10 w-12 h-12 rounded-[1.2rem] flex items-center justify-center transition-all duration-500 border ${
                      completed ? 'bg-emerald-950/40 border-emerald-800/30 text-emerald-400 shadow-lg shadow-emerald-900/10' :
                      active ? 'bg-cyan-950/40 border-cyan-800/40 text-[#00f0ff] shadow-xl shadow-[#00f0ff]/10 ring-4 ring-[#00f0ff]/5' :
                      failed ? 'bg-rose-950/40 border-rose-800/30 text-[#ff716c] shadow-lg shadow-rose-900/10' :
                      'bg-zinc-950 border-zinc-800 text-zinc-600'
                    }`}>
                      {completed ? '✓' : stage.icon}
                    </div>
                    
                    <div className="pt-1 flex-1">
                      <div className={`text-sm font-bold transition-colors font-mono ${
                        completed ? 'text-emerald-400' : 
                        active ? 'text-[#00f0ff]' : 
                        failed ? 'text-[#ff716c]' : 'text-zinc-500'
                      }`}>{stage.label}</div>
                      <div className="text-xs text-zinc-400 mt-1 font-medium">{stage.desc}</div>
                    </div>

                    {active && (
                       <div className="absolute -right-2 top-4 w-2 h-2 bg-[#00f0ff] rounded-full animate-ping" />
                    )}
                  </div>
                )
              })}
            </div>

            {status === 'processing' && (
              <div className="mt-10 p-4 bg-[#00f0ff]/5 rounded-2xl border border-[#00f0ff]/20 flex items-center gap-3 animate-pulse">
                <div className="w-2 h-2 bg-[#00f0ff] rounded-full animate-bounce" />
                <span className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-widest font-mono">Compiling Assets...</span>
              </div>
            )}
          </div>

          {/* Quick Metrics (Small Bento) */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-[#08080a]/60 border border-zinc-800/40 rounded-2xl p-4 shadow-sm hover:border-[#00f0ff]/20 transition-all">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 font-mono">// Latency</div>
                <div className="text-sm font-bold text-white font-mono">12.4s</div>
             </div>
             <div className="bg-[#08080a]/60 border border-zinc-800/40 rounded-2xl p-4 shadow-sm hover:border-[#00f0ff]/20 transition-all">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 font-mono">// Provider</div>
                <div className="text-sm font-bold text-white font-mono">Groq LLM</div>
             </div>
          </div>
        </div>

        {/* Right: Main Display (Output) */}
        <div className="lg:col-span-8">
           
          {error && (
            <div className="bg-[#0c0c0f]/80 border border-rose-800/40 rounded-3xl p-10 shadow-2xl shadow-rose-950/20 text-center animate-shake">
               <div className="w-16 h-16 bg-rose-950/40 text-[#ff716c] border border-rose-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">✗</div>
               <h2 className="text-xl font-bold text-white mb-2 font-mono">Build Pipeline Halted</h2>
               <p className="text-sm text-zinc-500 mb-8 max-w-sm mx-auto">{error}</p>
               <button onClick={() => router.push('/')} className="bg-[#00f0ff] hover:bg-cyan-400 text-black px-8 py-3 rounded-xl text-sm font-bold font-mono tracking-wider shadow-lg shadow-cyan-500/10 hover:shadow-glow-cyan transition-all">
                  BACK TO DRAFTING
               </button>
            </div>
          )}

          {status !== 'completed' && status !== 'failed' && (
            <div className="bg-[#08080a]/40 border border-zinc-900 rounded-[2rem] p-20 flex flex-col items-center justify-center text-center animate-pulse min-h-[500px] shadow-inner">
               <div className="relative mb-12">
                  <div className="w-24 h-24 border-b-4 border-[#00f0ff] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl text-[#00f0ff]">✦</div>
               </div>
               <h2 className="text-2xl font-bold text-white mb-3 tracking-tight font-mono">Assembling Project Schema</h2>
               <p className="text-zinc-500 text-sm max-w-xs mx-auto">This usually takes 15-30 seconds depending on app complexity.</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Result Overview */}
              <div className="bg-[#08080a]/80 border border-zinc-800/40 rounded-3xl p-8 shadow-2xl shadow-cyan-950/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <h1 className="text-2xl font-bold text-white tracking-tight font-mono">{result.app_name}</h1>
                       <span className="bg-emerald-950/40 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-emerald-800/30 font-mono">Ready</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{result.description}</p>
                  </div>
                  <div className="flex gap-2">
                     {result.metadata?.assumptions?.slice(0, 3).map((a: string, i: number) => (
                       <span key={i} className="px-3 py-1.5 bg-zinc-900 border border-zinc-800/60 text-zinc-500 text-[10px] font-bold rounded-lg uppercase tracking-tight font-mono">
                         {a.split(' ')[0]}
                       </span>
                     ))}
                  </div>
                </div>
              </div>

              {/* Code Explorer */}
              <div className="glass rounded-3xl overflow-hidden bg-[#08080a]/80 border border-zinc-800/40 shadow-2xl shadow-cyan-950/10">
                <div className="flex bg-[#0c0c0f]/60 border-b border-zinc-900 overflow-x-auto no-scrollbar">
                  {SCHEMA_TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-6 py-4 transition-all whitespace-nowrap font-mono ${
                        activeTab === tab.id
                          ? 'text-[#00f0ff] bg-[#0c0c0f]/80 border-b-2 border-[#00f0ff]'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <span className="text-xs">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="bg-[#0c0c0e]/80 p-4 flex justify-between items-center border-b border-zinc-900/60">
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#32ff7e] rounded-full animate-pulse" />
                      <span className="text-[10px] font-mono text-zinc-500">{activeTab.toUpperCase()}.JSON</span>
                   </div>
                   <button 
                     onClick={handleCopy} 
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest transition-all ${
                       copied ? 'bg-emerald-950/60 text-[#32ff7e] border border-[#32ff7e]/30' : 'bg-[#00f0ff] hover:bg-cyan-400 text-black font-bold shadow-md hover:shadow-glow-cyan'
                     }`}
                   >
                     {copied ? '✓ Copied' : 'Copy Schema'}
                   </button>
                </div>

                <div className="max-h-[500px] overflow-auto bg-[#0a0a0c]">
                  <SyntaxHighlighter
                    language="json"
                    style={oneDark}
                    customStyle={{ 
                      margin: 0, 
                      padding: '24px',
                      borderRadius: 0, 
                      fontSize: '12px', 
                      background: 'transparent',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    {JSON.stringify(result[activeTab], null, 2)}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Visualization Placeholder */}
              <div className="mt-8">
                 <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-4 font-mono">// Entity Visualization</h3>
                 <SimulatedOutput schema={result} />
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out 0s 2; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

