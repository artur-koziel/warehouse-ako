import { inject, injectable } from 'tsyringe';
import { Product, ProductStatus } from '../entities';
import {
  IProductRepository,
  ProductFilter,
  Pagination,
  Sort,
  CreateProductAttributes,
  UpdateProductPatch,
} from '../repositories';

@injectable()
export class ProductService {
  constructor(
      @inject('IProductRepository') private readonly repo: IProductRepository
    ) {}

  async create(attrs: CreateProductAttributes): Promise<Product> {
    const exists = await this.repo.findBySku(attrs.sku);
    if (exists) throw new Error('SKU already exists');
    return this.repo.create(attrs);
  }

  async get(id: string): Promise<Product> {
    const product = await this.repo.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async update(id: string, patch: UpdateProductPatch): Promise<Product> {
    const updated = await this.repo.update(id, patch);
    if (!updated) throw new Error('Product not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const product = await this.repo.findById(id);
    if (!product) throw new Error('Product not found');
    await this.repo.softDelete(id);
  }

  async list(
    filter: ProductFilter,
    pagination: Pagination,
    sort: Sort
  ): Promise<{ items: Product[]; total: number }> {
    return this.repo.list(filter, pagination, sort);
  }

  async adjustStock(id: string, delta: number): Promise<Product> {
    const product = await this.repo.findById(id);
    if (!product) throw new Error('Product not found');

    const updated = await this.repo.adjustQuantity(id, delta);
    if (!updated) throw new Error('Product not found');

    if (updated.quantity < 0) {
      // rollback
      await this.repo.adjustQuantity(id, -delta);
      throw new Error('Quantity cannot be negative');
    }

    return updated;
  }
}
