// src/databaseSequelize

import { Sequelize } from 'sequelize';
import 'dotenv/config';

// Define an interface for the database configuration
interface DatabaseConfig {
  dbName: string;
  dbUser: string;
  dbPassword: string;
  dbHost: string;
  dbPort: number;
  dialect: 'mysql';
  logging: boolean | ((sql: string, timing?: number) => void);
  retry: {
    max: number;
    timeout: number;
  };
}

// Set up database configuration from environment variables or defaults
const dbConfig: DatabaseConfig = {
  dbName: process.env.DB_NAME || 'database', // Database name, with fallback to "database".
  dbUser: process.env.DB_USER || 'root', // Database user, with fallback to "root".
  dbPassword: process.env.DB_PASSWORD || '', // Database password, with fallback to empty string.
  dbHost: process.env.DB_HOST || 'localhost', // Database host, with fallback to "localhost".
  dbPort: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql', // Set the dialect to MySQL.
  logging: process.env.NODE_ENV === 'development' ? console.log : false, // Enable logging in development.
  retry: {
    max: 5, // Set the maximum retries for Sequelize connection.
    timeout: 60000, // Set the timeout for each retry attempt.
  },
};

// Initialize Sequelize with the configuration
const sequelize: Sequelize = new Sequelize(
  dbConfig.dbName,
  dbConfig.dbUser,
  dbConfig.dbPassword,
  {
    host: dbConfig.dbHost,
    port: dbConfig.dbPort,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    retry: dbConfig.retry,
  }
);

export default sequelize;