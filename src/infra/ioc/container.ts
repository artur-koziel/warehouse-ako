import 'reflect-metadata';
import { container as tsyringe } from 'tsyringe';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { registerProductModule } from './modules/product.module';

// Register shared infrastructure first
tsyringe.register<DataSource>('DataSource', { useValue: AppDataSource });

// Register feature modules
registerProductModule(tsyringe);

// Export the configured container
export const container = tsyringe;
