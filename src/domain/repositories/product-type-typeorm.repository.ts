import { inject, injectable } from 'tsyringe';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../entities';
import {
  IProductRepository, ProductFilter, Pagination, Sort,
  CreateProductAttributes, UpdateProductPatch
} from './index';

@injectable()
export class ProductTypeOrmRepository implements IProductRepository {
  private readonly repo: Repository<Product>;
  constructor(@inject('DataSource') dataSource: DataSource) {
    this.repo = dataSource.getRepository(Product);
  }

  async create(attributes: CreateProductAttributes): Promise<Product> {
    const entity = this.repo.create(attributes);
    return this.repo.save(entity);
  }
  findById(id: string) { return this.repo.findOne({ where: { id } }); }
  findBySku(sku: string) { return this.repo.findOne({ where: { sku } }); }

  async update(id: string, patch: UpdateProductPatch) {
    await this.repo.update({ id }, patch);
    return this.findById(id);
  }
  async softDelete(id: string) { await this.repo.softDelete({ id }); }

  async list(filter: ProductFilter, { page, limit }: Pagination, sort: Sort) {
    const queryBuilder = this.repo.createQueryBuilder('p').where('p.deletedAt IS NULL');
    if (filter.search) queryBuilder.andWhere('(p.name ILIKE :q OR p.sku ILIKE :q OR p.description ILIKE :q)', { q: `%${filter.search}%` });
    if (filter.status?.length) queryBuilder.andWhere('p.status = ANY(:statuses)', { statuses: filter.status });
    if (filter.sku) queryBuilder.andWhere('p.sku = :sku', { sku: filter.sku });

    const pagination = Math.max(1, page || 1);
    const limitValue = Math.min(100, Math.max(1, limit || 20));
    const allowed: (keyof Product)[] = ['name','sku','price','quantity','createdAt','updatedAt','status'];
    const by = sort.sortBy && allowed.includes(sort.sortBy) ? `p.${String(sort.sortBy)}` : 'p.createdAt';
    const direction = sort.sortDir === 'asc' ? 'ASC' : 'DESC';

    queryBuilder.orderBy(by, direction).skip((pagination - 1) * limitValue).take(limit);
    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  async adjustQuantity(id: string, delta: number) {
    await this.repo.createQueryBuilder().update(Product)
      .set({ quantity: () => `quantity + ${Math.trunc(delta)}` })
      .where('id = :id', { id }).execute();
    return this.findById(id);
  }
}
