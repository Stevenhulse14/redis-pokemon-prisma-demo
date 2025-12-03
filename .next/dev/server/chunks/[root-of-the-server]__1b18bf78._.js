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
let redisClient = null;
function getRedis() {
    if (redisClient) return redisClient;
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) {
        console.warn("[redis] Upstash credentials not found. Redis caching disabled.");
        return null;
    }
    redisClient = new UpstashRedis(url, token);
    return redisClient;
}
const redis = getRedis();
}),
"[project]/app/api/metrics/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/api/metrics/route.ts
__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/redis.ts [app-route] (ecmascript)");
;
;
async function GET(_req) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"]) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            hits: 0,
            misses: 0,
            hitRate: 0,
            redisEnabled: false
        }, {
            status: 200
        });
    }
    try {
        const [hitsRaw, missesRaw] = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].mGet([
            "metrics:hits",
            "metrics:misses"
        ]);
        const hits = Number(hitsRaw ?? 0);
        const misses = Number(missesRaw ?? 0);
        const total = hits + misses;
        const hitRate = total > 0 ? hits / total : 0;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            hits,
            misses,
            hitRate,
            redisEnabled: true
        }, {
            status: 200
        });
    } catch (error) {
        console.error("[api/metrics] Redis error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            hits: 0,
            misses: 0,
            hitRate: 0,
            redisEnabled: true,
            error: "Failed to read metrics"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1b18bf78._.js.map