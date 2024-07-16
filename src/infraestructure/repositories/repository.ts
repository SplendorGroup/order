import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { IRepositoryContract } from '@/domain/interfaces/irepository';

@Injectable()
export class Repository implements IRepositoryContract {
  protected logger = new Logger(Repository.name);

  private readonly model: any;

  constructor(
    private readonly prisma: PrismaClient | any,
    private readonly model_name: string,
  ) {
    if (!(this.model_name in this.prisma)) {
      throw new InternalServerErrorException(`Invalid model name:  ${this.model_name} `);
    }
    this.model = this.prisma[String(this.model_name).toLowerCase()];
    this.logger.verbose(`[${this.model_name.toLocaleUpperCase()} INITIALIZE] `);
  }

  async createMany(data: unknown[]) {
    try {
      const created_record = await this.model?.createMany({
        data,
      });
      return created_record as any[];
    } catch (error) {
      this.logger.error(`[${this.model_name.toLocaleUpperCase()} CREATE MANY]`, error);
      throw new InternalServerErrorException(`Failed to create record: ${error.message}`);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const created_record = await this.model?.create({
        data,
      });
      return created_record;
    } catch (error) {
      this.logger.error(`[${this.model_name.toLocaleUpperCase()} CREATE]`, error);
      throw new InternalServerErrorException(`Failed to create record: ${error.message}`);
    }
  }

  async findOne(filter: any): Promise<any> {
    try {
      const found_record = await this.model?.findFirst({
        where: filter,
      });
      return found_record;
    } catch (error) {
      this.logger.error(`[${this.model_name.toLocaleUpperCase()} FIND ONE]`, error);
      return null;
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const found_record = await this.model?.findUnique({
        where: { id },
      });
      return found_record;
    } catch (error) {
      this.logger.error(`[${this.model_name.toLocaleUpperCase()} FIND BY ID]`, error);
      return null;
    }
  }

  async findAll(
    filter?: {
      skip?: number;
      orderBy?: Record<string, string>[];
      take?: number;
      start_date?: string;
      end_date?: string;
    } & Partial<unknown>,
  ): Promise<unknown[]> {
    if (filter?.skip) {
      filter.skip = (filter?.skip - 1) * Number(filter?.take ?? process.env.PAGE_LIMIT ?? 0);
    }

    try {
      if (filter?.start_date) {
        filter.start_date = new Date(filter?.start_date).toISOString();
        filter.start_date = new Date(filter?.start_date).toISOString();
      }

      if (filter?.end_date) {
        filter.end_date = new Date(filter?.end_date).toISOString();
        filter.end_date = new Date(filter?.end_date).toISOString();
      }

      const { skip, take, start_date, end_date, orderBy, ...where } = filter ?? {
        skip: undefined,
        take: undefined,
      };

      let whereDate = {};
      if (start_date && end_date) {
        whereDate = {
          AND: [
            {
              OR: [{ created_at: { gte: start_date } }, { updated_at: { gte: start_date } }],
            },
            {
              OR: [{ created_at: { lte: end_date } }, { updated_at: { lte: end_date } }],
            },
          ],
        };
      }

      if (start_date) {
        whereDate = {
          OR: [{ created_at: { gte: start_date } }, { updated_at: { gte: start_date } }],
        };
      }

      if (end_date) {
        whereDate = {
          OR: [{ created_at: { lte: end_date } }, { updated_at: { lte: end_date } }],
        };
      }

      if (skip !== undefined && take !== undefined) {
        const all_records = await this.model?.findMany({
          orderBy,
          where: { ...this.applyCaseInsensitiveFilters(where), ...whereDate },
          skip,
          take,
        });
        return all_records;
      }

      const all_records = await this.model?.findMany({
        orderBy,
        where: this.applyCaseInsensitiveFilters(where),
      });
      return all_records;
    } catch (error) {
      this.logger.error(`[${this.model_name.toLocaleUpperCase()} FIND ALL]`, error);
      return [];
    }
  }

  async update(id: string, data: Partial<unknown>): Promise<unknown> {
    try {
      const updated_record = await this.model?.update({
        where: { id },
        data,
      });
      return updated_record;
    } catch (error) {
      this.logger.error(`[${this.model_name.toLocaleUpperCase()} UPDATE]`, error);
      return [];
    }
  }

  async updateMany(filter: Partial<unknown>, data: Partial<unknown>): Promise<unknown> {
    try {
      const updated_record = await this.model?.updateMany({
        where: filter,
        data,
      });
      return updated_record;
    } catch (error) {
      this.logger.error(`[${this.model_name.toLocaleUpperCase()} UPDATE MANY]`, error);
      return [];
    }
  }

  async findByIdWithRelations(id: string, relations: any[]): Promise<unknown> {
    try {
      const foundRecord = await this.model?.findUnique({
        where: { id },
        include: this.mapRelations(relations),
      });
      return foundRecord;
    } catch (error) {
      this.logger.error(
        `[${this.model_name.toLocaleUpperCase()} FIND BY ID WITH RELATIONS]`,
        error,
      );
      return null;
    }
  }

