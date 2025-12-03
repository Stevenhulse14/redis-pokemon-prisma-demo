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
"[externals]/pg [external] (pg, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getSQL",
    ()=>getSQL
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
let pool = null;
function getSQL() {
    if (pool) {
        return pool;
    }
    const databaseUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
        throw new Error("No database URL found in environment variables. Please set POSTGRES_PRISMA_URL, DATABASE_URL, or POSTGRES_URL");
    }
    // Check if it's a placeholder value
    if (databaseUrl.includes("your_") || databaseUrl === "placeholder" || databaseUrl.startsWith("https://")) {
        throw new Error(`Invalid database URL. Please set a valid PostgreSQL connection string in POSTGRES_PRISMA_URL. Current value: ${databaseUrl.substring(0, 50)}...`);
    }
    // Basic validation - should start with postgresql:// or postgres://
    if (!databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("postgres://")) {
        throw new Error(`Invalid database URL format. Expected postgresql:// or postgres://, got: ${databaseUrl.substring(0, 50)}...`);
    }
    // Parse connection string to extract components
    const url = new URL(databaseUrl);
    const isSupabase = url.hostname.includes("supabase") || url.hostname.includes("pooler");
    // Build pool config
    const poolConfig = {
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1),
        user: url.username,
        password: url.password,
        // SSL configuration for Supabase
        ssl: isSupabase ? {
            rejectUnauthorized: false
        } : undefined,
        // Additional pool settings
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000
    };
    // Add query parameters if present
    url.searchParams.forEach((value, key)=>{
        if (key === "sslmode") {
            // Handle sslmode parameter
            if (value === "require" || value === "prefer") {
                poolConfig.ssl = poolConfig.ssl || {
                    rejectUnauthorized: false
                };
            }
        }
    });
    pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Pool"](poolConfig);
    return pool;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
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
"[project]/app/api/pokemon/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/redis.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const POKEMON_TTL_SECONDS = 300;
async function GET(_req, context) {
    const params = await context.params;
    const idParam = params.id;
    const id = Number(idParam);
    if (Number.isNaN(id) || id <= 0) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invalid Pokémon ID"
        }, {
            status: 400
        });
    }
    const cacheKey = `pokemon:${id}`;
    try {
        // 1. Try cache first
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"]) {
            try {
                const cached = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].get(cacheKey);
                if (cached) {
                    const pokemon = JSON.parse(cached);
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].incr("metrics:hits").catch(()=>{});
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        pokemon,
                        source: "cache"
                    }, {
                        status: 200
                    });
                }
            } catch (error) {
                console.error("[redis] Cache read error:", error);
            }
        }
        // 2. Cache miss → hit DB with direct SQL
        const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSQL"])();
        const result = await db.query(`SELECT 
        id, 
        name, 
        "spriteUrl", 
        "typePrimary", 
        "typeSecondary",
        hp,
        attack,
        defense,
        speed,
        "createdAt",
        "updatedAt"
      FROM "Pokemon"
      WHERE id = $1
      LIMIT 1`, [
            id
        ]);
        if (result.rows.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Pokémon not found"
            }, {
                status: 404
            });
        }
        const pokemon = result.rows[0];
        // 3. Store in cache for next time
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"]) {
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].set(cacheKey, JSON.stringify(pokemon), {
                    EX: POKEMON_TTL_SECONDS
                });
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].incr("metrics:misses");
            } catch (error) {
                console.error("[redis] Cache write error:", error);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            pokemon,
            source: "db"
        }, {
            status: 200
        });
    } catch (error) {
        console.error("[api/pokemon/[id]] Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error",
            message: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 500
        });
    }
}
async function POST(_req, context) {
    const params = await context.params;
    const idParam = params.id;
    const id = Number(idParam);
    if (Number.isNaN(id) || id <= 0) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invalid Pokémon ID"
        }, {
            status: 400
        });
    }
    const cacheKey = `pokemon:${id}`;
    try {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"]) {
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].del(cacheKey);
            } catch (error) {
                console.error("[redis] Delete error:", error);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Cache busted successfully"
        }, {
            status: 200
        });
    } catch (error) {
        console.error("[api/pokemon/[id]] Cache bust error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to bust cache"
        }, {
            status: 500
        });
    }
}
// Function to increment metrics
async function incrementMetric(kind) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"]) return;
    const key = `metrics:${kind}`;
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redis"].incr(key);
    } catch (error) {
        console.warn(`[metrics] Failed to increment ${kind}:`, error);
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6e0188cd._.js.map