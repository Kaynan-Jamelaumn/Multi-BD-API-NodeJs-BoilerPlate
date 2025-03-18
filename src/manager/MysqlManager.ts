// src/manager/MysqlManager.ts

import { ModelStatic, WhereOptions, Op, FindAttributeOptions } from 'sequelize';
import { DBManager } from './DBManager.js';
import { MysqlModel } from '../types/models.js';
import { SequelizeFindOptions } from '../types/find-options.js';

export class MySQLManager<T extends MysqlModel> extends DBManager<T> {
  private Op: typeof Op;

  constructor(model: ModelStatic<T>) {
    super(model);

    if (!model.sequelize) {
      throw new Error('Sequelize instance is not defined on the model');
    }

    this.Op = Op;
  }

  async create(data: Partial<T['_creationAttributes']>): Promise<T> {
    return (this.model as ModelStatic<T>).create(
      data as T['_creationAttributes'],
      { returning: true }
    );
  }

  async find(query: WhereOptions<T>, options: SequelizeFindOptions = {}): Promise<T[]> {
    const attributes: FindAttributeOptions | undefined = options.exclude
      ? { exclude: options.exclude }
      : undefined;

    return (this.model as ModelStatic<T>).findAll({
      where: query,
      attributes,
      order: options.sort,
      offset: options.offset,
      limit: options.limit,
    });
  }

  async findOne(query: WhereOptions<T>, options: SequelizeFindOptions = {}): Promise<T | null> {
    const attributes: FindAttributeOptions | undefined = options.exclude
      ? { exclude: options.exclude }
      : undefined;

    return (this.model as ModelStatic<T>).findOne({
      where: query,
      attributes,
    });
  }

  async findById(id: string | number, options: SequelizeFindOptions = {}): Promise<T | null> {
    const attributes: FindAttributeOptions | undefined = options.exclude
      ? { exclude: options.exclude }
      : undefined;

    return (this.model as ModelStatic<T>).findByPk(id, {
      attributes,
    });
  }

  async findAndCount(query: WhereOptions<T>, options: Omit<SequelizeFindOptions, 'exclude'> = {}): Promise<{ count: number; rows: T[] }> {
    return (this.model as ModelStatic<T>).findAndCountAll({
      where: query,
      ...options,
    });
  }
  async update(id: string | number | object, data: Partial<T>): Promise<T | null> {
    if (typeof id === 'object') {
      // Handle query-based update
      const records = await this.find(id as WhereOptions<T>); 
      if (records.length === 0) {
        return null; // No records found
      }
  
      await (this.model as ModelStatic<T>).update(data, {
        where: id as WhereOptions<T>, 
      });
  
      // Return the first updated record (if needed)
      return records[0];
    } else {
      // Handle id-based update
      const record = await this.findById(id);
      if (!record) {
        return null; // Record not found
      }
  
      await record.update(data); // Update the record directly
      return record;
    }
  }

  async delete(id: string | number): Promise<void> {
    await (this.model as ModelStatic<T>).destroy({ where: { id: id as any } });
  }

  async softDelete(id: string | number): Promise<T | null> {
    return this.update(id, { isActive: false } as Partial<T>);
  }

  async reactivate(id: string | number): Promise<T | null> {
    return this.update(id, { isActive: true } as Partial<T>);
  }

  buildSearchQuery(searchTerm: string, fields: string[]): WhereOptions<T> {
    return {
      [this.Op.or]: fields.map((field) => ({
        [field]: { [this.Op.like]: `%${searchTerm}%` },
      })),
    } as WhereOptions<T>;
  }

  buildSort(sortBy: string, order: 'ASC' | 'DESC'): [string, 'ASC' | 'DESC'][] {
    return [[sortBy, order.toUpperCase() as 'ASC' | 'DESC']];
  }
}
