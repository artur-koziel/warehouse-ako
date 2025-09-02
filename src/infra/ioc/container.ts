import 'reflect-metadata';
import { container as tsyringe } from 'tsyringe';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { TOKENS } from './tokens';
import { IProductRepository } from '../../domain/repositories/interfaces';
import { ProductTypeOrmRepository } from '../../domain/repositories';
import { ProductService } from '../../domain/services';

tsyringe.register<DataSource>(TOKENS.DataSource, { useValue: AppDataSource });
tsyringe.register<IProductRepository>(TOKENS.IProductRepository, { useClass: ProductTypeOrmRepository });
tsyringe.register(ProductService, { useClass: ProductService });

export const container = tsyringe;
