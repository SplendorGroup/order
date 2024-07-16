import { order } from '@prisma/client';

export type ModelName = 'order';

export type PrismaModels = {
  order: order;
};

export type ModelType<M extends keyof PrismaModels> = PrismaModels[M];

interface Data {
  order: order;
}

interface PrismaRelations {
  order: order;
}

type PrismaRelationPayload<T extends keyof PrismaRelations> = PrismaRelations[T];

export type DataType<T extends keyof Data> = Data[T];

export interface IRepository<T extends keyof Data> {
  create: (data: Partial<DataType<T>>) => Promise<DataType<T>>;
  createMany: (data: Partial<DataType<T>>[]) => Promise<DataType<T>[]>;
  findOne: (filter: Partial<DataType<T>>) => Promise<DataType<T> | null>;
  findById: (id: string) => Promise<DataType<T> | null>;
  findAll: (
    filter?: { skip?: number; take?: number } & Partial<DataType<T>>,
  ) => Promise<DataType<T>[]>;
  findByIdWithRelations: (
    id: string,
    relations: string[],
  ) => Promise<PrismaRelationPayload<T> | null>;
  findOneWithRelations: (
    relations: string[],
    filter?: {
      skip?: number;
      take?: number;
      include?: Record<string, any>;
    } & Partial<DataType<any>>,
  ) => Promise<PrismaRelationPayload<T>>;
  findAllWithRelations: (
    relations: any[],
    filter?: {
      skip?: number;
      take?: number;
      orderBy?: Record<string, string>[];
      start_date?: string;
      end_date?: string;
      include?: Record<string, any>;
    } & Partial<DataType<any>>,
  ) => Promise<PrismaRelationPayload<T>[]>;
  update: (id: string, data: Partial<DataType<T>>) => Promise<T | null>;
  updateMany: (filter: Partial<DataType<T>>, data: Partial<DataType<T>>) => Promise<T[]>;
  deleteById: (id: string) => Promise<void>;
  deleteMany: (filter: Partial<DataType<T>>) => Promise<void>;
  count: (filter: Partial<unknown>) => Promise<number | null>;
}

export interface IRepositoryContract {
  create: (data: unknown) => Promise<unknown>;
  createMany: (data: unknown[]) => Promise<any[]>;
  findOne: (filter: Partial<unknown>) => Promise<unknown | null>;
  findById: (id: string) => Promise<unknown | null>;
  findAll: (filter: Partial<unknown>) => Promise<unknown[]>;
  findOneWithRelations: (
    filter: Partial<unknown>,
    relations: string[],
  ) => Promise<unknown | null>;
  findByIdWithRelations: (
    id: string,
    relations: string[],
  ) => Promise<unknown | null>;
  findAllWithRelations: (
    relations: string[],
    filter?: Partial<any>,
  ) => Promise<any>;
  update: (id: string, data: Partial<unknown>) => Promise<unknown | null>;
  updateMany: (
    filter: Partial<unknown>,
    data: Partial<unknown>,
  ) => Promise<unknown | null>;
  deleteById: (id: string) => Promise<void>;
  deleteMany: (filter: Partial<unknown>) => Promise<void>;
  count: (filter: Partial<unknown>) => Promise<number | null>;
}
