// app/pokemon/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CacheMetrics } from "@/components/cache-metrics";
import { toast } from "sonner";

type PokemonDetail = {
  id: number;
  name: string;
  spriteUrl: string;
  typePrimary: string;
  typeSecondary?: string | null;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

type Move = {
  id: number;
  name: string;
  type: string;
  category: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  description: string;
  level: number | null;
};

type MovesResponse = {
  moves: Move[];
  source: "cache" | "db";
};

type ApiResponse = {
  pokemon: PokemonDetail;
  source: "cache" | "db";
};

// Type color gradients for move cards
const moveTypeColors: Record<string, string> = {
  fire: "from-amber-500/20 to-red-500/20",
  water: "from-sky-500/20 to-cyan-400/20",
  grass: "from-emerald-500/20 to-lime-400/20",
  electric: "from-yellow-400/20 to-amber-300/20",
  psychic: "from-fuchsia-400/20 to-purple-500/20",
  dark: "from-slate-800/20 to-slate-900/20",
  ghost: "from-indigo-500/20 to-violet-500/20",
  ice: "from-cyan-200/20 to-sky-300/20",
  dragon: "from-indigo-600/20 to-emerald-500/20",
  fairy: "from-pink-400/20 to-rose-400/20",
  fighting: "from-orange-600/20 to-red-600/20",
  normal: "from-slate-400/20 to-slate-500/20",
  poison: "from-purple-600/20 to-fuchsia-600/20",
  flying: "from-sky-400/20 to-indigo-400/20",
  rock: "from-amber-700/20 to-stone-700/20",
  steel: "from-slate-500/20 to-zinc-500/20",
  bug: "from-lime-500/20 to-green-500/20",
  ground: "from-amber-600/20 to-yellow-700/20",
  default: "from-slate-800/20 to-slate-900/20",
};

function getMoveTypeGradient(type: string | undefined | null) {
  if (!type) return moveTypeColors.default;
  const key = type.toLowerCase();
  return moveTypeColors[key] ?? moveTypeColors.default;
}

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [data, setData] = useState<ApiResponse | null>(null);
  const [moves, setMoves] = useState<MovesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [movesLoading, setMovesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bustingCache, setBustingCache] = useState(false);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchPokemon() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/pokemon/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Pokémon not found");
          }
          throw new Error("Failed to fetch");
        }

        const result = (await res.json()) as ApiResponse;
        if (!cancelled) {
          setData(result);
          // Show toast notification for cache hit/miss
          if (result.source === "cache") {
            toast.success("⚡ Cache Hit!", {
              description: `${result.pokemon.name} loaded from Redis cache`,
              duration: 2000,
            });
          } else {
            toast.info("🐢 Cache Miss", {
              description: `${result.pokemon.name} fetched from database and cached`,
              duration: 2000,
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPokemon();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchMoves() {
      setMovesLoading(true);
      try {
        const res = await fetch(`/api/pokemon/${id}/moves`);
        if (res.ok) {
          const result = (await res.json()) as MovesResponse;
          if (!cancelled) {
            setMoves(result);
            // Show toast for moves cache status
            if (result.source === "cache") {
              toast.success("⚡ Moves Cached", {
                description: "Moves loaded from Redis cache",
                duration: 1500,
              });
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch moves:", err);
      } finally {
        if (!cancelled) {
          setMovesLoading(false);
        }
      }
    }

    fetchMoves();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleBustCache() {
    setBustingCache(true);
    try {
      await fetch(`/api/pokemon/${id}`, { method: "POST" });
      toast.success("Cache Cleared", {
        description: "Cache entry removed. Next request will hit database.",
        duration: 2000,
      });
      // Refetch data
      const res = await fetch(`/api/pokemon/${id}`);
      if (res.ok) {
        const result = (await res.json()) as ApiResponse;
        setData(result);
        toast.info("Refreshed from Database", {
          description: "Data fetched fresh and cached for next time",
          duration: 2000,
        });
      }
    } catch (err) {
      console.error("Failed to bust cache:", err);
      toast.error("Error", {
        description: "Failed to clear cache",
        duration: 2000,
      });
    } finally {
      setBustingCache(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/30 border-t-fuchsia-400"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-slate-100"
        >
          <span>←</span> Back to Arena
        </Link>
        <div className="rounded-xl border border-slate-500/40 bg-slate-950/60 p-8 text-center">
          <p className="text-slate-400">{error || "Unknown error"}</p>
        </div>
      </div>
    );
  }

  const { pokemon, source } = data;
  const maxStat = Math.max(
    pokemon.hp,
    pokemon.attack,
    pokemon.defense,
    pokemon.specialAttack,
    pokemon.specialDefense,
    pokemon.speed
  );

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-slate-100"
      >
        <span>←</span> Back to Arena
      </Link>

      {/* Cache Metrics */}
      <CacheMetrics />

      <div className="rounded-2xl border border-indigo-500/40 bg-slate-950/60 p-6 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Sprite - Improved sizing and layout */}
          <div className="flex-shrink-0">
            <div className="relative mx-auto w-full max-w-xs lg:w-80">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/20 to-amber-300/20 blur-2xl"></div>
              {/* Image container */}
              <div className="relative flex aspect-square items-center justify-center rounded-2xl border border-indigo-500/30 bg-slate-900/40 p-8 backdrop-blur-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    pokemon.spriteUrl
                      ? pokemon.spriteUrl.startsWith("http") ||
                        pokemon.spriteUrl.startsWith("//")
                        ? pokemon.spriteUrl
                        : pokemon.spriteUrl.startsWith("/")
                        ? pokemon.spriteUrl
                        : `/${pokemon.spriteUrl}`
                      : "/placeholder.svg"
                  }
                  alt={pokemon.name}
                  className="h-full w-full object-contain drop-shadow-[0_0_30px_rgba(248,250,252,0.9)]"
                  crossOrigin={
                    pokemon.spriteUrl?.startsWith("http")
                      ? "anonymous"
                      : undefined
                  }
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-50">
                  {pokemon.name}
                </h1>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    source === "cache"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {source === "cache" ? "⚡ From Cache" : "🐢 From Database"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-wide text-slate-100 ring-1 ring-slate-500/50">
                  {pokemon.typePrimary}
                </span>
                {pokemon.typeSecondary && (
                  <span className="rounded-full bg-slate-900/70 px-3 py-1 text-xs uppercase tracking-wide text-slate-100 ring-1 ring-slate-500/50">
                    {pokemon.typeSecondary}
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-300">
                Base Stats
              </h2>
              <div className="space-y-2">
                {[
                  { label: "HP", value: pokemon.hp },
                  { label: "Attack", value: pokemon.attack },
                  { label: "Defense", value: pokemon.defense },
                  { label: "Sp. Atk", value: pokemon.specialAttack },
                  { label: "Sp. Def", value: pokemon.specialDefense },
                  { label: "Speed", value: pokemon.speed },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{stat.label}</span>
                      <span className="font-semibold text-slate-200">
                        {stat.value}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800/60">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all"
                        style={{
                          width: `${(stat.value / maxStat) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bust Cache Button */}
            <button
              onClick={handleBustCache}
              disabled={bustingCache}
              className="rounded-lg border border-fuchsia-500/40 bg-fuchsia-500/10 px-4 py-2 text-sm font-medium text-fuchsia-300 transition hover:bg-fuchsia-500/20 disabled:opacity-50"
            >
              {bustingCache ? "Refreshing..." : "Refresh from Database"}
            </button>
          </div>
        </div>
      </div>

      {/* Moves Section */}
      {moves && (
        <div className="rounded-2xl border border-indigo-500/40 bg-slate-950/60 p-6 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-50">Moves</h2>
            {moves.source && (
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                  moves.source === "cache"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {moves.source === "cache" ? "⚡ Cached" : "🐢 DB"}
              </span>
            )}
          </div>
          {movesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/30 border-t-fuchsia-400"></div>
            </div>
          ) : moves.moves.length === 0 ? (
            <p className="text-sm text-slate-400">No moves available</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {moves.moves.map((move) => {
                const gradient = getMoveTypeGradient(move.type);
                return (
                  <div
                    key={move.id}
                    className={`relative overflow-hidden rounded-lg border border-slate-700/50 bg-gradient-to-br ${gradient} p-3 backdrop-blur-sm`}
                  >
                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-30`}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-100">
                            {move.name}
                          </h3>
                          {move.level && (
                            <span className="text-[10px] text-slate-400">
                              Lv. {move.level}
                            </span>
                          )}
                        </div>
                        <span className="rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] uppercase text-slate-200 ring-1 ring-slate-600/50">
                          {move.type}
                        </span>
                      </div>
                      <div className="mb-2 flex gap-2 text-[10px] text-slate-300">
                        <span className="rounded bg-slate-900/60 px-1.5 py-0.5 backdrop-blur-sm">
                          {move.category}
                        </span>
                        {move.power !== null && (
                          <span className="rounded bg-slate-900/60 px-1.5 py-0.5 backdrop-blur-sm">
                            Power: {move.power}
                          </span>
                        )}
                        {move.accuracy !== null && (
                          <span className="rounded bg-slate-900/60 px-1.5 py-0.5 backdrop-blur-sm">
                            Acc: {move.accuracy}%
                          </span>
                        )}
                        <span className="rounded bg-slate-900/60 px-1.5 py-0.5 backdrop-blur-sm">
                          PP: {move.pp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {move.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
