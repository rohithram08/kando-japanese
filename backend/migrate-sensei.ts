import dotenv from 'dotenv';
import path from 'path';
import mysql from 'mysql2/promise';

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
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to TiDB successfully!');

    console.log('Creating sensei_conversations table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sensei_conversations (
        id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        role VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        intent VARCHAR(50) DEFAULT NULL,
        emotion VARCHAR(30) DEFAULT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX user_created_idx (user_id, created_at),
        CONSTRAINT fk_sensei_conversations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
    `);

    console.log('Creating sensei_tour_progress table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sensei_tour_progress (
        user_id VARCHAR(36) NOT NULL,
        current_step INT NOT NULL DEFAULT 0,
        completed BOOLEAN NOT NULL DEFAULT FALSE,
        skipped BOOLEAN NOT NULL DEFAULT FALSE,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        PRIMARY KEY (user_id),
        CONSTRAINT fk_sensei_tour_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
    `);

    const [tables] = await connection.query('SHOW TABLES');
    console.log('Current tables in DB:', tables);
    console.log('✅ SENSEI TABLES SUCCESSFULLY CREATED IN TIDB!');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

migrate();
