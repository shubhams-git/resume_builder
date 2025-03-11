import dotenv from 'dotenv';
import { cleanEnv, str, port } from 'envalid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from backend root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  NODE_ENV: str({ choices: ['development', 'production'], default: 'development' }),
  JWT_SECRET: str(),
  DATABASE_URL: str(),
  PDFLATEX_PATH: str({ default: '/usr/bin/pdflatex' }),
  CORS_ORIGIN: str(),
});

export default {
  port: env.PORT,
  env: env.NODE_ENV,
  jwt: {
    secret: env.JWT_SECRET,
    accessExpiration: '15m',
    refreshExpiration: '7d',
  },
  database: {
    url: env.DATABASE_URL,
  },
  pdflatexPath: env.PDFLATEX_PATH,
  cors: {
    origin: env.CORS_ORIGIN,
  },
};