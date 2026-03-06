#!/usr/bin/env tsx

/**
 * Run a database migration
 * Usage: node --env-file=.env.local --import tsx/esm scripts/run-migration.ts <migration-file>
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const migrationFile = process.argv[2]

if (!migrationFile) {
  console.error('❌ Usage: tsx scripts/run-migration.ts <migration-file>')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function runMigration() {
  console.log(`\n🚀 Running migration: ${migrationFile}\n`)

  // Read migration SQL
  const migrationPath = path.join(process.cwd(), migrationFile)

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`)
    process.exit(1)
  }

  const sql = fs.readFileSync(migrationPath, 'utf-8')

  console.log('📝 SQL to execute:')
  console.log('─'.repeat(80))
  console.log(sql)
  console.log('─'.repeat(80))
  console.log()

  try {
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql })

    if (error) {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    }

    console.log('✅ Migration completed successfully!\n')
  } catch (err) {
    console.error('❌ Migration error:', err)
    process.exit(1)
  }
}

runMigration()
