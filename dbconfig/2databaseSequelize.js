import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(
    process.env.DB_NAME || "database", // Database name, with fallback to "database".
    process.env.DB_USER || "root", // Database user, with fallback to "root".
    process.env.DB_PASSWORD || "", // Database password, with fallback to empty string.
    {
        host: process.env.DB_HOST || "localhost", // Database host, with fallback to "localhost".
        port: process.env.DB_PORT || 3306,
        dialect: "mysql", // Set the dialect to MySQL.
        logging: process.env.NODE_ENV === "development" ? console.log : false, // Enable logging in development.
        retry: {
            max: 5, // Set the maximum retries for Sequelize connection.
            timeout: 60000, // Set the timeout for each retry attempt.
        },
    }
);

export default sequelize;