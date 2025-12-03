/**
 * Upstash Redis REST API client
 * Uses the REST API instead of node-redis to work in browser-based environments like v0
 */
class UpstashRedis {
  private url: string;
  private token: string;

  constructor(url: string, token: string) {
    this.url = url;
    this.token = token;
  }

  private async handleResponse(response: Response): Promise<any> {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Redis API error: ${text}`);
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON response: ${text}`);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.url}/get/${key}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      const data = await this.handleResponse(response);
      return data.result;
    } catch (error) {
      console.error("[redis] GET error:", error);
      return null;
    }
  }

  async set(
    key: string,
    value: string,
    options?: { EX?: number }
  ): Promise<string | null> {
    try {
      const commands = options?.EX
        ? ["SET", key, value, "EX", options.EX.toString()]
        : ["SET", key, value];

      const response = await fetch(`${this.url}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commands),
      });
      const data = await this.handleResponse(response);
      return data.result;
    } catch (error) {
      console.error("[redis] SET error:", error);
      return null;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      const response = await fetch(`${this.url}/incr/${key}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      const data = await this.handleResponse(response);
      return data.result;
    } catch (error) {
      console.error("[redis] INCR error:", error);
      return 0;
    }
  }

  async mGet(keys: string[]): Promise<(string | null)[]> {
    try {
      const commands = ["MGET", ...keys];
      const response = await fetch(`${this.url}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commands),
      });
      const data = await this.handleResponse(response);
      return data.result;
    } catch (error) {
      console.error("[redis] MGET error:", error);
      return keys.map(() => null);
    }
  }

  async del(key: string): Promise<number> {
    try {
      const response = await fetch(`${this.url}/del/${key}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
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
let redisClient: UpstashRedis | any | null = null;

export function getRedis(): UpstashRedis | any | null {
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
      const { createClient } = require("redis");
      const client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries: number) => {
            if (retries > 10) {
              console.error("[redis] Max reconnection attempts reached");
              return new Error("Max reconnection attempts reached");
            }
            return Math.min(retries * 100, 3000);
          },
        },
      });

      // Handle connection events
      client.on("error", (err: Error) => {
        console.error("[redis] Client error:", err.message);
      });

      client.on("connect", () => {
        console.log("[redis] Connected to Redis");
      });

      client.on("ready", () => {
        console.log("[redis] Redis client ready");
      });

      client.on("reconnecting", () => {
        console.log("[redis] Reconnecting to Redis...");
      });

      // Connect the client
      client.connect().catch((err: Error) => {
        console.error("[redis] Initial connection error:", err.message);
      });

      // Helper function to ensure connection
      async function ensureConnected() {
        if (!client.isOpen) {
          try {
            await client.connect();
          } catch (error: any) {
            // Ignore "already connecting" errors
            if (
              !error.message?.includes("already connecting") &&
              !error.message?.includes("Socket already opened")
            ) {
              throw error;
            }
          }
        }
      }

      // Wrap standard Redis client to match Upstash API
      redisClient = {
        async get(key: string): Promise<string | null> {
          try {
            await ensureConnected();
            return await client.get(key);
          } catch (error: any) {
            console.error("[redis] GET error:", error.message || error);
            return null;
          }
        },
        async set(
          key: string,
          value: string,
          options?: { EX?: number }
        ): Promise<string | null> {
          try {
            await ensureConnected();
            if (options?.EX) {
              await client.setEx(key, options.EX, value);
            } else {
              await client.set(key, value);
            }
            return "OK";
          } catch (error: any) {
            console.error("[redis] SET error:", error.message || error);
            return null;
          }
        },
        async incr(key: string): Promise<number> {
          try {
            await ensureConnected();
            return await client.incr(key);
          } catch (error: any) {
            console.error("[redis] INCR error:", error.message || error);
            return 0;
          }
        },
        async del(key: string): Promise<number> {
          try {
            await ensureConnected();
            return await client.del(key);
          } catch (error: any) {
            console.error("[redis] DEL error:", error.message || error);
            return 0;
          }
        },
        async mGet(keys: string[]): Promise<(string | null)[]> {
          try {
            await ensureConnected();
            const results = await client.mGet(keys);
            return results;
          } catch (error: any) {
            console.error("[redis] MGET error:", error.message || error);
            return keys.map(() => null);
          }
        },
      };
      return redisClient;
    } catch (error) {
      console.error("[redis] Failed to initialize Redis client:", error);
      console.warn("[redis] Redis caching disabled.");
      return null;
    }
  }

  console.warn(
    "[redis] No Redis credentials found. Set KV_REST_API_URL/KV_REST_API_TOKEN (Upstash) or REDIS_URL (standard Redis). Redis caching disabled."
  );
  return null;
}

export const redis = getRedis();
