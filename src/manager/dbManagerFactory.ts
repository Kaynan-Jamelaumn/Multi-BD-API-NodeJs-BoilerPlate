// src/manager/db<amagerFactory.ts

import { MongoDBManager } from './MongoDBManager';
import { MySQLManager } from './MysqlManager';
import { ModelStatic } from 'sequelize';
import { Model } from 'mongoose';
import { MysqlModel, MongoModel, MysqlModelStatic, MongoModelType } from '../types/models';
import { DBManager } from './DBManager';


// Overload for MongoDB: when the model is a Mongoose model of MongoModel
export function getDBManager<T extends MongoModel>(
  model: Model<T>
): MongoDBManager<T>;

// Overload for MySQL: when the model is a Sequelize ModelStatic of MysqlModel
export function getDBManager<T extends MysqlModel>(
  model: ModelStatic<T>
): MySQLManager<T>;

// Overload for the union type (MysqlModelStatic | MongoModelType)
export function getDBManager(model: MysqlModelStatic | MongoModelType): DBManager<any>;

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


// export function getDBManager(model: any): DBManager<any> {
//   if (isMongoModel(model)) {
//     return new MongoDBManager(model); // Return MongoDBManager for Mongoose models
//   } else if (isMysqlModel(model)) {
//     return new MySQLManager(model); // Return MySQLManager for Sequelize models
//   } else {
//     throw new Error("Unsupported model type");
//   }
// }