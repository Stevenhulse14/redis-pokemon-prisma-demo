module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[externals]/node:net [external] (node:net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:net", () => require("node:net"));

module.exports = mod;
}),
"[externals]/node:tls [external] (node:tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:tls", () => require("node:tls"));

module.exports = mod;
}),
"[externals]/node:timers/promises [external] (node:timers/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:timers/promises", () => require("node:timers/promises"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/dns/promises [external] (dns/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns/promises", () => require("dns/promises"));

module.exports = mod;
}),
"[externals]/node:assert [external] (node:assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:assert", () => require("node:assert"));

module.exports = mod;
}),
"[externals]/node:diagnostics_channel [external] (node:diagnostics_channel, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:diagnostics_channel", () => require("node:diagnostics_channel"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/node:url [external] (node:url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:url", () => require("node:url"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[project]/lib/redis.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Upstash Redis REST API client
 * Uses the REST API instead of node-redis to work in browser-based environments like v0
 */ __turbopack_context__.s([
    "getRedis",
    ()=>getRedis,
    "redis",
    ()=>redis
]);
class UpstashRedis {
    url;
    token;
    constructor(url, token){
        this.url = url;
        this.token = token;
    }
    async handleResponse(response) {
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Redis API error: ${text}`);
        }
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch  {
            throw new Error(`Invalid JSON response: ${text}`);
        }
    }
    async get(key) {
        try {
            const response = await fetch(`${this.url}/get/${key}`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });
            const data = await this.handleResponse(response);
            return data.result;
        } catch (error) {
            console.error("[redis] GET error:", error);
            return null;
        }
    }
    async set(key, value, options) {
        try {
            const commands = options?.EX ? [
                "SET",
                key,
                value,
                "EX",
                options.EX.toString()
            ] : [
                "SET",
                key,
                value
            ];
            const response = await fetch(`${this.url}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(commands)
            });
            const data = await this.handleResponse(response);
            return data.result;
        } catch (error) {
            console.error("[redis] SET error:", error);
            return null;
        }
    }
    async incr(key) {
        try {
            const response = await fetch(`${this.url}/incr/${key}`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });
            const data = await this.handleResponse(response);
            return data.result;
        } catch (error) {
            console.error("[redis] INCR error:", error);
            return 0;
        }
    }
    async mGet(keys) {
        try {
            const commands = [
                "MGET",
                ...keys
            ];
            const response = await fetch(`${this.url}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(commands)
            });
            const data = await this.handleResponse(response);
            return data.result;
        } catch (error) {
            console.error("[redis] MGET error:", error);
            return keys.map(()=>null);
        }
    }
    async del(key) {
        try {
            const response = await fetch(`${this.url}/del/${key}`, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            });
            const data = await this.handleResponse(response);
            return data.result;
        } catch (error) {
            console.error("[redis] DEL error:", error);
            return 0;
        }
    }
}
// Support both Upstash REST API and standard Redis
let redisClient = null;
function getRedis() {
    if (redisClient) return redisClient;
    // Try Upstash REST API first (for serverless environments)
    const upstashUrl = process.env.KV_REST_API_URL;
    const upstashToken = process.env.KV_REST_API_TOKEN;
    if (upstashUrl && upstashToken) {
        console.log("[redis] Using Upstash REST API");
        redisClient = new UpstashRedis(upstashUrl, upstashToken);
        return redisClient;
    }
    // Try standard Redis connection
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
        try {
            console.log("[redis] Using standard Redis connection:", redisUrl);
            const { createClient } = __turbopack_context__.r("[project]/node_modules/redis/dist/index.js [app-route] (ecmascript)");
            const client = createClient({
                url: redisUrl,
                socket: {
                    reconnectStrategy: (retries)=>{
                        if (retries > 10) {
                            console.error("[redis] Max reconnection attempts reached");
                            return new Error("Max reconnection attempts reached");
                        }
                        return Math.min(retries * 100, 3000);
                    }
                }
            });
            // Handle connection events
            client.on("error", (err)=>{
                console.error("[redis] Client error:", err.message);
            });
            client.on("connect", ()=>{
                console.log("[redis] Connected to Redis");
            });
            client.on("ready", ()=>{
                console.log("[redis] Redis client ready");
            });
            client.on("reconnecting", ()=>{
                console.log("[redis] Reconnecting to Redis...");
            });
            // Connect the client
            client.connect().catch((err)=>{
                console.error("[redis] Initial connection error:", err.message);
            });
            // Helper function to ensure connection
            async function ensureConnected() {
                if (!client.isOpen) {
                    try {
                        await client.connect();
                    } catch (error) {
                        // Ignore "already connecting" errors
                        if (!error.message?.includes("already connecting") && !error.message?.includes("Socket already opened")) {
                            throw error;
                        }
                    }
                }
            }
            // Wrap standard Redis client to match Upstash API
            redisClient = {
                async get (key) {
                    try {
                        await ensureConnected();
                        return await client.get(key);
                    } catch (error) {
                        console.error("[redis] GET error:", error.message || error);
                        return null;
                    }
                },
                async set (key, value, options) {
                    try {
                        await ensureConnected();
                        if (options?.EX) {
                            await client.setEx(key, options.EX, value);
                        } else {
                            await client.set(key, value);
                        }
                        return "OK";
                    } catch (error) {
                        console.error("[redis] SET error:", error.message || error);
                        return null;
                    }
                },
                async incr (key) {
                    try {
                        await ensureConnected();
                        return await client.incr(key);
                    } catch (error) {
                        console.error("[redis] INCR error:", error.message || error);
                        return 0;
                    }
                },
                async del (key) {
                    try {
                        await ensureConnected();
                        return await client.del(key);
                    } catch (error) {
                        console.error("[redis] DEL error:", error.message || error);
                        return 0;
                    }
                },
                async mGet (keys) {
                    try {
                        await ensureConnected();
                        const results = await client.mGet(keys);
                        return results;
                    } catch (error) {
                        console.error("[redis] MGET error:", error.message || error);
                        return keys.map(()=>null);
                    }
                }
            };
            return redisClient;
        } catch (error) {
            console.error("[redis] Failed to initialize Redis client:", error);
            console.warn("[redis] Redis caching disabled.");
            return null;
        }
    }
    console.warn("[redis] No Redis credentials found. Set KV_REST_API_URL/KV_REST_API_TOKEN (Upstash) or REDIS_URL (standard Redis). Redis caching disabled.");
    return null;
}
const redis = getRedis();
}),
"[project]/app/api/cache/check/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/redis.ts [app-route] (ecmascript)");
;
;
async function GET() {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"]) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Redis not available",
            cache: {}
        }, {
            status: 503
        });
    }
    try {
        // Check for common cache keys
        const cacheKeys = [
            "metrics:hits",
            "metrics:misses",
            "search:all"
        ];
        // Try to get a few Pokemon cache entries (check first 10 IDs)
        const pokemonKeys = Array.from({
            length: 10
        }, (_, i)=>`pokemon:${i + 1}`);
        const allKeys = [
            ...cacheKeys,
            ...pokemonKeys
        ];
        const cacheData = {};
        // Fetch all keys
        for (const key of allKeys){
            try {
                const value = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].get(key);
                if (value) {
                    try {
                        cacheData[key] = JSON.parse(value);
                    } catch  {
                        cacheData[key] = value;
                    }
                }
            } catch (error) {
            // Skip errors for individual keys
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            cache: cacheData,
            keysFound: Object.keys(cacheData).length
        }, {
            status: 200
        });
    } catch (error) {
        console.error("[api/cache/check] Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to check cache",
            cache: {},
            message: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2e789014._.js.map