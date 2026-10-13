import dotenv from 'dotenv';
import path from 'path';
import mysql from 'mysql2/promise';
import fs from 'fs';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const dbConfig = {
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 4000,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'nihongo_master',
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
  connectTimeout: 30000,
};

async function migrate() {
  console.log('Connecting to TiDB host:', dbConfig.host);
  console.log('Target database:', dbConfig.database);
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to TiDB successfully!');

    // 1. Confirm current database
    const [dbResult] = await connection.query('SELECT DATABASE() AS current_db');
    const currentDb = (dbResult as any[])[0]?.current_db;
    console.log('Confirmed current database:', currentDb);
    if (currentDb !== 'nihongo_master') {
      throw new Error(`Unexpected database: ${currentDb}. Aborting.`);
    }

    // 2. Check if user_reading_progress already exists
    const [existingTable] = await connection.query("SHOW TABLES LIKE 'user_reading_progress'");
    if ((existingTable as any[]).length > 0) {
      console.log('ℹ️ Table user_reading_progress already exists. Skipping creation.');
    } else {
      console.log('Creating user_reading_progress table from 0001_reading_progress.sql...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS \`user_reading_progress\` (
          \`id\` varchar(36) NOT NULL,
          \`user_id\` varchar(36) NOT NULL,
          \`story_id\` varchar(100) NOT NULL,
          \`status\` varchar(20) NOT NULL DEFAULT 'in_progress',
          \`last_sentence_index\` int NOT NULL DEFAULT 0,
          \`quiz_score\` int DEFAULT 0,
          \`completed_at\` timestamp NULL DEFAULT NULL,
          \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT \`user_reading_progress_id\` PRIMARY KEY(\`id\`),
          CONSTRAINT \`user_story_unique\` UNIQUE(\`user_id\`,\`story_id\`),
          INDEX \`user_reading_idx\` (\`user_id\`, \`status\`),
          CONSTRAINT \`fk_user_reading_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
      `);
      console.log('✅ Table user_reading_progress created successfully!');
    }

    // 3. Ensure __drizzle_migrations table exists and records applied migrations
    console.log('Synchronizing __drizzle_migrations tracking table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`__drizzle_migrations\` (
        \`id\` serial PRIMARY KEY,
        \`hash\` text NOT NULL,
        \`created_at\` bigint
      );
    `);

    // Check existing records in __drizzle_migrations
    const [existingMigs] = await connection.query('SELECT * FROM `__drizzle_migrations`');
    const migRows = existingMigs as any[];
    console.log('Existing entries in __drizzle_migrations:', migRows.length);

    // Read migration files to compute hashes
    const mig0000Path = path.resolve(process.cwd(), 'src/db/migrations/0000_aromatic_nightcrawler.sql');
    const mig0001Path = path.resolve(process.cwd(), 'src/db/migrations/0001_reading_progress.sql');

    const mig0000Sql = fs.readFileSync(mig0000Path, 'utf8');
    const mig0001Sql = fs.readFileSync(mig0001Path, 'utf8');

    const hash0000 = crypto.createHash('sha256').update(mig0000Sql).digest('hex');
    const hash0001 = crypto.createHash('sha256').update(mig0001Sql).digest('hex');

    const has0000 = migRows.some((r: any) => r.created_at === 1787483568115 || r.hash === hash0000);
    const has0001 = migRows.some((r: any) => r.created_at === 1787483600000 || r.hash === hash0001);

    if (!has0000) {
      await connection.query('INSERT INTO `__drizzle_migrations` (`hash`, `created_at`) VALUES (?, ?)', [
        hash0000,
        1787483568115,
      ]);
      console.log('Recorded 0000_aromatic_nightcrawler in __drizzle_migrations');
    }

    if (!has0001) {
      await connection.query('INSERT INTO `__drizzle_migrations` (`hash`, `created_at`) VALUES (?, ?)', [
        hash0001,
        1787483600000,
      ]);
      console.log('Recorded 0001_reading_progress in __drizzle_migrations');
    }

    // 4. Verify table structure
    const [desc] = await connection.query('DESCRIBE `user_reading_progress`');
    console.log('\n--- user_reading_progress Columns ---');
    console.table(desc);

    const [indexes] = await connection.query('SHOW INDEX FROM `user_reading_progress`');
    console.log('\n--- user_reading_progress Indexes ---');
    console.table((indexes as any[]).map((idx: any) => ({
      Key_name: idx.Key_name,
      Column_name: idx.Column_name,
      Non_unique: idx.Non_unique,
    })));

    const [createTableResult] = await connection.query('SHOW CREATE TABLE `user_reading_progress`');
    console.log('\n--- user_reading_progress CREATE TABLE statement ---');
    console.log((createTableResult as any[])[0]['Create Table']);

    console.log('\n✅ SAFE MIGRATION AND VERIFICATION COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

migrate();
