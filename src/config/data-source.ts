import { DataSource } from 'typeorm';
import 'dotenv/config';
import { config } from './env'
import { Product } from '../domain/entities';
import { Initial1720000000000 } from '../migrations';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USER,
  password: config.DB_PASS,
  database: config.DB_NAME,
  synchronize: config.DB_SYNCHRONIZE,
  logging: config.DB_LOGGING,
  entities: [Product],
  migrations: [Initial1720000000000],
});
