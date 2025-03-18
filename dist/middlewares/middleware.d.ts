import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
export declare const databaseMiddleware: (mongooseConnection: mongoose.Connection, sequelize: Sequelize, DB_TYPE: string) => (req: Request, res: Response, next: NextFunction) => void;
export declare const middleWareGlobal: (req: Request, res: Response, next: NextFunction) => void;
export declare const checkCSRFError: (err: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const testMiddleware: (req: Request, res: Response, next: NextFunction) => void;
