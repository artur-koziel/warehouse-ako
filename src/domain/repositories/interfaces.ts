import { Product, ProductStatus } from '../entities';

export type Pagination = { page: number; limit: number };
export type Sort = { sortBy?: keyof Product; sortDir?: 'asc' | 'desc' };
export type ProductFilter = { search?: string; status?: ProductStatus[]; sku?: string };

export type CreateProductAttributes = {
  sku: string; name: string; description?: string|null;
  price: string; currency: string; quantity: number; status: ProductStatus;
};

export type UpdateProductPatch = Partial<{
  sku: string; name: string; description: string|null;
  price: string; currency: string; quantity: number; status: ProductStatus;
}>;

export interface IProductRepository {
  create(p: CreateProductAttributes): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  update(id: string, patch: UpdateProductPatch): Promise<Product | null>;
  softDelete(id: string): Promise<void>;
  list(filter: ProductFilter, pag: Pagination, sort: Sort): Promise<{ items: Product[]; total: number }>;
  adjustQuantity(id: string, delta: number): Promise<Product | null>;
}
