'use client'

const STAGES = [
  { key: 'intent_extraction', label: 'Intent Extraction', desc: 'Parsing your app description' },
  { key: 'system_design', label: 'System Design', desc: 'Designing architecture & entities' },
  { key: 'schema_generation', label: 'Schema Generation', desc: 'Generating UI, API, DB & Auth schemas' },
  { key: 'refinement', label: 'Refinement', desc: 'Checking cross-layer consistency' },
  { key: 'validation', label: 'Validation', desc: 'Validating final output' },
]

interface Props {
  currentStage: string | null
  progress: number
  status: string
}

export default function PipelineStatus({ currentStage, progress, status }: Props) {
  const stageIndex = STAGES.findIndex(s => s.key === currentStage)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-500">Progress</span>
        <span className="text-xs text-zinc-400 font-mono">{progress}%</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-1 mb-6">
        <div
          className="bg-white h-1 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stages */}
      <div className="space-y-3">
        {STAGES.map((stage, i) => {
          const completed = status === 'completed' || stageIndex > i
          const active = stageIndex === i && status === 'processing'
          const pending = stageIndex < i && status !== 'completed'

          return (
            <div key={stage.key} className="flex items-start gap-3">
              {/* Icon */}
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mt-0.5 flex-shrink-0 ${
                completed ? 'bg-green-500 text-white' :
                active ? 'bg-yellow-500 text-black' :
                'bg-zinc-800 text-zinc-600'
              }`}>
                {completed ? '✓' : active ? '⟳' : (i + 1)}
              </div>

              {/* Label */}
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  completed ? 'text-green-400' :
                  active ? 'text-yellow-300' :
                  'text-zinc-600'
                }`}>
                  {stage.label}
                  {active && (
                    <span className="ml-2 inline-flex gap-0.5">
                      <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}/>
                      <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}/>
                      <span className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}/>
                    </span>
                  )}
                </div>
                <div className={`text-xs mt-0.5 ${
                  active ? 'text-zinc-400' : 'text-zinc-700'
                }`}>
                  {stage.desc}
                </div>
              </div>

              {/* Time indicator */}
              {completed && (
                <span className="text-xs text-zinc-600 mt-0.5">done</span>
              )}
            </div>
          )
        })}
      </div>

      {/* ETA */}
      {status === 'processing' && (
        <div className="mt-4 pt-4 border-t border-zinc-800 text-xs text-zinc-600 text-center">
          Each stage takes ~20s · Total ~2 min
        </div>
      )}
    </div>
  )
}
