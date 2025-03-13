import { Model, Document } from 'mongoose';
import { DBManager } from './DBManager.js';
import { MongoModel } from '../types/models.js';

interface FindOptions {
  exclude?: string[];
  sort?: Record<string, 1 | -1>;
  skip?: number;
  limit?: number;
}

export class MongoDBManager<T extends MongoModel> extends DBManager<T> {
  constructor(model: Model<T>) {
    super(model);
  }
  async create(data: Partial<T>): Promise<T> {
    return (this.model as Model<T>).create(data);
  }

  async find(query: object, options: FindOptions = {}): Promise<T[]> {
    return (this.model as Model<T>)
      .find(query)
      .select(options.exclude?.reduce((acc, field) => ({ ...acc, [field]: 0 }), {}) || {})
      .sort(options.sort)
      .skip(options.skip || 0)
      .limit(options.limit || 0)
      .exec();
  }

  async findOne(query: object, options: FindOptions = {}): Promise<T | null> {
    return (this.model as Model<T>)
      .findOne(query)
      .select(options.exclude?.reduce((acc, field) => ({ ...acc, [field]: 0 }), {}) || {})
      .exec();
  }

  async findById(id: string | number, options: FindOptions = {}): Promise<T | null> {
    return (this.model as Model<T>)
      .findById(id)
      .select(options.exclude?.reduce((acc, field) => ({ ...acc, [field]: 0 }), {}) || {})
      .exec();
  }

  async findAndCount(query: object, options: FindOptions = {}): Promise<{ count: number; rows: T[] }> {
    const [rows, count] = await Promise.all([
      this.find(query, options),
      (this.model as Model<T>).countDocuments(query).exec()
    ]);
    return { count, rows };
  }

  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    return (this.model as Model<T>).findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string | number): Promise<void> {
    await (this.model as Model<T>).findByIdAndDelete(id).exec();
  }

  async softDelete(id: string | number): Promise<T | null> {
    return this.update(id, { isActive: false } as Partial<T>);
  }

  async reactivate(id: string | number): Promise<T | null> {
    return this.update(id, { isActive: true } as Partial<T>);
  }

  buildSearchQuery(searchTerm: string, fields: string[]): object {
    return {
      $or: fields.map(field => ({
        [field]: { $regex: searchTerm, $options: "i" }
      }))
    };
  }

  buildSort(sortBy: string, order: 'ASC' | 'DESC'): object {
    return { [sortBy]: order === 'DESC' ? -1 : 1 };
  }
}