module.exports = [
"[project]/lib/db.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[root-of-the-server]__eea529fa._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/db.ts [app-route] (ecmascript)");
    });
});
}),
"[project]/lib/redis.ts [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/node_modules_06ecf3ae._.js",
  "server/chunks/[root-of-the-server]__4933b59f._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/redis.ts [app-route] (ecmascript)");
    });
});
}),
];