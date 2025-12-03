module.exports = [
"[project]/lib/db.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/node_modules_@neondatabase_serverless_index_mjs_2c73916b._.js",
  "server/chunks/lib_db_ts_e06c6085._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/db.ts [app-route] (ecmascript)");
    });
});
}),
"[project]/lib/redis.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/lib_redis_ts_e89cca64._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/redis.ts [app-route] (ecmascript)");
    });
});
}),
];