import { Model, ModelStatic, WhereOptions, Op, FindAttributeOptions } from 'sequelize';
import { DBManager } from './DBManager.js';
import { MysqlModel } from '../types/models.js';

interface FindOptions {
  exclude?: string[];
  sort?: [string, 'ASC' | 'DESC'][];
  offset?: number;
  limit?: number;
}

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

  async find(query: WhereOptions<T>, options: FindOptions = {}): Promise<T[]> {
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

  async findOne(query: WhereOptions<T>, options: FindOptions = {}): Promise<T | null> {
    const attributes: FindAttributeOptions | undefined = options.exclude
      ? { exclude: options.exclude }
      : undefined;

    return (this.model as ModelStatic<T>).findOne({
      where: query,
      attributes,
    });
  }

  async findById(id: string | number, options: FindOptions = {}): Promise<T | null> {
    const attributes: FindAttributeOptions | undefined = options.exclude
      ? { exclude: options.exclude }
      : undefined;

    return (this.model as ModelStatic<T>).findByPk(id, {
      attributes,
    });
  }

  async findAndCount(query: WhereOptions<T>, options: Omit<FindOptions, 'exclude'> = {}): Promise<{ count: number; rows: T[] }> {
    return (this.model as ModelStatic<T>).findAndCountAll({
      where: query,
      ...options,
    });
  }

  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    const record = await (this.model as ModelStatic<T>).findByPk(id);
    if (!record) return null;
    return record.update(data);
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
