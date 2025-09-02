import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config(); // ← wczytuje .env z katalogu projektu

export type AppConfig = {
  NODE_ENV: string;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASS: string;
  DB_NAME: string;
  DB_LOGGING: boolean;
  DB_SYNCHRONIZE: boolean;
  MIGRATE_ON_BOOT: boolean;
};

const bool = (v?: string, d=false) => v ? ['1','true','TRUE','yes','y'].includes(v) : d;
const num  = (v?: string, d=0) => Number.isFinite(Number(v)) ? Number(v) : d;

export const config: AppConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: num(process.env.PORT, 3000),
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: num(process.env.DB_PORT, 5432),
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASS: process.env.DB_PASS || 'postgres',
  DB_NAME: process.env.DB_NAME || 'warehouse',
  DB_LOGGING: bool(process.env.DB_LOGGING, false),
  DB_SYNCHRONIZE: bool(process.env.DB_SYNCHRONIZE, false),
  MIGRATE_ON_BOOT: bool(process.env.MIGRATE_ON_BOOT, true),
};
