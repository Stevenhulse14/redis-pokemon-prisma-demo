import { Pool, PoolConfig } from "pg"

let pool: Pool | null = null

export function getSQL(): Pool {
  if (pool) {
    return pool
  }

  const databaseUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL

  if (!databaseUrl) {
    throw new Error("No database URL found in environment variables. Please set POSTGRES_PRISMA_URL, DATABASE_URL, or POSTGRES_URL")
  }

  // Check if it's a placeholder value
  if (databaseUrl.includes("your_") || databaseUrl === "placeholder" || databaseUrl.startsWith("https://")) {
    throw new Error(`Invalid database URL. Please set a valid PostgreSQL connection string in POSTGRES_PRISMA_URL. Current value: ${databaseUrl.substring(0, 50)}...`)
  }

  // Basic validation - should start with postgresql:// or postgres://
  if (!databaseUrl.startsWith("postgresql://") && !databaseUrl.startsWith("postgres://")) {
    throw new Error(`Invalid database URL format. Expected postgresql:// or postgres://, got: ${databaseUrl.substring(0, 50)}...`)
  }

  // Parse connection string to extract components
  const url = new URL(databaseUrl)
  const isSupabase = url.hostname.includes("supabase") || url.hostname.includes("pooler")

  // Build pool config
  const poolConfig: PoolConfig = {
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1), // Remove leading slash
    user: url.username,
    password: url.password,
    // SSL configuration for Supabase
    ssl: isSupabase
      ? {
          rejectUnauthorized: false, // Allow self-signed certificates
        }
      : undefined,
    // Additional pool settings
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  }

  // Add query parameters if present
  url.searchParams.forEach((value, key) => {
    if (key === "sslmode") {
      // Handle sslmode parameter
      if (value === "require" || value === "prefer") {
        poolConfig.ssl = poolConfig.ssl || { rejectUnauthorized: false }
      }
    }
  })

  pool = new Pool(poolConfig)

  return pool
}
