module.exports = [
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
];

//# sourceMappingURL=lib_redis_ts_e89cca64._.js.map