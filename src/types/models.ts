// types/models.ts
import { Sequelize, Model, ModelStatic } from 'sequelize';
import { Document, Model as MongooseModel } from 'mongoose';

export interface BaseModel {
  id?: number | string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Sequelize types
export interface MysqlModel extends Model {
  isActive?: boolean;
}

export type MysqlModelStatic = ModelStatic<MysqlModel> & {
  associate?: (models: Record<string, ModelStatic<Model>>) => void;
};

// Mongoose types
export interface MongoModel extends Document {
  isActive?: boolean;
  save: () => Promise<this>;
}

export type MongoModelType = MongooseModel<MongoModel>;