// components/pokemon-card.tsx
"use client"

import Link from "next/link"

type PokemonCardProps = {
  id: number
  name: string
  spriteUrl: string
  typePrimary: string
  typeSecondary?: string | null
}

const typeColors: Record<string, string> = {
  fire: "from-amber-500/80 to-red-500/80",
  water: "from-sky-500/80 to-cyan-400/80",
  grass: "from-emerald-500/80 to-lime-400/80",
  electric: "from-yellow-400/80 to-amber-300/80",
  psychic: "from-fuchsia-400/80 to-purple-500/80",
  dark: "from-slate-800/80 to-slate-900/80",
  ghost: "from-indigo-500/80 to-violet-500/80",
  ice: "from-cyan-200/80 to-sky-300/80",
  dragon: "from-indigo-600/80 to-emerald-500/80",
  fairy: "from-pink-400/80 to-rose-400/80",
  fighting: "from-orange-600/80 to-red-600/80",
  normal: "from-slate-400/80 to-slate-500/80",
  poison: "from-purple-600/80 to-fuchsia-600/80",
  flying: "from-sky-400/80 to-indigo-400/80",
  rock: "from-amber-700/80 to-stone-700/80",
  steel: "from-slate-500/80 to-zinc-500/80",
  // fallback
  default: "from-slate-800/80 to-slate-900/80",
}

function getTypeGradient(type: string | undefined | null) {
  if (!type) return typeColors.default
  const key = type.toLowerCase()
  return typeColors[key] ?? typeColors.default
}

export function PokemonCard({ id, name, spriteUrl, typePrimary, typeSecondary }: PokemonCardProps) {
  const gradient = getTypeGradient(typePrimary)
  
  // Handle both local paths and external URLs
  const imageSrc = spriteUrl 
    ? (spriteUrl.startsWith('http') || spriteUrl.startsWith('//') 
        ? spriteUrl 
        : spriteUrl.startsWith('/') 
          ? spriteUrl 
          : `/${spriteUrl}`)
    : "/placeholder.svg"

  return (
    <Link href={`/pokemon/${id}`}>
      <article className="group relative aspect-square overflow-hidden rounded-2xl border border-indigo-500/40 bg-slate-950/60 shadow-[0_0_30px_rgba(56,189,248,0.2)] transition duration-200 hover:-translate-y-1 hover:border-fuchsia-400/70 hover:shadow-[0_0_45px_rgba(244,114,182,0.5)]">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${gradient} opacity-40 blur-2xl`}
        />
        {/* Pokemon image fills the card */}
        <div className="relative h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={name}
            className="h-full w-full object-cover object-center drop-shadow-[0_0_20px_rgba(248,250,252,0.6)] transition-transform group-hover:scale-110"
            crossOrigin={spriteUrl?.startsWith('http') ? 'anonymous' : undefined}
          />
          {/* Overlay gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          
          {/* Pokemon name and types overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h2 className="mb-1.5 text-sm font-semibold tracking-wide text-slate-50 drop-shadow-lg">{name}</h2>
            <div className="flex flex-wrap justify-center gap-1 text-[10px]">
              <TypeBadge type={typePrimary} />
              {typeSecondary && <TypeBadge type={typeSecondary} />}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className="rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-100 ring-1 ring-slate-500/50">
      {type}
    </span>
  )
}
