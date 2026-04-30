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
  { key: 'intent_extraction', label: 'Intent Extraction', icon: '🔍' },
  { key: 'system_design', label: 'System Design', icon: '🏗️' },
  { key: 'schema_generation', label: 'Schema Generation', icon: '⚙️' },
  { key: 'refinement', label: 'Refinement', icon: '✦' },
  { key: 'validation', label: 'Validation & Repair', icon: '🛡️' },
]

const SCHEMA_TABS = ['ui', 'api', 'database', 'auth', 'business_logic', 'metadata']

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
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">⚡</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">App Compiler</div>
            <div className="text-xs text-gray-400">AI App Schema Generator</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-gray-400">Job: {job_id}</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            status === 'completed' ? 'bg-green-100 text-green-700' :
            status === 'failed' ? 'bg-red-100 text-red-700' :
            'bg-violet-100 text-violet-700'
          }`}>
            {status === 'completed' ? '✓ Completed' : status === 'failed' ? '✗ Failed' : '⟳ Processing'}
          </span>
          <button onClick={() => router.push('/')} className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50">
            ← New
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left: Pipeline Progress */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sticky top-6">
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Pipeline Progress</h3>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-5">
              <div className="bg-violet-600 h-1.5 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>

            <div className="space-y-3">
              {STAGES.map((stage, i) => {
                const completed = status === 'completed' || stageIndex > i
                const active = stageIndex === i && status === 'processing'
                return (
                  <div key={stage.key} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${active ? 'bg-violet-50' : ''}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${
                      completed ? 'bg-green-100 text-green-600' :
                      active ? 'bg-violet-100 text-violet-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {completed ? '✓' : stage.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs font-medium ${
                        completed ? 'text-green-700' : active ? 'text-violet-700' : 'text-gray-400'
                      }`}>{stage.label}</div>
                      {active && <div className="text-xs text-violet-400 mt-0.5">Running...</div>}
                      {completed && <div className="text-xs text-green-500 mt-0.5">Done</div>}
                    </div>
                  </div>
                )
              })}
            </div>

            {status === 'processing' && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
                ~20s per stage · ~2 min total
              </div>
            )}
          </div>
        </div>

        {/* Right: Results */}
        <div className="md:col-span-2">

          {/* Error */}
          {error && (
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-red-500">✗</span>
                <h3 className="font-semibold text-red-700 text-sm">Pipeline Failed</h3>
              </div>
              <p className="text-xs text-gray-500 font-mono bg-red-50 rounded-lg p-3 mb-4 break-all">{error}</p>
              <div className="text-xs text-gray-400 mb-4">
                <p className="font-medium mb-1">Common causes:</p>
                <p>• Groq API rate limit (resets every 24h)</p>
                <p>• Prompt too vague or very short</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => router.push('/')} className="flex-1 bg-violet-600 text-white text-sm font-medium py-2 rounded-xl hover:bg-violet-700">
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {status !== 'completed' && status !== 'failed' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="w-10 h-10 border-3 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
              <p className="text-gray-600 text-sm font-medium">Pipeline running...</p>
              <p className="text-gray-400 text-xs mt-1">{progress}% complete</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <>
              {/* App Header */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{result.app_name}</h1>
                    <p className="text-gray-500 text-sm mt-1">{result.description}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    ✓ Generated
                  </span>
                </div>
                {result.metadata?.assumptions?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {result.metadata.assumptions.map((a: string, i: number) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">{a}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Schema Tabs */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
                <div className="flex border-b border-gray-100 overflow-x-auto">
                  {SCHEMA_TABS.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-xs px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab
                          ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-mono">{activeTab}.json</span>
                  <button onClick={handleCopy} className={`text-xs px-2 py-1 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <SyntaxHighlighter
                  language="json"
                  style={oneLight}
                  customStyle={{ margin: 0, borderRadius: 0, maxHeight: '400px', fontSize: '11px', background: '#fff' }}
                >
                  {JSON.stringify(result[activeTab], null, 2)}
                </SyntaxHighlighter>
              </div>

              <SimulatedOutput schema={result} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
