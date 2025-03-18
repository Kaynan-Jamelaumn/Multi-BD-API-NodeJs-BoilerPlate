import { Express } from 'express';
import mongoose from "mongoose";
import winston from "winston";
declare class App {
    app: Express;
    DB_TYPE: 'mysql' | 'mongo';
    mongoConnectionString: string;
    sequelize: any;
    mongoose: typeof mongoose;
    logger: winston.Logger;
    port: number | null;
    https: boolean;
    host: string | null;
    modelsPath: string;
    private server;
    private io;
    constructor();
    getDBType(envValue: string | undefined): 'mysql' | 'mongo';
    connectToDatabase(): Promise<void>;
    syncModels(): Promise<void>;
    setupSessionAndFlash(): Promise<void>;
    setupCSRFProtection(): void;
    setupGlobalMiddlewaresAndRoutes(): void;
    start(httpsEnabled: boolean, host: string, port: number): Promise<void>;
}
declare const appInstance: App;
export declare const logger: winston.Logger;
export default appInstance;
