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
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-b-2 border-violet-600 rounded-full animate-spin" />
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Accessing Data...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA] bg-mesh-light text-zinc-900 font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between glass border-b border-zinc-200/50">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center text-white hover:bg-zinc-800 transition-colors">
            <span className="text-sm">←</span>
          </button>
          <div>
            <div className="font-bold text-zinc-900 text-sm tracking-tight">Performance Metrics</div>
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">App Compiler v1.0.0</div>
          </div>
        </div>
        <div className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-widest hidden md:block">
          Build Snapshot: {report ? new Date(report.generated_at).toLocaleDateString() : '--'}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">

        {error ? (
          <div className="glass rounded-[2.5rem] p-20 text-center shadow-xl shadow-zinc-200/20">
            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">📊</div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">No evaluation data found</h2>
            <p className="text-sm text-zinc-400 mb-10 max-w-xs mx-auto">{error}</p>
            <div className="bg-zinc-50 rounded-2xl p-6 max-w-md mx-auto border border-zinc-100">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Run Evaluation from CLI</p>
              <code className="text-[11px] text-violet-600 font-mono break-all leading-relaxed">
                python -c "import asyncio; from app.evaluation.runner import run_evaluation; asyncio.run(run_evaluation(['N01']))"
              </code>
            </div>
          </div>
        ) : report && (
          <div className="animate-fade-in">
            {/* Overview Bento */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { label: 'Success Rate', value: report.overview.overall_success_rate, color: 'text-green-600', bg: 'bg-green-50/30' },
                { label: 'Avg Latency', value: `${report.overview.avg_latency_seconds}s`, color: 'text-blue-600', bg: 'bg-blue-50/30' },
                { label: 'Avg Score', value: `${report.overview.avg_runtime_score}/100`, color: 'text-violet-600', bg: 'bg-violet-50/30' },
                { label: 'Total Tested', value: report.overview.total_prompts_tested, color: 'text-zinc-900', bg: 'bg-white' },
              ].map(card => (
                <div key={card.label} className={`${card.bg} border border-zinc-100 rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-all duration-500`}>
                  <div className={`text-3xl font-bold tracking-tighter ${card.color}`}>{card.value}</div>
                  <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-2">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Sub-metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Standard Workloads</div>
                  <div className="text-2xl font-bold text-zinc-900">{report.overview.normal_prompts_success_rate}</div>
                  <p className="text-xs text-zinc-400 mt-2 font-medium">Real-world product descriptions</p>
                </div>
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center font-bold text-xl">N</div>
              </div>
              <div className="bg-white border border-zinc-100 rounded-[2rem] p-8 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Stress Tests</div>
                  <div className="text-2xl font-bold text-zinc-900">{report.overview.edge_case_success_rate}</div>
                  <p className="text-xs text-zinc-400 mt-2 font-medium">Edge cases and vague prompts</p>
                </div>
                <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center font-bold text-xl">E</div>
              </div>
            </div>

            {/* Failure Breakdown */}
            {report.failure_analysis.total_failures > 0 && (
              <div className="glass rounded-[2rem] p-8 shadow-xl shadow-zinc-200/20 mb-12">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="text-red-500">⚠</span> Failure Analysis
                </h2>
                <div className="flex gap-4 flex-wrap mb-8">
                  {Object.entries(report.failure_analysis.failure_breakdown).map(([type, count]: any) => (
                    <div key={type} className="bg-white border border-zinc-100 rounded-xl px-4 py-3 shadow-sm">
                      <span className="text-red-600 text-sm font-bold">{count}</span>
                      <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest ml-3">{type}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 bg-gray-50/50 rounded-2xl p-6 border border-zinc-50">
                  {report.failure_analysis.failed_prompts.map((f: any) => (
                    <div key={f.id} className="flex items-center gap-6 py-2 border-b border-zinc-100/50 last:border-0">
                      <span className="font-mono text-zinc-300 text-xs w-10">{f.id}</span>
                      <span className="text-zinc-600 text-xs font-bold w-40">{f.category.toUpperCase()}</span>
                      <span className="text-red-400 text-xs font-medium">{f.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results Table */}
            <div className="bg-white border border-zinc-100 rounded-[2.5rem] shadow-xl shadow-zinc-200/20 overflow-hidden">
              <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Execution Log</h2>
                <span className="text-[10px] font-mono text-zinc-400">BUILD_SNAPSHOT_01</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/50">
                      {['ID', 'Category', 'Difficulty', 'Status', 'Latency', 'Score', 'UI/API'].map(h => (
                        <th key={h} className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {report.detailed_results.map((r: any) => (
                      <tr key={r.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-8 py-5 font-mono text-zinc-300 text-xs">{r.id}</td>
                        <td className="px-8 py-5 text-zinc-900 text-xs font-bold tracking-tight">{r.category.toUpperCase()}</td>
                        <td className="px-8 py-5">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tight ${
                            r.difficulty === 'normal' ? 'bg-zinc-100 text-zinc-500' : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                          }`}>{r.difficulty}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${r.status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                              {r.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-zinc-400 text-xs font-medium">{r.latency_seconds}s</td>
                        <td className="px-8 py-5">
                          <span className={`font-bold text-xs ${r.runtime_score >= 80 ? 'text-green-600' : r.runtime_score >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                            {r.runtime_score > 0 ? `${r.runtime_score}/100` : '--'}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-zinc-300 text-[10px] font-bold uppercase tracking-tighter">
                          {r.pages_generated || 0}P · {r.endpoints_generated || 0}E
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-12 text-center text-zinc-300 text-[10px] font-bold uppercase tracking-widest">
              Automated audit cycle completed in {report.overview.total_evaluation_time_minutes} minutes
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
