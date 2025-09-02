import 'reflect-metadata';
import type { DataSource } from 'typeorm';
import { container as root } from '../../src/infra/ioc';
import { registerProductModule } from '../../src/infra/ioc/modules/product.module';
import { ProductService } from '../../src/domain/services';
import { Product } from '../../src/domain/entities';

describe('DI module: product', () => {
  it('resolves ProductService when DataSource is provided', () => {
    // Create an isolated child container so we don't touch the global one
    const c = root.createChildContainer();

    // Provide a minimal DataSource stub that the repo constructor uses
    const dsStub = { getRepository: jest.fn(() => ({})) } as unknown as DataSource;
    c.registerInstance('DataSource', dsStub);

    // Register only the product module bindings
    registerProductModule(c);

    // Should resolve without throwing
    const svc = c.resolve(ProductService);
    expect(svc).toBeInstanceOf(ProductService);

    // Repo constructor should have asked the DataSource for Product repository
    expect(dsStub.getRepository).toHaveBeenCalledWith(Product);
  });
});
