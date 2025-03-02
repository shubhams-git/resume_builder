import dotenv from 'dotenv';
import { cleanEnv, str, port } from 'envalid';

dotenv.config();

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