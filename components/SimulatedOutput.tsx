'use client'
import { useState } from 'react'

interface Props {
  schema: any
}

export default function SimulatedOutput({ schema }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (!schema) return null

  // Derive file structure from schema
  const pages = schema.ui?.pages || []
  const endpoints = schema.api?.endpoints || []
  const tables = schema.database?.tables || []
  const roles = schema.auth?.roles || []
  const rules = schema.business_logic?.rules || []

  // Group endpoints by resource
  const apiGroups = [...new Set(
    endpoints.map((e: any) => {
      const parts = e.path.split('/').filter(Boolean)
      return parts[2] || parts[1] || 'general'
    })
  )] as string[]

  return (
    <div className="mt-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between bg-[#0c0c0f]/60 border border-zinc-800/40 hover:border-[#00f0ff]/30 rounded-xl px-6 py-4 transition-all hover:bg-[#0e0e12]/80 shadow-md"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🚀</span>
          <div className="text-left font-mono">
            <div className="text-sm font-medium text-white">Simulated App Output</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">// Preview compiler asset generation</div>
          </div>
        </div>
        <span className="text-zinc-500 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="border border-t-0 border-zinc-800/40 rounded-b-xl p-6 bg-[#08080a]/90">

          {/* App Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {[
              { label: 'Pages', value: pages.length, icon: '📄' },
              { label: 'Endpoints', value: endpoints.length, icon: '🔌' },
              { label: 'DB Tables', value: tables.length, icon: '🗄️' },
              { label: 'Roles', value: roles.length, icon: '👥' },
              { label: 'Rules', value: rules.length, icon: '⚙️' },
            ].map(stat => (
              <div key={stat.label} className="bg-[#0c0c0f]/80 border border-zinc-900 rounded-xl p-4 text-center">
                <div className="text-lg mb-1">{stat.icon}</div>
                <div className="text-xl font-bold font-mono text-white">{stat.value}</div>
                <div className="text-[9px] font-bold font-mono text-zinc-500 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* File Structure */}
          <div className="mb-8">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 font-mono">
              // Generated File Structure
            </h3>
            <div className="bg-[#050507] border border-zinc-900 rounded-xl p-5 font-mono text-xs shadow-inner">
              <div className="text-zinc-300">src/</div>

              <div className="ml-4 text-zinc-500 mt-1">pages/</div>
              {pages.map((page: any) => (
                <div key={page.name} className="ml-8 text-[#32ff7e] py-0.5">
                  {page.name}.tsx
                  <span className="text-zinc-600 ml-3">
                    — {page.components?.length || 0} component(s) · [{page.access?.join(', ')}]
                  </span>
                </div>
              ))}

              <div className="ml-4 text-zinc-500 mt-3">api/</div>
              {apiGroups.map((group: string) => {
                const groupEndpoints = endpoints.filter((e: any) =>
                  e.path.includes(`/${group}`)
                )
                return (
                  <div key={group} className="ml-8 text-[#00f0ff] py-0.5">
                    {group}.ts
                    <span className="text-zinc-600 ml-3">
                      — {groupEndpoints.length} endpoint(s)
                    </span>
                  </div>
                )
              })}

              <div className="ml-4 text-zinc-500 mt-3">db/</div>
              {tables.map((table: any) => (
                <div key={table.name} className="ml-8 text-[#d1bcff] py-0.5">
                  {table.name}.sql
                  <span className="text-zinc-600 ml-3">
                    — {table.columns?.length || 0} columns
                    {table.relations?.length > 0 && `, ${table.relations.length} relation(s)`}
                  </span>
                </div>
              ))}

              <div className="ml-4 text-zinc-500 mt-3">auth/</div>
              <div className="ml-8 text-[#ffb84d] py-0.5">
                roles.ts
                <span className="text-zinc-600 ml-3">
                  — {roles.join(', ')}
                </span>
              </div>
              <div className="ml-8 text-[#ffb84d] py-0.5">
                permissions.ts
                <span className="text-zinc-600 ml-3">
                  — {Object.keys(schema.auth?.permissions || {}).length} role(s) configured
                </span>
              </div>
            </div>
          </div>

          {/* DB Schema Preview */}
          <div className="mb-8">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 font-mono">
              // Database Tables Preview
            </h3>
            <div className="space-y-3">
              {tables.map((table: any) => (
                <div key={table.name} className="bg-[#0c0c0f]/60 border border-zinc-900 rounded-xl px-5 py-4">
                  <div className="flex items-center justify-between mb-3 border-b border-zinc-900/60 pb-2">
                    <span className="text-[#d1bcff] font-mono text-sm font-medium">
                      {table.name}
                    </span>
                    <span className="text-zinc-500 font-mono text-xs">
                      {table.columns?.length} cols · {table.relations?.length || 0} relations
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {table.columns?.map((col: any) => (
                      <span key={col.name} className={`text-xs px-2.5 py-1 rounded font-mono border ${
                        col.primary_key
                          ? 'bg-amber-950/40 text-[#ffb84d] border-amber-800/30'
                          : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/60'
                      }`}>
                        {col.name}: {col.type}
                        {col.primary_key && ' 🔑'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Rules */}
          {rules.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 font-mono">
                // Business Rules
              </h3>
              <div className="space-y-3">
                {rules.map((rule: any) => (
                  <div key={rule.name} className="bg-[#0c0c0f]/60 border border-zinc-900 rounded-xl px-5 py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-white text-xs font-bold font-mono">{rule.name}</span>
                        <p className="text-zinc-400 text-xs mt-1">{rule.description}</p>
                      </div>
                      <span className="text-zinc-500 font-mono text-xs ml-4 flex-shrink-0">
                        if {rule.condition}
                      </span>
                    </div>
                    {rule.affected_routes?.length > 0 && (
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {rule.affected_routes.map((r: string) => (
                          <span key={r} className="text-xs bg-zinc-900 text-zinc-500 px-2.5 py-0.5 rounded-lg border border-zinc-800/60 font-mono">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Execution Note */}
          <div className="mt-6 bg-emerald-950/20 border border-emerald-900/40 rounded-xl px-5 py-4">
            <p className="text-zinc-400 text-xs font-mono">
              ✓ This schema is <span className="text-[#32ff7e] font-semibold">execution-ready</span> —
              all layers are consistent and can be used to generate a working {schema.app_name} application.
              The file structure above represents what a code generator would produce from this schema.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
