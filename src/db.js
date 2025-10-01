import { Pool } from "pg";

import dotenv from "dotenv";
dotenv.config();
const HOST = process.env.PGHOST || process.env.DB_HOST || "localhost";
const PORT = process.env.PGPORT || process.env.DB_PORT || "5432"; 
const DATABASE = process.env.PGDATABASE || process.env.DB_DATABASE || "db_agendamentos";
const USER = process.env.PGUSER || process.env.DB_USER || "postgres";
const PASSWORD = process.env.PGPASSWORD || process.env.DB_PASSWORD || "postgres";
const pool = new Pool({
  host: HOST,         
  port: PORT,         
  database: DATABASE, 
  user: USER,         
  password: PASSWORD, 
});

export { pool };