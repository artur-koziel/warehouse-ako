import 'reflect-metadata';
import { container } from '../../src/infra/ioc';
import { TOKENS } from '../../src/infra/ioc/tokens';
import { ProductService } from '../../src/domain/services';
import { IProductRepository, CreateProductAttributes } from '../../src/domain/repositories/interfaces';
import { Product, ProductStatus } from '../../src/domain/entities/';

describe('DI container wiring smoke test', () => {
  beforeEach(() => {
    container.reset(); // clear previous registrations
  });

  it('resolves ProductService with injected repo mock', async () => {
    const repoMock: jest.Mocked<IProductRepository> = {
      create: jest.fn<Promise<Product>, [CreateProductAttributes]>(),
      findById: jest.fn(),
      findBySku: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      list: jest.fn(),
      adjustQuantity: jest.fn(),
    };

    repoMock.findBySku.mockResolvedValueOnce(null);
    repoMock.create.mockResolvedValueOnce({
      id: 'p-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      sku: 'DI-OK',
      name: 'Desk',
      description: null,
      price: '10.00',
      currency: 'PLN',
      quantity: 0,
      status: ProductStatus.ACTIVE,
    });

    container.registerInstance(TOKENS.IProductRepository, repoMock as IProductRepository);

    const svc = container.resolve(ProductService);

    const created = await svc.create({
      sku: 'DI-OK',
      name: 'Desk',
      description: null,
      price: '10.00',
      currency: 'PLN',
      quantity: 0,
      status: ProductStatus.ACTIVE,
    });

    expect(repoMock.findBySku).toHaveBeenCalledWith('DI-OK');
    expect(repoMock.create).toHaveBeenCalled();
    expect(created.sku).toBe('DI-OK');
  });
});
