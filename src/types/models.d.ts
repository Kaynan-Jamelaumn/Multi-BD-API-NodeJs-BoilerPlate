// src/types/models.d.ts
import { Model as SequelizeModel, ModelStatic } from 'sequelize';
import { Document, Model as MongooseModel } from 'mongoose';
import { BaseModel } from './database.js';

// Sequelize Types
export interface MysqlModel extends SequelizeModel, BaseModel {
  id?: number;
  isActive?: boolean;
  [key: string]: any;
}

export type MysqlModelStatic = ModelStatic<MysqlModel> & {
  associate?: (models: Record<string, ModelStatic<SequelizeModel>>) => void;
};

// Mongoose Types
export interface MongoModel extends Document, BaseModel {
  id: string;
  isActive?: boolean;
}

export type MongoModelType = MongooseModel<MongoModel>;

// Union type for generic model handling
export type Model = MysqlModelStatic | MongoModelType;

// Type guard to check if the model is a MongoModelType
export function isMongoModel(model: any): model is MongoModelType {
  return (model as MongoModelType).schema !== undefined; // Check for a Mongoose-specific property
}

// Type guard to check if the model is a MysqlModelStatic
export function isMysqlModel(model: any): model is MysqlModelStatic {
  return (model as MysqlModelStatic).tableName !== undefined; // Check for a Sequelize-specific property
}
