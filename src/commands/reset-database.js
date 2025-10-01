
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config();

const PSQL       = process.env.PSQL_PATH || 'psql';           // caminho do psql (ou só 'psql' se estiver no PATH do sistema)
const PGHOST     = process.env.DB_HOST  || process.env.PGHOST || 'localhost'; // endereço do servidor do Postgres
const PGPORT     = process.env.DB_PORT  || process.env.PGPORT || '5432';      // porta do Postgres
const PGUSER     = process.env.DB_USER  || process.env.PGUSER || 'postgres';  // usuário do Postgres
const PGPASSWORD = process.env.DB_PASSWORD || process.env.PGPASSWORD || 'postgres'; // senha do Postgres

const sqlFile = path.resolve(process.cwd(), 'src', 'database', 'banco.sql');

if (!fs.existsSync(sqlFile)) {
  console.error('❌ Arquivo SQL não encontrado em:', sqlFile);
  process.exit(1); 
}

const args = [
  '--no-psqlrc',
  '-v', 'ON_ERROR_STOP=1',
  '-h', PGHOST,
  '-p', PGPORT,
  '-U', PGUSER,
  '-d', 'postgres',
  '-f', sqlFile
];
try {

  console.log('> Executando reset do banco...');
  console.log(`  psql: ${PSQL}`);
  console.log(`  conexão: host=${PGHOST} port=${PGPORT} user=${PGUSER}`);
  console.log(`  arquivo: ${sqlFile}`);

  execFileSync(PSQL, args, {
    stdio: 'inherit',
    env: {
      ...process.env,          
      PGPASSWORD,              
      PGCLIENTENCODING: 'UTF8' 
    }
  });

  console.log('> ✅ Reset finalizado com sucesso.');
} catch (err) {

  if (err.code === 'ENOENT') {
    console.error('❌ psql não encontrado.');
    console.error('   O que fazer:');
    console.error('   1) Instale o PostgreSQL e garanta que o "psql" está no PATH;');
    console.error('   2) OU defina PSQL_PATH no .env com o caminho completo do psql.exe;');
  } else {

    console.error('❌ Falha ao executar o reset:', err.message);
  }

  process.exit(1);
}