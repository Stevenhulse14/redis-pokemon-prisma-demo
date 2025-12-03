import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PokeCache Arena",
  description: "Redis-powered Pokémon caching demo with Prisma and Supabase",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-900 to-slate-950 font-sans text-slate-100 antialiased">
        <div className="relative flex min-h-screen flex-col">
          {/* Subtle glowing background orbs */}
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          </div>

          <header className="border-b border-indigo-500/40 bg-slate-950/60 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-amber-300 shadow-[0_0_25px_rgba(129,140,248,0.8)]">
                  <span className="text-lg font-bold text-slate-950">Ψ</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold tracking-wide">PokeCache Arena</h1>
                  <p className="text-xs text-slate-300/70">Mystical Pokémon stats, powered by Redis caching</p>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6">{children}</main>
        </div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
