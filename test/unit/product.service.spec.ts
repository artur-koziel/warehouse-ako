import { ProductService } from '../../src/domain/services';
import { Product, ProductStatus } from '../../src/domain/entities'
import { CreateProductAttributes, IProductRepository, Pagination, ProductFilter, Sort, UpdateProductPatch } from '../../src/domain/repositories/interfaces';

function createProductRepoMock(): jest.Mocked<IProductRepository> {
  return {
    create: jest.fn<Promise<Product>, [CreateProductAttributes]>(),
    findById: jest.fn<Promise<Product | null>, [string]>(),
    findBySku: jest.fn<Promise<Product | null>, [string]>(),
    update: jest.fn<Promise<Product | null>, [string, UpdateProductPatch]>(),
    softDelete: jest.fn<Promise<void>, [string]>(),
    list: jest.fn<
      Promise<{ items: Product[]; total: number }>,
      [ProductFilter, Pagination, Sort]
    >(),
    adjustQuantity: jest.fn<Promise<Product | null>, [string, number]>(),
  };
}

const makeProduct = (over: Partial<Product> = {}): Product => ({
  id: 'p-' + Math.random().toString(36).slice(2),
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  sku: 'SKU-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
  name: 'Test',
  description: null,
  price: '10.00',
  currency: 'PLN',
  quantity: 0,
  status: ProductStatus.ACTIVE,
  ...over,
});

describe('ProductService (unit)', () => {
  it('rejects duplicate SKU on create', async () => {
    const repo = createProductRepoMock();
    const svc = new ProductService(repo);

    const dto: CreateProductAttributes = {
      sku: 'DUP-1',
      name: 'Desk',
      description: null,
      price: '10.00',
      currency: 'PLN',
      quantity: 0,
      status: ProductStatus.ACTIVE,
    };

    const existing = makeProduct({ sku: 'DUP-1' });
    repo.findBySku.mockResolvedValueOnce(null);      // first create allowed
    repo.create.mockResolvedValueOnce(makeProduct(dto));
    repo.findBySku.mockResolvedValueOnce(existing);  // second create blocked

    await expect(svc.create(dto)).resolves.toMatchObject({ sku: 'DUP-1' });
    await expect(svc.create(dto)).rejects.toThrow('SKU already exists');
  });

  it('prevents negative stock and rolls back', async () => {
    const repo = createProductRepoMock();
    const svc = new ProductService(repo);

    const p = makeProduct({ id: 'P1', quantity: 1 });
    repo.findById.mockResolvedValue(p);
    // first adjust makes quantity negative:
    repo.adjustQuantity
      .mockResolvedValueOnce({ ...p, quantity: -4 })
      // rollback call:
      .mockResolvedValueOnce({ ...p, quantity: 1 });

    await expect(svc.adjustStock('P1', -5)).rejects.toThrow('Quantity cannot be negative');

    expect(repo.adjustQuantity).toHaveBeenNthCalledWith(1, 'P1', -5);
    expect(repo.adjustQuantity).toHaveBeenNthCalledWith(2, 'P1', 5);
  });

  it('throws NotFound on update missing id', async () => {
    const repo = createProductRepoMock();
    const svc = new ProductService(repo);
    repo.update.mockResolvedValue(null);
    await expect(svc.update('missing', { name: 'x' })).rejects.toThrow('Product not found');
  });
});
