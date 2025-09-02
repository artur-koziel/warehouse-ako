import {
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  
  export abstract class BaseEntityWithDates {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt!: Date;
  
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt!: Date;
  
    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deletedAt?: Date | null;
  }
 