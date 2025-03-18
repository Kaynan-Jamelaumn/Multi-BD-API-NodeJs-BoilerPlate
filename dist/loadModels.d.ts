import { Logger } from 'winston';
import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
type MongooseType = typeof mongoose;
declare function loadModels(dbType: 'mysql' | 'mongo', sequelize: Sequelize, mongooseInstance: MongooseType, modelsPath: string, shouldLogModels: boolean | undefined, logger: Logger): Promise<void>;
export default loadModels;
