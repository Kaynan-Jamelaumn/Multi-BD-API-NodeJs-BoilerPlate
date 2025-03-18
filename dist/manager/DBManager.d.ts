import { ModelStatic } from 'sequelize';
import { Model as MongooseModel } from 'mongoose';
export declare abstract class DBManager<T extends {
    id?: string | number;
    isActive?: boolean;
}> {
    protected model: ModelStatic<any> | MongooseModel<any>;
    constructor(model: ModelStatic<any> | MongooseModel<any>);
    abstract create(data: Partial<T>): Promise<T>;
    abstract find(query: object, options?: any): Promise<T[]>;
    abstract findOne(query: object, options?: any): Promise<T | null>;
    abstract findById(id: string | number, options?: any): Promise<T | null>;
    abstract findAndCount(query: object, options?: any): Promise<{
        count: number;
        rows: T[];
    }>;
    abstract update(id: string | number | object, data: Partial<T>): Promise<T | null>;
    abstract delete(id: string | number): Promise<void>;
    abstract softDelete(id: string | number): Promise<T | null>;
    abstract reactivate(id: string | number): Promise<T | null>;
    abstract buildSearchQuery(searchTerm: string, fields: string[]): object;
    abstract buildSort(sortBy: string, order: 'ASC' | 'DESC'): object;
}
