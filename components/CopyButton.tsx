'use client'
import { useState } from 'react'

interface Props {
  text: string
  label?: string
}

export default function CopyButton({ text, label = 'Copy' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-xs px-2 py-1 rounded transition-all ${
        copied
          ? 'bg-green-900 text-green-400'
          : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
      }`}
    >
      {copied ? '✓ Copied' : label}
    </button>
  )
}
