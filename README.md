# PokeCache Arena

A demonstration app showcasing **Redis cache-aside pattern** with **Supabase Postgres**, **Next.js 14**, and optionally **Prisma ORM**. Explore Pokémon while watching real-time cache performance metrics.

## Architecture Overview

### Cache-Aside Pattern
This app implements the classic cache-aside (lazy loading) pattern:

1. **Request comes in** → Check Redis cache first
2. **Cache hit** → Return cached data, increment hit counter
3. **Cache miss** → Fetch from Postgres, store in Redis with TTL, increment miss counter

This is the same pattern used by companies like Facebook (with Memcached) and Twitter to scale read-heavy workloads.

### Tech Stack
- **Next.js 14** (App Router, TypeScript, React Server Components)
- **Neon Serverless Driver** for direct SQL queries (works in v0 preview)
- **Prisma ORM** (optional, for local development)
- **Supabase Postgres** for persistent storage
- **Redis** (via Upstash) for caching and metrics
- **Tailwind CSS v4** for mystical styling

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

The app uses:
- `POSTGRES_PRISMA_URL` for database connection (works with both Neon driver and Prisma)
- `REDIS_URL` for the Redis client

In v0, these are automatically configured via integrations.

For local development, create a `.env` file:

\`\`\`env
# Supabase Postgres
POSTGRES_PRISMA_URL="postgresql://user:password@host:port/database?pgbouncer=true"

# Redis (Upstash)
REDIS_URL="redis://default:password@host:port"
\`\`\`

### 3. Set Up the Database

**For v0 Preview Environment:**

Run these SQL scripts directly from the v0 interface in order:
1. `scripts/001-create-pokemon-table.sql` - Creates the Pokemon table
2. `scripts/002-seed-pokemon.sql` - Seeds 22 Pokemon with data

The v0 environment uses direct SQL queries via the Neon serverless driver, so no Prisma migrations are needed.

**For Local Development:**

You can use Prisma migrations if you prefer:

\`\`\`bash
npx prisma migrate dev --name init
npm run db:seed
\`\`\`

Or run the SQL scripts directly in your database client.

### 4. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── metrics/route.ts       # Cache hit/miss metrics
│   │   └── pokemon/
│   │       ├── route.ts           # List/search Pokemon (cache-aside)
│   │       └── [id]/route.ts      # Get/refresh single Pokemon (cache-aside)
│   ├── pokemon/[id]/page.tsx      # Detail page with cache source indicator
│   ├── page.tsx                   # Home page with search
│   ├── layout.tsx                 # Mystical layout with glowing orbs
│   └── globals.css                # Tailwind v4 + custom design tokens
├── components/
│   ├── pokemon-card.tsx           # Card with type-based gradients
│   └── cache-metrics.tsx          # Live metrics widget
├── lib/
│   ├── db.ts                      # Database client for direct SQL queries
│   ├── prisma.ts                  # Prisma singleton client (optional)
│   └── redis.ts                   # Redis singleton client
├── prisma/
│   ├── schema.prisma              # Pokemon table definition
│   └── seed.ts                    # Sample data seed script
├── scripts/
│   ├── 001-create-pokemon-table.sql # SQL script for creating the Pokemon table
│   └── 002-seed-pokemon.sql       # SQL script for seeding the Pokemon data
└── README.md
\`\`\`

## Key Implementation Details

### Database Client (`lib/db.ts`)
- Uses `@neondatabase/serverless` for direct SQL queries
- Works in both v0 preview and production without code generation
- Connects via `POSTGRES_PRISMA_URL` environment variable

### Redis Client (`lib/redis.ts`)
- Singleton pattern to prevent connection storms in dev
- Graceful fallback if `REDIS_URL` is not set
- Returns `null` if Redis is unavailable → app uses DB-only mode

### Cache-Aside Logic
All API routes follow the same pattern:
1. Construct cache key
2. Try Redis GET
3. On hit → parse JSON, increment `metrics:hits`, return
4. On miss → query database with SQL, store in Redis with `EX` (TTL), increment `metrics:misses`, return

### UI Features
- **Search bar** with debounced live search (client-side)
- **Cache metrics widget** auto-refreshes every 8 seconds
- **Detail page** shows cache source (`⚡ From Cache` vs `🐢 From Database`)
- **Bust cache button** forces next request to hit DB

## Design Notes

### Mystical Pokemon Theme
- **Dark gradient background**: `from-slate-950 via-indigo-900 to-slate-950`
- **Glowing orbs**: Fuchsia and cyan blurred circles for depth
- **Type-based card gradients**: Each Pokemon type has a unique color gradient
- **Neon hover effects**: Cards glow on hover with fuchsia shadows
- **Minimal font usage**: System fonts via `Geist` and `Geist Mono`

### Performance Considerations
- **TTL tuning**: Search results cache for 2 minutes, details for 5 minutes
- **Client-side debouncing**: Search queries wait 300ms before firing
- **Incremental metrics**: Using Redis `INCR` for atomic counter updates
- **Graceful degradation**: App works without Redis (just slower)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Build for production |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed Pokemon data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |

## Learning Resources

This app demonstrates:
- How to implement cache-aside pattern at scale
- Direct SQL queries with Neon serverless driver
- Prisma + Supabase integration with pooling
- Redis singleton pattern in Next.js
- Type-safe API routes with Next.js 15
- Client-side state management for search and metrics
- Tailwind v4 design tokens and mystical aesthetics

For production use, consider:
- Adding cache invalidation strategies (write-through, write-back)
- Implementing Redis cluster for high availability
- Using Prisma's query optimization features
- Adding proper error boundaries and loading states
- Setting up monitoring and alerting for cache hit rates
