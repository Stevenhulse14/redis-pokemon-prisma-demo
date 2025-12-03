module.exports = [
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
];

//# sourceMappingURL=%5Broot-of-the-server%5D__eea529fa._.js.map