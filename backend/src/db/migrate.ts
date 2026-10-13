import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db, pool } from './index.js';

async function runMigrations() {
  console.log('🔄 Running migrations...');
  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('✅ Migrations complete.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
