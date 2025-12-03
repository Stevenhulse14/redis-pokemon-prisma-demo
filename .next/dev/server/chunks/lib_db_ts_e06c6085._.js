module.exports = [
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSQL",
    ()=>getSQL
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
;
function getSQL() {
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neon"])(databaseUrl);
}
}),
];

//# sourceMappingURL=lib_db_ts_e06c6085._.js.map