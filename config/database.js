// config/database.js
import mongoose from "mongoose";
import { Sequelize } from "sequelize";

export async function connectToDatabase(DB_TYPE, mongoConnectionString, logger) {
    const maxRetries = 5;
    let retries = 0;

    const connectWithRetry = async (connectFunction, loggerInfo, loggerError, errorMessage) => {
        while (retries < maxRetries) {
            try {
                logger.info(loggerInfo);
                await connectFunction();
                logger.info(`${loggerInfo} connected!`);
                return;
            } catch (error) {
                retries++;
                logger.error(`${loggerError} attempt ${retries} failed:`, error);
                await new Promise((resolve) => setTimeout(resolve, 5000));
            }
        }
        throw new Error(errorMessage);
    };

    if (DB_TYPE === "mongo") {
        await connectWithRetry(
            () => mongoose.connect(mongoConnectionString),
            "MongoDB",
            "MongoDB connection",
            "Failed to connect to MongoDB after multiple attempts"
        );
    } else if (DB_TYPE === "mysql") {
        const sequelize = new Sequelize(
            process.env.DB_NAME || "database",
            process.env.DB_USER || "root",
            process.env.DB_PASSWORD || "",
            {
                host: process.env.DB_HOST || "localhost",
                dialect: "mysql",
                logging: process.env.NODE_ENV === "development" ? console.log : false,
                retry: {
                    max: 5,
                    timeout: 60000,
                },
            }
        );
        await connectWithRetry(
            () => sequelize.authenticate(),
            "MySQL",
            "MySQL connection",
            "Failed to connect to MySQL after multiple attempts"
        );
        return sequelize;
    } else {
        throw new Error(`Unsupported database type: ${DB_TYPE}`);
    }
}