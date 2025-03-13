import { MongoDBManager } from './MongoDBManager.js';
import { MySQLManager } from './MysqlManager.js';
import { ModelStatic } from 'sequelize';
import { Model } from 'mongoose';
import { MysqlModel, MongoModel } from '../types/models.js';
import { DBManager } from './DBManager.js';

// Overload for MongoDB: when the model is a Mongoose model of MongoModel
export function getDBManager<T extends MongoModel>(
  model: Model<T>
): MongoDBManager<T>;

// Overload for MySQL: when the model is a Sequelize ModelStatic of MysqlModel
export function getDBManager<T extends MysqlModel>(
  model: ModelStatic<T>
): MySQLManager<T>;

// Implementation signature
export function getDBManager(model: any): DBManager<any> {
  switch (process.env.DB_TYPE) {
    case "mongo":
      return new MongoDBManager(model);
    case "mysql":
      return new MySQLManager(model);
    default:
      throw new Error("Invalid DB_TYPE");
  }
}