import { Pool, QueryResult } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Please add it to your .env file.");
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
});

export async function initSocialGraphTables(): Promise<void> {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS social_edges (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      ens_from TEXT NOT NULL,
      ens_to TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_social_edges_user ON social_edges (user_id);
    CREATE INDEX IF NOT EXISTS idx_social_edges_pair ON social_edges (ens_from, ens_to);
  `;

  await pool.query(createTableSQL);
}

export async function insertSocialEdge(params: {
  userId: string;
  ensFrom: string;
  ensTo: string;
}): Promise<QueryResult> {
  const { userId, ensFrom, ensTo } = params;
  const insertSQL = `
    INSERT INTO social_edges (user_id, ens_from, ens_to)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, ens_from, ens_to, created_at
  `;

  return pool.query(insertSQL, [userId, ensFrom, ensTo]);
}

export async function getSocialEdges(params?: {
  userId?: string;
  limit?: number;
}): Promise<QueryResult> {
  const userId = params?.userId?.trim();
  const limit = params?.limit ?? 500;

  if (userId) {
    return pool.query(
      `SELECT id, user_id, ens_from, ens_to, created_at
       FROM social_edges
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
  }

  return pool.query(
    `SELECT id, user_id, ens_from, ens_to, created_at
     FROM social_edges
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );
}

