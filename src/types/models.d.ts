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