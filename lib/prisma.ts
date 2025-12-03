// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined
}

/**
 * PrismaClient singleton.
 * Avoids creating multiple clients during Next.js dev hot reloads.
 * 
 * Prisma 7: Connection URL is configured in prisma/config.ts for migrations.
 * For PrismaClient, we pass the URL via accelerateUrl (works with direct connections too).
 */
export const prisma: PrismaClient =
  global._prisma ??
  new PrismaClient({
    accelerateUrl: process.env.POSTGRES_PRISMA_URL,
    log: ["warn", "error"],
  })

if (process.env.NODE_ENV !== "production") {
  global._prisma = prisma
}
