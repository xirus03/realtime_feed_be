import pg from "pg";
const { Pool } = pg;

let pool = null;

export function getPool() {
  if (!pool) {
    const config ={
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };

    console.log("🧪 Pool init config:", config);

    pool = new Pool(config);
  }

  return pool;
}

export const waitForDb = async () => {  
  const pool = getPool();
  for (let i = 0; i < 10; i++) {
    try {
      await pool.query("SELECT 1");
      console.log("DB READY");
      return;
    } catch (e) {
      console.log("waiting DB...");
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error("DB not ready");
};

export default getPool();