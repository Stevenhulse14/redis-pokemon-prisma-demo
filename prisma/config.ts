import { defineConfig } from "prisma";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL,
  },
});
