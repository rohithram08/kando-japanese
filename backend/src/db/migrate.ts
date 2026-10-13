import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { env } from '../config/env.js';
import * as schema from './schema.js';

async function runMigrations() {
  console.log('🔄 Running migrations...');
  const pool = mysql.createPool({
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    ssl: env.DATABASE_SSL ? { rejectUnauthorized: true } : undefined,
    multipleStatements: true,
    connectTimeout: 30000,
  });

  try {
    // Enable multi-statement execution on TiDB Cloud if applicable
    try {
      await pool.query("SET SESSION tidb_multi_statement_mode = 'ON'");
    } catch {
      // Ignored if standard MySQL / not supported
    }

    const migrationDb = drizzle(pool, { schema, mode: 'default' });
    await migrate(migrationDb, { migrationsFolder: './src/db/migrations' });
    console.log('✅ Migrations complete.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();

