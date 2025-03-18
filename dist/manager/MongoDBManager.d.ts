import { Model } from 'mongoose';
import { DBManager } from './DBManager';
import { MongoModel } from '../types/models';
interface FindOptions {
    exclude?: string[];
    sort?: Record<string, 1 | -1>;
    skip?: number;
    limit?: number;
}
export declare class MongoDBManager<T extends MongoModel> extends DBManager<T> {
    constructor(model: Model<T>);
    create(data: Partial<T>): Promise<T>;
    find(query: object, options?: FindOptions): Promise<T[]>;
    findOne(query: object, options?: FindOptions): Promise<T | null>;
    findById(id: string | number, options?: FindOptions): Promise<T | null>;
    findAndCount(query: object, options?: FindOptions): Promise<{
        count: number;
        rows: T[];
    }>;
    update(id: string | number | object, data: Partial<T>): Promise<T | null>;
    delete(id: string | number): Promise<void>;
    softDelete(id: string | number): Promise<T | null>;
    reactivate(id: string | number): Promise<T | null>;
    buildSearchQuery(searchTerm: string, fields: string[]): object;
    buildSort(sortBy: string, order: 'ASC' | 'DESC'): object;
}
export {};
