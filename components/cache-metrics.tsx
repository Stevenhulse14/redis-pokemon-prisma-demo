// components/cache-metrics.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

type Metrics = {
  hits: number;
  misses: number;
  hitRate: number;
  redisEnabled: boolean;
  error?: string;
};

export function CacheMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchMetrics() {
      try {
        const res = await fetch("/api/metrics");
        if (!res.ok) return;
        const data = (await res.json()) as Metrics;
        if (!cancelled) {
          setMetrics(data);
          setLoading(false);
        }
      } catch (_) {
        // ignore
      }
    }

    fetchMetrics();
    const id = setInterval(fetchMetrics, 2000); // Update every 2 seconds for real-time feel

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  async function handleClearCache() {
    setClearing(true);
    try {
      const res = await fetch("/api/cache/clear", { method: "POST" });
      if (res.ok) {
        toast.success("Cache Cleared!", {
          description: "All cached data and metrics have been cleared",
          duration: 3000,
        });
        // Refresh metrics after clearing
        const metricsRes = await fetch("/api/metrics");
        if (metricsRes.ok) {
          const data = (await metricsRes.json()) as Metrics;
          setMetrics(data);
        }
      } else {
        toast.error("Failed to Clear Cache", {
          description: "Could not clear the cache",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Failed to clear cache:", error);
      toast.error("Error", {
        description: "Failed to clear cache",
        duration: 2000,
      });
    } finally {
      setClearing(false);
    }
  }

  async function handleCheckCache() {
    try {
      const res = await fetch("/api/cache/check");
      const data = await res.json();
      console.log("📦 Current Cache Contents:", data);
      console.table(data.cache || {});
      
      const keysFound = data.keysFound || 0;
      toast.info("Cache Check", {
        description: `Found ${keysFound} cached item${keysFound !== 1 ? 's' : ''}. Check console for details.`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to check cache:", error);
      toast.error("Error", {
        description: "Failed to check cache",
        duration: 2000,
      });
    }
  }

  if (loading || !metrics) {
    return (
      <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-500/40 bg-slate-950/70 px-4 py-2 text-xs text-slate-400">
        <span className="font-semibold">Cache Metrics</span>
        <span className="text-[10px]">Loading...</span>
      </div>
    );
  }

  const { hits, misses, hitRate, redisEnabled, error } = metrics;
  const total = hits + misses;
  const hitRatePercent = (hitRate * 100).toFixed(1);

  // Color coding for hit rate
  const hitRateColor =
    hitRate >= 0.7
      ? "text-emerald-300"
      : hitRate >= 0.4
      ? "text-yellow-300"
      : "text-orange-300";
  const borderColor = redisEnabled
    ? "border-emerald-400/40 shadow-[0_0_22px_rgba(16,185,129,0.3)]"
    : "border-slate-500/40";

  return (
    <div
      className={`mb-4 flex flex-col gap-2 rounded-xl border ${borderColor} bg-slate-950/70 px-4 py-3 text-xs text-slate-200`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-emerald-300">Cache Metrics</span>
          <div className="flex items-center gap-2 text-[10px]">
            <span
              className={`flex items-center gap-1 ${
                redisEnabled ? "text-emerald-400" : "text-slate-500"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  redisEnabled ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                }`}
              ></span>
              Redis: {redisEnabled ? "Connected" : "Disabled"}
            </span>
            {error && <span className="text-orange-400">⚠ {error}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex flex-col items-end">
            <span className="text-slate-400 text-[10px]">Hits</span>
            <span className="font-semibold text-emerald-300">
              {hits.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-400 text-[10px]">Misses</span>
            <span className="font-semibold text-orange-300">
              {misses.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-400 text-[10px]">Hit Rate</span>
            <span className={`font-semibold ${hitRateColor}`}>
              {hitRatePercent}%
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-400 text-[10px]">Total</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
              {total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Visual hit rate bar */}
      {total > 0 && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800/50">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${hitRate * 100}%` }}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleClearCache}
          disabled={clearing || !redisEnabled}
          className="rounded-md bg-red-500/20 px-3 py-1.5 text-[10px] font-medium text-red-300 transition-colors hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {clearing ? "Clearing..." : "Clear Cache"}
        </button>
        <button
          onClick={handleCheckCache}
          disabled={!redisEnabled}
          className="rounded-md bg-blue-500/20 px-3 py-1.5 text-[10px] font-medium text-blue-300 transition-colors hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Cache
        </button>
      </div>
    </div>
  );
}
