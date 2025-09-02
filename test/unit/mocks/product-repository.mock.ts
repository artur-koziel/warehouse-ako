import {
    IProductRepository,
    CreateProductAttributes,
    UpdateProductPatch,
    Pagination,
    ProductFilter,
    Sort,
  } from '../../../src/domain/repositories/interfaces';
  import { Product } from '../../../src/domain/entities';
  
  export function createProductRepoMock(): jest.Mocked<IProductRepository> {
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
  