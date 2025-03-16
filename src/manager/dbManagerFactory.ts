// src/manager/db<amagerFactory.ts

import { MongoDBManager } from './MongoDBManager.js';
import { MySQLManager } from './MysqlManager.js';
import { ModelStatic } from 'sequelize';
import { Model } from 'mongoose';
import { MysqlModel, MongoModel, isMysqlModel, isMongoModel, MysqlModelStatic, MongoModelType } from '../types/models.js';
import { DBManager } from './DBManager.js';


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
  if (isMongoModel(model)) {
    return new MongoDBManager(model); // Return MongoDBManager for Mongoose models
  } else if (isMysqlModel(model)) {
    return new MySQLManager(model); // Return MySQLManager for Sequelize models
  } else {
    throw new Error("Unsupported model type");
  }
}