import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
const HOST = process.env.PGHOST || process.env.DB_HOST || "dpg-d4qt9cu3jp1c739nre2g-a.virginia-postgres.render.com";
const PORT = process.env.PGPORT || process.env.DB_PORT || "5432"; 
const DATABASE = process.env.PGDATABASE || process.env.DB_DATABASE || "db_agendamentos_4ybg";
const USER = process.env.PGUSER || process.env.DB_USER || "murilo_djota";
const PASSWORD = process.env.PGPASSWORD || process.env.DB_PASSWORD || "3vRWKIe9An4qbBbtne9H9irdeSzLh2ZB";
const pool = new Pool({
  host: HOST,         
  port: PORT,         
  database: DATABASE, 
  user: USER,         
  password: PASSWORD, 
  ssl:
     { rejectUnauthorized: false }                
});

export { pool };