import { ModelStatic, WhereOptions } from 'sequelize';
import { DBManager } from './DBManager';
import { MysqlModel } from '../types/models';
import { SequelizeFindOptions } from '../types/find-options';
export declare class MySQLManager<T extends MysqlModel> extends DBManager<T> {
    private Op;
    constructor(model: ModelStatic<T>);
    create(data: Partial<T['_creationAttributes']>): Promise<T>;
    find(query: WhereOptions<T>, options?: SequelizeFindOptions): Promise<T[]>;
    findOne(query: WhereOptions<T>, options?: SequelizeFindOptions): Promise<T | null>;
    findById(id: string | number, options?: SequelizeFindOptions): Promise<T | null>;
    findAndCount(query: WhereOptions<T>, options?: Omit<SequelizeFindOptions, 'exclude'>): Promise<{
        count: number;
        rows: T[];
    }>;
    update(id: string | number | object, data: Partial<T>): Promise<T | null>;
    delete(id: string | number): Promise<void>;
    softDelete(id: string | number): Promise<T | null>;
    reactivate(id: string | number): Promise<T | null>;
    buildSearchQuery(searchTerm: string, fields: string[]): WhereOptions<T>;
    buildSort(sortBy: string, order: 'ASC' | 'DESC'): [string, 'ASC' | 'DESC'][];
}
