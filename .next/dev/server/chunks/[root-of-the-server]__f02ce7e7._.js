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
"[project]/app/api/pokemon/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(req) {
    try {
        const { getSQL } = await __turbopack_context__.A("[project]/lib/db.ts [app-route] (ecmascript, async loader)");
        const { redis } = await __turbopack_context__.A("[project]/lib/redis.ts [app-route] (ecmascript, async loader)");
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query")?.trim() ?? "";
        const normalizedQuery = query.toLowerCase();
        const cacheKey = normalizedQuery ? `search:${normalizedQuery}` : "search:all";
        // Try cache
        if (redis) {
            try {
                const cached = await redis.get(cacheKey);
                if (cached) {
                    const pokemonList = JSON.parse(cached);
                    await redis.incr("metrics:hits").catch(()=>{});
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        pokemon: pokemonList,
                        source: "cache"
                    });
                }
            } catch (error) {
                console.error("[redis] Cache read error:", error);
            }
        }
        const db = getSQL();
        const pokemon = normalizedQuery ? await db.query(`SELECT 
            id, 
            name, 
            "spriteUrl", 
            "typePrimary", 
            "typeSecondary"
          FROM "Pokemon"
          WHERE 
            LOWER(name) LIKE $1
            OR LOWER("typePrimary") LIKE $1
            OR LOWER(COALESCE("typeSecondary", '')) LIKE $1
          ORDER BY id ASC`, [
            `%${normalizedQuery}%`
        ]) : await db.query(`SELECT 
            id, 
            name, 
            "spriteUrl", 
            "typePrimary", 
            "typeSecondary"
          FROM "Pokemon"
          ORDER BY id ASC`);
        const pokemonRows = pokemon.rows;
        // Cache result
        if (redis) {
            try {
                await redis.set(cacheKey, JSON.stringify(pokemonRows), {
                    EX: 120
                });
                await redis.incr("metrics:misses");
            } catch (error) {
                console.error("[redis] Cache write error:", error);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            pokemon: pokemonRows,
            source: "db"
        });
    } catch (error) {
        console.error("[api/pokemon] Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error("[api/pokemon] Error details:", {
            errorMessage,
            errorStack
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error",
            message: errorMessage,
            pokemon: []
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f02ce7e7._.js.map