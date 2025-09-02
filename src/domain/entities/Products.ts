import { Entity, Column, Index } from 'typeorm';
import { BaseEntityWithDates } from './index';

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity({ name: 'products' })
export class Product extends BaseEntityWithDates {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  sku!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  price!: string;

  @Column({ type: 'varchar', length: 3, default: 'PLN' })
  currency!: string;

  @Column({ type: 'int', default: 0 })
  quantity!: number;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status!: ProductStatus;
}
