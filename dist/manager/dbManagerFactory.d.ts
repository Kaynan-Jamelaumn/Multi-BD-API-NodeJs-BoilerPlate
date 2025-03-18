import { MongoDBManager } from './MongoDBManager';
import { MySQLManager } from './MysqlManager';
import { ModelStatic } from 'sequelize';
import { Model } from 'mongoose';
import { MysqlModel, MongoModel, MysqlModelStatic, MongoModelType } from '../types/models';
import { DBManager } from './DBManager';
export declare function getDBManager<T extends MongoModel>(model: Model<T>): MongoDBManager<T>;
export declare function getDBManager<T extends MysqlModel>(model: ModelStatic<T>): MySQLManager<T>;
export declare function getDBManager(model: MysqlModelStatic | MongoModelType): DBManager<any>;
