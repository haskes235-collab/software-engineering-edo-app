import { defineConfig } from 'drizzle-kit'
import path from 'path'

export default defineConfig({
  schema: './src/main/db/schema.ts',
  out: './drizzle',         
  dialect: 'sqlite',
  dbCredentials: {
    url: './dev.db',        
  },
})