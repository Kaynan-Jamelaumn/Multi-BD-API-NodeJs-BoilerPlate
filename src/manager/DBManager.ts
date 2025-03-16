// src/manager/DBManager.ts

import { ModelStatic } from 'sequelize';
import { Model as MongooseModel, Document } from 'mongoose';

export abstract class DBManager<T extends { id?: string | number; isActive?: boolean }> {
  constructor(protected model: ModelStatic<any> | MongooseModel<any>) {
    if (new.target === DBManager) {
      throw new Error("DBManager is abstract and cannot be instantiated");
    }
  }

  abstract create(data: Partial<T>): Promise<T>;
  abstract find(query: object, options?: any): Promise<T[]>;
  abstract findOne(query: object, options?: any): Promise<T | null>;
  abstract findById(id: string | number, options?: any): Promise<T | null>;
  abstract findAndCount(query: object, options?: any): Promise<{ count: number; rows: T[] }>;
  abstract update(id: string | number | object, data: Partial<T>): Promise<T | null>; // Allow id or query
  abstract delete(id: string | number): Promise<void>;
  abstract softDelete(id: string | number): Promise<T | null>;
  abstract reactivate(id: string | number): Promise<T | null>;
  abstract buildSearchQuery(searchTerm: string, fields: string[]): object;
  abstract buildSort(sortBy: string, order: 'ASC' | 'DESC'): object;
}
