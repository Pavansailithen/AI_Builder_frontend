'use client'

interface Props {
  jobId: string
  error: string
  onRetry: () => void
}

export default function ErrorPanel({ jobId, error, onRetry }: Props) {
  return (
    <div className="bg-red-950 border border-red-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-red-400 font-semibold text-sm">Pipeline Failed</h3>
          <p className="text-zinc-500 text-xs mt-1">Job: {jobId}</p>
        </div>
        <span className="text-red-500 text-lg">✗</span>
      </div>

      {/* Error message */}
      <div className="bg-red-900/30 rounded-lg p-3 mb-4">
        <p className="text-red-300 text-xs font-mono leading-relaxed break-all">
          {error}
        </p>
      </div>

      {/* Common causes */}
      <div className="mb-4">
        <p className="text-zinc-500 text-xs mb-2">Common causes:</p>
        <ul className="space-y-1 text-zinc-600 text-xs">
          <li>• Groq API rate limit reached (resets every 24h)</li>
          <li>• Prompt too vague or very short</li>
          <li>• Network timeout during pipeline</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 bg-white text-black text-sm font-medium py-2 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="flex-1 bg-zinc-800 text-zinc-300 text-sm font-medium py-2 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          New Prompt
        </button>
      </div>
    </div>
  )
}
