// src/types/database.d.ts

import { Sequelize } from "sequelize";
import { Mongoose } from "mongoose";

export interface DatabaseConfig {
  sequelize?: Sequelize;
  mongoose?: Mongoose;
  DB_TYPE: 'mysql' | 'mongo';
}

export interface BaseModel {
  createdAt?: Date;
  updatedAt?: Date;
}