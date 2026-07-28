'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MetricsPage() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/eval/report`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setReport(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not connect to backend')
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-12 h-12 border-b-2 border-[#00f0ff] rounded-full animate-spin" />
        <p className="text-zinc-500 text-[10px] font-bold font-mono uppercase tracking-widest">// Accessing engine reports...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050507] bg-mesh-dark text-zinc-100 font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between glass border-b border-zinc-800/40">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center text-white border border-zinc-800/60 hover:bg-[#0c0c0f] hover:border-[#00f0ff]/40 transition-colors">
            <span className="text-sm">←</span>
          </button>
          <div>
            <div className="font-bold text-white text-sm tracking-tight font-mono">Performance Metrics</div>
            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-mono">SchemaForge AI v1.2.0</div>
          </div>
        </div>
        <div className="text-[10px] font-mono font-bold text-[#00f0ff] uppercase tracking-widest hidden md:block">
          // Snapshot: {report ? new Date(report.generated_at).toLocaleDateString() : '--'}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">

        {error ? (
          <div className="glass bg-[#08080a]/60 border border-zinc-800/40 rounded-3xl p-20 text-center shadow-2xl shadow-cyan-950/10">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">📊</div>
            <h2 className="text-xl font-bold text-white mb-2 font-mono">No evaluation data found</h2>
            <p className="text-sm text-zinc-500 mb-10 max-w-xs mx-auto">{error}</p>
            <div className="bg-zinc-950 rounded-2xl p-6 max-w-md mx-auto border border-zinc-900">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 font-mono">// Run Evaluation from CLI</p>
              <code className="text-[11px] text-[#00f0ff] font-mono break-all leading-relaxed bg-[#0c0c0f] p-3 rounded-lg block border border-zinc-800/40">
                python -c "import asyncio; from app.evaluation.runner import run_evaluation; asyncio.run(run_evaluation(['N01']))"
              </code>
            </div>
          </div>
        ) : report && (
          <div className="animate-fade-in">
            {/* Overview Bento */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Success Rate', value: report.overview.overall_success_rate, color: 'text-[#32ff7e]', bg: 'bg-[#32ff7e]/5 border-[#32ff7e]/20' },
                { label: 'Avg Latency', value: `${report.overview.avg_latency_seconds}s`, color: 'text-[#00f0ff]', bg: 'bg-[#00f0ff]/5 border-[#00f0ff]/20' },
                { label: 'Avg Score', value: `${report.overview.avg_runtime_score}/100`, color: 'text-[#d1bcff]', bg: 'bg-[#7000ff]/5 border-[#7000ff]/20' },
                { label: 'Total Tested', value: report.overview.total_prompts_tested, color: 'text-white', bg: 'bg-[#08080a]/60 border-[#27272a]' },
              ].map(card => (
                <div key={card.label} className={`${card.bg} border rounded-3xl p-8 shadow-xl shadow-cyan-950/5 hover:border-[#00f0ff]/40 hover:shadow-glow-cyan transition-all duration-300`}>
                  <div className={`text-4xl md:text-5xl font-extrabold font-mono tracking-tighter ${card.color}`}>{card.value}</div>
                  <div className="text-zinc-400 text-[10px] font-bold font-mono uppercase tracking-widest mt-3">// {card.label}</div>
                </div>
              ))}
            </div>

            {/* Sub-metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-[#08080a]/60 border border-zinc-800/40 rounded-3xl p-8 shadow-xl hover:border-[#00f0ff]/30 transition-all duration-300 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono mb-2">// Standard Workloads</div>
                  <div className="text-4xl font-extrabold text-white font-mono">{report.overview.normal_prompts_success_rate}</div>
                  <p className="text-sm text-zinc-400 mt-2 font-medium">Real-world product descriptions</p>
                </div>
                <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-800/30 text-[#32ff7e] rounded-2xl flex items-center justify-center font-mono font-bold text-2xl">N</div>
              </div>
              <div className="bg-[#08080a]/60 border border-zinc-800/40 rounded-3xl p-8 shadow-xl hover:border-[#00f0ff]/30 transition-all duration-300 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono mb-2">// Stress Tests</div>
                  <div className="text-4xl font-extrabold text-white font-mono">{report.overview.edge_case_success_rate}</div>
                  <p className="text-sm text-zinc-400 mt-2 font-medium">Edge cases and vague prompts</p>
                </div>
                <div className="w-16 h-16 bg-amber-950/40 border border-amber-800/30 text-[#ffb84d] rounded-2xl flex items-center justify-center font-mono font-bold text-2xl">E</div>
              </div>
            </div>

            {/* Failure Breakdown */}
            {report.failure_analysis.total_failures > 0 && (
              <div className="glass bg-[#08080a]/80 border border-zinc-800/40 rounded-3xl p-8 shadow-2xl shadow-cyan-950/10 mb-12">
                <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2 font-mono">
                  <span className="text-[#ff716c]">⚠</span> Failure Analysis
                </h2>
                <div className="flex gap-4 flex-wrap mb-8">
                  {Object.entries(report.failure_analysis.failure_breakdown).map(([type, count]: any) => (
                    <div key={type} className="bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 shadow-inner">
                      <span className="text-[#ff716c] text-sm font-bold font-mono">{count}</span>
                      <span className="text-zinc-500 text-[9px] font-bold font-mono uppercase tracking-widest ml-3">{type}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 bg-[#050507] rounded-2xl p-6 border border-zinc-900">
                  {report.failure_analysis.failed_prompts.map((f: any) => (
                    <div key={f.id} className="flex items-center gap-6 py-2.5 border-b border-zinc-900 last:border-0">
                      <span className="font-mono text-zinc-600 text-xs w-10">{f.id}</span>
                      <span className="text-zinc-300 text-xs font-bold font-mono w-40">{f.category.toUpperCase()}</span>
                      <span className="text-[#ff716c] text-xs font-mono font-medium">{f.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results Table */}
            <div className="bg-[#08080a]/60 border border-zinc-800/40 rounded-3xl shadow-2xl shadow-cyan-950/10 overflow-hidden">
              <div className="px-8 py-6 border-b border-zinc-900/60 flex items-center justify-between bg-zinc-950/40">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest font-mono">// Execution Log</h2>
                <span className="text-xs font-mono text-zinc-500">BUILD_SNAPSHOT_01</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="bg-zinc-950/60">
                      {['ID', 'Category', 'Status', 'Latency', 'Score', 'UI/API'].map(h => (
                        <th key={h} className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono border-b border-zinc-900/60">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/40">
                    {report.detailed_results.map((r: any) => (
                      <tr key={r.id} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-8 py-6 font-mono text-zinc-500 text-xs md:text-sm">{r.id}</td>
                        <td className="px-8 py-6 text-white text-sm md:text-base font-bold font-mono tracking-tight">{r.category.toUpperCase()}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${r.status === 'success' ? 'bg-[#32ff7e]' : 'bg-[#ff716c]'}`} />
                            <span className={`text-[11px] md:text-xs font-bold uppercase tracking-widest font-mono ${r.status === 'success' ? 'text-[#32ff7e]' : 'text-[#ff716c]'}`}>
                              {r.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-zinc-300 text-xs md:text-sm font-mono">{r.latency_seconds}s</td>
                        <td className="px-8 py-6">
                          <span className={`font-bold font-mono text-xs md:text-sm ${
                            r.runtime_score >= 80 ? 'text-[#32ff7e]' : r.runtime_score >= 60 ? 'text-[#ffb84d]' : 'text-[#ff716c]'
                          }`}>
                            {r.runtime_score > 0 ? `${r.runtime_score}/100` : '--'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-zinc-400 text-xs md:text-sm font-mono tracking-tighter">
                          {r.pages_generated || 0}P · {r.endpoints_generated || 0}E
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-12 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest font-mono">
              // Automated audit cycle completed in {report.overview.total_evaluation_time_minutes} minutes
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