  async findAllWithRelations(
    relations: any[],
    filter?: {
      skip?: number;
      take?: number;
      orderBy?: Record<string, string>[];
      start_date?: string;
      end_date?: string;
      include?: Record<string, any>;
    } & Partial<any>,
  ): Promise<any> {
    try {
      if (filter?.skip) {
        filter.skip = (filter?.skip - 1) * Number(filter?.take ?? process.env.PAGE_LIMIT ?? 0);
      }

      if (filter?.start_date) {
        filter.start_date = new Date(filter?.start_date).toISOString();
        filter.start_date = new Date(filter?.start_date).toISOString();
      }

      if (filter?.end_date) {
        filter.end_date = new Date(filter?.end_date).toISOString();
        filter.end_date = new Date(filter?.end_date).toISOString();
      }

      const { skip, take, start_date, end_date, orderBy, include, ...where } = filter || {};
      const includeRelations = this.mapRelations(relations);

      let whereDate = {};
      if (start_date && end_date) {
        whereDate = {
          AND: [
            {
              OR: [{ created_at: { gte: start_date } }, { updated_at: { gte: start_date } }],
            },
            {
              OR: [{ created_at: { lte: end_date } }, { updated_at: { lte: end_date } }],
            },
          ],
        };
      }

      if (start_date) {
        whereDate = {
          OR: [{ created_at: { gte: start_date } }, { updated_at: { gte: start_date } }],
        };
      }

      if (end_date) {
        whereDate = {
          OR: [{ created_at: { lte: end_date } }, { updated_at: { lte: end_date } }],
        };
      }

      if (skip !== undefined && take !== undefined) {
        const allRecords = await this.model?.findMany({
          orderBy,
          where: { ...where, ...whereDate },
          include: {
            ...includeRelations,
            ...include,
          },
          skip,
          take,
        });
        return allRecords;
      }
      const allRecords = await this.model?.findMany({
        orderBy,
        where,
        include: {
          ...includeRelations,
          ...include,
        },
      });
      return allRecords;
    } catch (error) {
      this.logger.error(`[${this.model_name.toLocaleUpperCase()} FIND ALL WITH RELATIONS]`, error);
      return [];
    }
  }

  async findOneWithRelations(
    relations: any[],
    filter?: {
      skip?: number;
      take?: number;
      include?: Record<string, any>;
    } & Partial<any>,
  ): Promise<any> {
    try {
      const { skip, take, include, ...where } = filter || {};
      const includeRelations = this.mapRelations(relations);

      if (skip !== undefined && take !== undefined) {
        const allRecords = await this.model?.findFirst({
          where,
          include: {
            ...includeRelations,
            ...include,
          },
        });
        return allRecords;
      }
      const allRecords = await this.model?.findFirst({
        where,
        include: {
          ...includeRelations,
          ...include,
        },
      });
      return allRecords;
    } catch (error) {
      return [];
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.model?.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`[${this.model_name.toLocaleUpperCase()} DELETE BY ID]`, error);
      throw new InternalServerErrorException(`Failed to delete record by ID: ${error.message}`);
    }
  }

  async deleteMany(filter: Partial<unknown>): Promise<void> {
    try {
      await this.model?.deleteMany({
        where: filter,
      });
    } catch (error) {
      this.logger.error(`[${this.model_name.toLocaleUpperCase()} DELETE MANY]`, error);
      throw new InternalServerErrorException(`Failed to delete multiple records: ${error.message}`);
    }
  }

  async count(filter: any): Promise<any> {
    try {
      if (filter?.start_date) {
        filter.start_date = new Date(filter?.start_date).toISOString();
        filter.start_date = new Date(filter?.start_date).toISOString();
      }

      if (filter?.end_date) {
        filter.end_date = new Date(filter?.end_date).toISOString();
        filter.end_date = new Date(filter?.end_date).toISOString();
      }

      let whereDate = {};

      if (filter.start_date && filter.end_date) {
        whereDate = {
          AND: [
            {
              OR: [
                { created_at: { gte: filter.start_date } },
                { updated_at: { gte: filter.start_date } },
              ],
            },
            {
              OR: [
                { created_at: { lte: filter.end_date } },
                { updated_at: { lte: filter.end_date } },
              ],
            },
          ],
        };
      }

      if (filter.start_date) {
        whereDate = {
          OR: [
            { created_at: { gte: filter.start_date } },
            { updated_at: { gte: filter.start_date } },
          ],
        };
      }

      if (filter.end_date) {
        whereDate = {
          OR: [{ created_at: { lte: filter.end_date } }, { updated_at: { lte: filter.end_date } }],
        };
      }

      delete filter?.start_date;
      delete filter?.end_date;

      const found_record = await this.model?.count({
        where: {
          ...this.applyCaseInsensitiveFilters(filter),
          ...whereDate,
        },
      });
      return found_record;
    } catch (error) {
      this.logger.error(`[${this.model_name.toLocaleUpperCase()} COUNT]`, error);
      return null;
    }
  }

  private mapRelations(relations: string[]): Record<string, any> {
    const result: Record<string, any> = {};

    for (const relation of relations) {
      const nestedRelations = relation.split('.');
      let currentAcc = result;

      for (let i = 0; i < nestedRelations.length; i++) {
        const nestedRelation = nestedRelations[i];

        if (nestedRelation !== '') {
          if (!currentAcc[nestedRelation]) {
            currentAcc[nestedRelation] = i === nestedRelations.length - 1 ? true : { include: {} };
          } else if (i === nestedRelations.length - 1 && currentAcc[nestedRelation] !== true) {
            const include = currentAcc[nestedRelation].include || {};
            currentAcc[nestedRelation].include = {
              ...include,
              [nestedRelation]: true,
            };
          }

          currentAcc = currentAcc[nestedRelation].include || {};
        }
      }
    }
    return result;
  }

  private applyCaseInsensitiveFilters(filter: any): any {
    const transformed_filter: any = {};
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        const value = filter[key];
        if (typeof value === 'string') {
          transformed_filter[key] = { contains: value, mode: 'insensitive' };
        } else if (typeof value === 'object' && value !== null) {
          transformed_filter[key] = this.applyCaseInsensitiveFilters(value);
        } else {
          transformed_filter[key] = value;
        }
      }
    }
    return transformed_filter;
  }
}
