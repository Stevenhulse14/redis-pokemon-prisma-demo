// app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { PokemonCard } from "@/components/pokemon-card"
import { CacheMetrics } from "@/components/cache-metrics"
import { toast } from "sonner"

type Pokemon = {
  id: number
  name: string
  spriteUrl: string
  typePrimary: string
  typeSecondary?: string | null
}

export default function HomePage() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupMessage, setSetupMessage] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    let cancelled = false

    async function fetchPokemon() {
      console.log("[v0] Fetching pokemon with query:", debouncedQuery)
      setLoading(true)
      setError(null)
      try {
        const url = debouncedQuery ? `/api/pokemon?query=${encodeURIComponent(debouncedQuery)}` : "/api/pokemon"

        const res = await fetch(url)
        console.log("[v0] Response status:", res.status)

        const contentType = res.headers.get("content-type")
        let data

        if (contentType && contentType.includes("application/json")) {
          data = await res.json()
        } else {
          const text = await res.text()
          data = { error: text, pokemon: [] }
        }

        console.log("[v0] Received data:", data)

        if (!res.ok) {
          console.error("[v0] Error response:", data)
          throw new Error(data.message || data.error || "Failed to fetch pokemon")
        }

        if (!cancelled) {
          setPokemon(data.pokemon || []);
          // Show toast notification for cache status
          if (data.source === "cache") {
            toast.success("⚡ Cache Hit!", {
              description: `Pokemon list loaded from Redis cache${debouncedQuery ? ` (search: "${debouncedQuery}")` : ""}`,
              duration: 2000,
            });
          } else if (data.source === "db") {
            toast.info("🐢 Cache Miss", {
              description: `Pokemon list fetched from database${debouncedQuery ? ` (search: "${debouncedQuery}")` : ""} and cached`,
              duration: 2000,
            });
          }
        }
      } catch (error) {
        console.error("[v0] Failed to fetch pokemon:", error)
        if (!cancelled) {
          setPokemon([])
          setError(error instanceof Error ? error.message : "Failed to fetch pokemon")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPokemon()

    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  async function runSetup() {
    setSetupLoading(true)
    setSetupMessage(null)
    console.log("[v0] Running database setup...")

    try {
      const res = await fetch("/api/setup", { method: "POST" })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.details || data.error || "Setup failed")
      }

      console.log("[v0] Setup successful:", data)
      setSetupMessage(data.message)

      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      console.error("[v0] Setup failed:", err)
      setSetupMessage(err instanceof Error ? err.message : "Setup failed")
    } finally {
      setSetupLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <CacheMetrics />

      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-50">Explore the Arena</h1>
          <p className="text-pretty text-sm text-slate-300/90">
            Search for Pokémon by name or type. Watch the cache metrics update as you explore.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by name or type..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-indigo-500/40 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-fuchsia-400/70 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500/30 border-t-fuchsia-400"></div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-950/60 p-8">
          <h3 className="mb-2 font-semibold text-red-300">Database Setup Required</h3>
          <p className="mb-4 text-sm text-red-200/90">{error}</p>

          <button
            onClick={runSetup}
            disabled={setupLoading}
            className="mb-4 rounded-lg bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-300 px-6 py-3 font-semibold text-slate-950 shadow-[0_0_25px_rgba(129,140,248,0.6)] transition-all hover:shadow-[0_0_35px_rgba(244,114,182,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {setupLoading ? "Setting up database..." : "Setup Database Now"}
          </button>

          {setupMessage && (
            <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-950/60 p-3 text-sm text-emerald-200">
              {setupMessage}
            </div>
          )}

          <div className="space-y-2 text-xs text-red-200/70">
            <p className="font-medium">Or manually run these SQL scripts:</p>
            <ol className="ml-4 list-decimal space-y-1">
              <li>scripts/001-create-pokemon-table.sql</li>
              <li>scripts/002-seed-pokemon.sql</li>
            </ol>
          </div>
        </div>
      ) : pokemon.length === 0 ? (
        <div className="rounded-xl border border-slate-500/40 bg-slate-950/60 p-8 text-center">
          <p className="mb-4 text-slate-400">
            {query ? "No Pokémon found matching your search" : "No Pokémon in database yet"}
          </p>
          {!query && (
            <>
              <button
                onClick={runSetup}
                disabled={setupLoading}
                className="mb-4 rounded-lg bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-300 px-6 py-3 font-semibold text-slate-950 shadow-[0_0_25px_rgba(129,140,248,0.6)] transition-all hover:shadow-[0_0_35px_rgba(244,114,182,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {setupLoading ? "Setting up database..." : "Setup Database Now"}
              </button>

              {setupMessage && (
                <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-950/60 p-3 text-sm text-emerald-200">
                  {setupMessage}
                </div>
              )}

              <p className="text-xs text-slate-500">Or run the SQL scripts in the scripts folder</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {pokemon.map((p) => (
            <PokemonCard
              key={p.id}
              id={p.id}
              name={p.name}
              spriteUrl={p.spriteUrl}
              typePrimary={p.typePrimary}
              typeSecondary={p.typeSecondary}
            />
          ))}
        </div>
      )}
    </div>
  )
}
