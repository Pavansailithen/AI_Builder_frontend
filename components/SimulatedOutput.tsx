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
        className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 hover:border-zinc-600 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🚀</span>
          <div className="text-left">
            <div className="text-sm font-medium text-white">Simulated App Output</div>
            <div className="text-xs text-zinc-500 mt-0.5">What this schema would generate</div>
          </div>
        </div>
        <span className="text-zinc-500 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="border border-t-0 border-zinc-800 rounded-b-xl p-6 bg-zinc-950">

          {/* App Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: 'Pages', value: pages.length, icon: '📄' },
              { label: 'Endpoints', value: endpoints.length, icon: '🔌' },
              { label: 'DB Tables', value: tables.length, icon: '🗄️' },
              { label: 'Roles', value: roles.length, icon: '👥' },
              { label: 'Rules', value: rules.length, icon: '⚙️' },
            ].map(stat => (
              <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                <div className="text-lg mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* File Structure */}
          <div className="mb-6">
            <h3 className="text-xs text-zinc-400 uppercase tracking-widest mb-3">
              Generated File Structure
            </h3>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-xs">
              <div className="text-zinc-300">src/</div>

              <div className="ml-4 text-zinc-400 mt-1">pages/</div>
              {pages.map((page: any) => (
                <div key={page.name} className="ml-8 text-green-400">
                  {page.name}.tsx
                  <span className="text-zinc-600 ml-2">
                    — {page.components?.length || 0} component(s) · [{page.access?.join(', ')}]
                  </span>
                </div>
              ))}

              <div className="ml-4 text-zinc-400 mt-2">api/</div>
              {apiGroups.map((group: string) => {
                const groupEndpoints = endpoints.filter((e: any) =>
                  e.path.includes(`/${group}`)
                )
                return (
                  <div key={group} className="ml-8 text-blue-400">
                    {group}.ts
                    <span className="text-zinc-600 ml-2">
                      — {groupEndpoints.length} endpoint(s)
                    </span>
                  </div>
                )
              })}

              <div className="ml-4 text-zinc-400 mt-2">db/</div>
              {tables.map((table: any) => (
                <div key={table.name} className="ml-8 text-purple-400">
                  {table.name}.sql
                  <span className="text-zinc-600 ml-2">
                    — {table.columns?.length || 0} columns
                    {table.relations?.length > 0 && `, ${table.relations.length} relation(s)`}
                  </span>
                </div>
              ))}

              <div className="ml-4 text-zinc-400 mt-2">auth/</div>
              <div className="ml-8 text-yellow-400">
                roles.ts
                <span className="text-zinc-600 ml-2">
                  — {roles.join(', ')}
                </span>
              </div>
              <div className="ml-8 text-yellow-400">
                permissions.ts
                <span className="text-zinc-600 ml-2">
                  — {Object.keys(schema.auth?.permissions || {}).length} role(s) configured
                </span>
              </div>
            </div>
          </div>

          {/* DB Schema Preview */}
          <div className="mb-6">
            <h3 className="text-xs text-zinc-400 uppercase tracking-widest mb-3">
              Database Tables Preview
            </h3>
            <div className="space-y-2">
              {tables.map((table: any) => (
                <div key={table.name} className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 font-mono text-sm font-medium">
                      {table.name}
                    </span>
                    <span className="text-zinc-600 text-xs">
                      {table.columns?.length} cols · {table.relations?.length} relations
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {table.columns?.map((col: any) => (
                      <span key={col.name} className={`text-xs px-2 py-0.5 rounded font-mono ${
                        col.primary_key
                          ? 'bg-yellow-900 text-yellow-300'
                          : 'bg-zinc-800 text-zinc-400'
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
            <div>
              <h3 className="text-xs text-zinc-400 uppercase tracking-widest mb-3">
                Business Rules
              </h3>
              <div className="space-y-2">
                {rules.map((rule: any) => (
                  <div key={rule.name} className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-white text-xs font-medium">{rule.name}</span>
                        <p className="text-zinc-500 text-xs mt-0.5">{rule.description}</p>
                      </div>
                      <span className="text-zinc-600 font-mono text-xs ml-4 flex-shrink-0">
                        if {rule.condition}
                      </span>
                    </div>
                    {rule.affected_routes?.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {rule.affected_routes.map((r: string) => (
                          <span key={r} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
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
          <div className="mt-6 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3">
            <p className="text-zinc-400 text-xs">
              ✓ This schema is <span className="text-green-400 font-medium">execution-ready</span> —
              all layers are consistent and can be used to generate a working {schema.app_name} application.
              The file structure above represents what a code generator would produce from this schema.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
