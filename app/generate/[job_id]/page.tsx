'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import SimulatedOutput from '@/components/SimulatedOutput'

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter').then(mod => mod.Prism),
  { ssr: false }
)
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'

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
    <div className="min-h-screen bg-[#FAFAFA] bg-mesh-light flex flex-col font-sans">
      
      {/* Dynamic Header */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between glass border-b border-zinc-200/50">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center text-white hover:bg-zinc-800 transition-colors">
            <span className="text-sm">←</span>
          </button>
          <div className="hidden md:block">
            <div className="font-bold text-zinc-900 text-sm tracking-tight">Compiling App</div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-mono truncate max-w-[120px]">ID: {job_id}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
            status === 'completed' ? 'bg-green-50 border-green-200 text-green-600' :
            status === 'failed' ? 'bg-red-50 border-red-200 text-red-600' :
            'bg-violet-50 border-violet-200 text-violet-600 animate-pulse'
          }`}>
            {status.replace('_', ' ')}
          </div>
          {status === 'completed' && (
             <button onClick={() => router.push('/')} className="bg-violet-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all">
                New Build
             </button>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 pt-28 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Engine Status (Bento Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-[2rem] p-6 shadow-xl shadow-zinc-200/20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Pipeline Status</h3>
              <span className="text-xs font-mono font-bold text-violet-600">{progress}%</span>
            </div>

            {/* Steps Visual */}
            <div className="relative space-y-8">
              {/* Connecting line */}
              <div className="absolute left-6 top-4 bottom-4 w-px bg-zinc-100" />
              
              {STAGES.map((stage, i) => {
                const completed = status === 'completed' || (stageIndex !== -1 && stageIndex > i)
                const active = stageIndex === i && status !== 'failed' && status !== 'completed'
                const failed = status === 'failed' && stageIndex === i

                return (
                  <div key={stage.key} className="relative flex items-start gap-5 group">
                    <div className={`relative z-10 w-12 h-12 rounded-[1.2rem] flex items-center justify-center transition-all duration-500 border ${
                      completed ? 'bg-green-50 border-green-200 text-green-600 shadow-lg shadow-green-100' :
                      active ? 'bg-violet-50 border-violet-200 text-violet-600 shadow-xl shadow-violet-200 ring-4 ring-violet-50' :
                      failed ? 'bg-red-50 border-red-200 text-red-600 shadow-lg shadow-red-100' :
                      'bg-white border-zinc-100 text-zinc-300'
                    }`}>
                      {completed ? '✓' : stage.icon}
                    </div>
                    
                    <div className="pt-1 flex-1">
                      <div className={`text-sm font-bold transition-colors ${
                        completed ? 'text-green-700' : 
                        active ? 'text-violet-700' : 
                        failed ? 'text-red-700' : 'text-zinc-400'
                      }`}>{stage.label}</div>
                      <div className="text-xs text-zinc-400 mt-1 font-medium">{stage.desc}</div>
                    </div>

                    {active && (
                       <div className="absolute -right-2 top-4 w-2 h-2 bg-violet-400 rounded-full animate-ping" />
                    )}
                  </div>
                )
              })}
            </div>

            {status === 'processing' && (
              <div className="mt-10 p-4 bg-violet-50 rounded-2xl border border-violet-100 flex items-center gap-3 animate-pulse">
                <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">Compiling Assets...</span>
              </div>
            )}
          </div>

          {/* Quick Metrics (Small Bento) */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white border border-zinc-100 rounded-[1.5rem] p-4 shadow-sm">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Latency</div>
                <div className="text-sm font-bold text-zinc-900">12.4s</div>
             </div>
             <div className="bg-white border border-zinc-100 rounded-[1.5rem] p-4 shadow-sm">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Provider</div>
                <div className="text-sm font-bold text-zinc-900">Groq LLM</div>
             </div>
          </div>
        </div>

        {/* Right: Main Display (Output) */}
        <div className="lg:col-span-8">
           
          {error && (
            <div className="bg-white border-2 border-red-100 rounded-[2rem] p-10 shadow-xl shadow-red-50 text-center animate-shake">
               <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">✗</div>
               <h2 className="text-xl font-bold text-zinc-900 mb-2">Build Pipeline Halted</h2>
               <p className="text-sm text-zinc-500 mb-8 max-w-sm mx-auto">{error}</p>
               <button onClick={() => router.push('/')} className="bg-zinc-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all">
                  Back to Drafting
               </button>
            </div>
          )}

          {status !== 'completed' && status !== 'failed' && (
            <div className="bg-white/50 border border-zinc-100 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center animate-pulse min-h-[500px]">
               <div className="relative mb-12">
                  <div className="w-24 h-24 border-b-4 border-violet-600 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">✦</div>
               </div>
               <h2 className="text-2xl font-bold text-zinc-900 mb-3 tracking-tight">Assembling Project Schema</h2>
               <p className="text-zinc-400 text-sm max-w-xs mx-auto">This usually takes 15-30 seconds depending on app complexity.</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Result Overview */}
              <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-xl shadow-zinc-200/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{result.app_name}</h1>
                       <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-green-100">Ready</span>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">{result.description}</p>
                  </div>
                  <div className="flex gap-2">
                     {result.metadata?.assumptions?.slice(0, 3).map((a: string, i: number) => (
                       <span key={i} className="px-3 py-1.5 bg-zinc-50 border border-zinc-100 text-zinc-400 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                         {a.split(' ')[0]}
                       </span>
                     ))}
                  </div>
                </div>
              </div>

              {/* Code Explorer */}
              <div className="glass rounded-[2rem] overflow-hidden shadow-2xl shadow-zinc-200/30">
                <div className="flex bg-white/50 border-b border-zinc-100 overflow-x-auto no-scrollbar">
                  {SCHEMA_TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-6 py-4 transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-violet-600 bg-white border-b-2 border-violet-600'
                          : 'text-zinc-400 hover:text-zinc-600'
                      }`}
                    >
                      <span className="text-xs">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="bg-white p-4 flex justify-between items-center border-b border-zinc-50">
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-[10px] font-mono text-zinc-400">{activeTab.toUpperCase()}.JSON</span>
                   </div>
                   <button 
                     onClick={handleCopy} 
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                       copied ? 'bg-green-50 text-green-600' : 'bg-zinc-900 text-white hover:bg-zinc-800'
                     }`}
                   >
                     {copied ? '✓ Copied' : 'Copy Schema'}
                   </button>
                </div>

                <div className="max-h-[500px] overflow-auto bg-white">
                  <SyntaxHighlighter
                    language="json"
                    style={oneLight}
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
                 <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 px-4">Entity Visualization</h3>
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
