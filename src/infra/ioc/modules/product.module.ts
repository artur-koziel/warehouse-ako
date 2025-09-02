import { DependencyContainer } from 'tsyringe';
import { DataSource } from 'typeorm';
import { ProductService } from '../../../domain/services';
import { IProductRepository, ProductTypeOrmRepository } from '../../../domain/repositories';

/**
 * Registers Product-related dependencies in the given container.
 * Expects a DataSource to be already registered under token 'DataSource'.
 */
export function registerProductModule(c: DependencyContainer) {
  // Repo binding
  c.register<IProductRepository>('IProductRepository', { useClass: ProductTypeOrmRepository });

  // Service binding
  c.register(ProductService, { useClass: ProductService });
}
