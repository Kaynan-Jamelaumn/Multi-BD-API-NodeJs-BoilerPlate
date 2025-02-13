// app.js
import express from "express";
import winston from "winston";
import { loadEnv } from "./config/env.js";
import { connectToDatabase } from "./config/database.js";
import { setupSessionAndFlash } from "./config/session.js";
import { setupCSRFProtection } from "./config/csrf.js";
import { setupGlobalMiddlewaresAndRoutes } from "./config/middlewares.js";

export class App {
    constructor() {
        this.app = express();
        this.DB_TYPE = process.env.DB_TYPE || "mongo";
        this.mongoConnectionString = process.env.DBCONNECTIONSTRING || "mongodb://localhost:27017/test";
        this.sequelize = null;
        this.logger = winston.createLogger({
            level: "info",
            format: winston.format.json(),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: "error.log", level: "error" }),
                new winston.transports.File({ filename: "combined.log" }),
            ],
        });
        this.port = null;
    }

    async start(port) {
        this.port = port;
        loadEnv();

        try {
            this.sequelize = await connectToDatabase(this.DB_TYPE, this.mongoConnectionString, this.logger);
            setupSessionAndFlash(this.app, this.DB_TYPE, mongoose.connection, this.sequelize);
            setupCSRFProtection(this.app);
            setupGlobalMiddlewaresAndRoutes(this.app, this.port);

            this.app.listen(port, () => {
                this.logger.info(`Server running on http://localhost:${port}`);
            });
        } catch (error) {
            this.logger.error("Failed to initialize:", error);
        }
    }
}

const appInstance = new App();
export const logger = appInstance.logger;
export default appInstance;