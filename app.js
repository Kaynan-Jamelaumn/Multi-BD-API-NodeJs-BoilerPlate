// Load environment variables from a .env file and expand any references to other variables
import "dotenv/config";
import dotenvExpand from "dotenv-expand";
dotenvExpand.expand(process.env);

// Import necessary modules for application setup
import path from "path"; // To handle file and directory paths
import { fileURLToPath } from "url"; // To work with URLs in ES modules

// Import third-party libraries for various functionalities

// Database
import express from "express"; // Web framework for routing and handling HTTP requests
import mongoose from "mongoose"; // MongoDB object modeling tool
import MongoStore from "connect-mongo"; // Session store for MongoDB
//import { Sequelize } from "sequelize";
import connectSessionSequelize from "connect-session-sequelize";

// Flash
import session from "express-session"; // Middleware for session management
import flash from "connect-flash"; // Flash messages for session-based notifications

// Security
import helmet from "helmet"; // Security headers middleware
import { doubleCsrf } from "csrf-csrf"; // CSRF protection middleware

// Rate Limiting & CORS
import rateLimit from "express-rate-limit"; // Rate limiting middleware
import cors from "cors"; // Cross-origin resource sharing middleware

// Cryptographic Functionality
import crypto from "crypto"; // Built-in module for cryptographic functionalities

// Logging
import winston from "winston";

// Import custom routes and middleware functions
import mainRouter from "./src/routes/routes.js";
import {
    middleWareGlobal,
    checkCSRFError,
} from "./src/middlewares/middleware.js";

// Resolve the current file and directory paths (for setting views and static files)
const __filename = fileURLToPath(import.meta.url); // Get the full path of the current module
const __dirname = path.dirname(__filename); // Get the directory name of the current module

// import { loadEnv } from "./config/env.js";
// import { connectToDatabase } from "./config/database.js";
// import { setupSessionAndFlash } from "./config/session.js";
// import { setupCSRFProtection } from "./config/csrf.js";
// import { setupGlobalMiddlewaresAndRoutes } from "./config/middlewares.js";


import  loadModels  from './loadmodels.js' // models loader from sequelize

import sequelizeConfiguration from "./dbconfig/databaseSequelize.js";


class App {
    constructor() {
        this.app = express();
        this.DB_TYPE = process.env.DB_TYPE || "mongo";
        this.mongoConnectionString =
            process.env.MONGO_DB_CONNECTION_STRING || "mongodb://localhost:27017/test"; // Attempt to connect to the database
        this.sequelize = sequelizeConfiguration;
        this.mongoose = mongoose;
        this.logger = winston.createLogger({
            level: "info",
            format: winston.format.json(),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: "error.log",
                    level: "error",
                }),
                new winston.transports.File({ filename: "combined.log" }),
            ],
        });
        this.port = null;
        this.modelsPath = path.resolve('./src/models');
    }

    async connectToDatabase() {
        const maxRetries = 5; // Define the maximum number of retries for a connection attempt.
        let retries = 0; // Initialize the retry counter.
    
        // Helper function to attempt connection with retry logic.
        const connectWithRetry = async (connectFunction, loggerInfo, loggerError, errorMessage) => {
            while (retries < maxRetries) { // Loop until the maximum retries are reached.
                try {
                    this.logger.info(loggerInfo);
                    await connectFunction(); // Try to establish the connection.
                    this.logger.info(`${loggerInfo} connected!`); 
                    return; // Exit the function successfully if the connection is successful.
                } catch (error) {
                    retries++; 
                    this.logger.error(`${loggerError} attempt ${retries} failed:`, error); 
                    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying.
                }
            }
            // Throw an error if the connection attempts exceed the maximum retries.
            throw new Error(errorMessage);
        };
    
        // Check if the database type is MongoDB.
        if (this.DB_TYPE === "mongo") {
            // Attempt to connect to MongoDB using the specified connection string.
            await connectWithRetry(
                () => mongoose.connect(this.mongoConnectionString), // MongoDB connection function.
                "MongoDB", // Info message for MongoDB.
                "MongoDB connection", // Error message for MongoDB connection.
                "Failed to connect to MongoDB after multiple attempts" // Error message when connection fails.
            );
        } else if (this.DB_TYPE === "mysql") {
            // Attempt to connect to MySQL using Sequelize's authenticate method.
            await connectWithRetry(
                () => this.sequelize.authenticate(), // MySQL connection function (authenticate).
                "MySQL", // Info message for MySQL.
                "MySQL connection", // Error message for MySQL connection.
                "Failed to connect to MySQL after multiple attempts" // Error message when connection fails.
            );
        } else {
            // Throw an error if the DB_TYPE is not recognized.
            throw new Error(`Unsupported database type: ${this.DB_TYPE}`);
        }
    }
    
    async syncModels() {
        try {
            await loadModels(this.DB_TYPE, this.sequelize, this.mongoose, this.modelsPath);
            if (this.DB_TYPE === "mysql") {
                await this.sequelize.sync({ force: false }); // Synchronize Sequelize models
                this.logger.info('All Sequelize models were synchronized successfully.');
            } else if (this.DB_TYPE === "mongo") {
                // Mongoose models are automatically synchronized, so no need to call sync()
                this.logger.info('All Mongoose models were loaded successfully.');
            }
        } catch (error) {
            this.logger.error('Error synchronizing models:', error);
        }
    }
    // Function to setup session management and flash messaging
    setupSessionAndFlash() {
        let store;

        // Create a session store using MongoDB or MySQL
        if (this.DB_TYPE === "mongo") {
            store = MongoStore.create({
                client: mongoose.connection.getClient(), // Use the MongoDB client from mongoose
                dbName: mongoose.connection.name, // Optional: specify the database name
                collectionName: "sessions", // Optional: specify the collection name
            });
        } else if (this.DB_TYPE === "mysql") {
            const SequelizeStore = connectSessionSequelize(session.Store);
            store = new SequelizeStore({
                db: this.sequelize,
                tableName: "sessions",
            });
        }
        // Configure session options
        const sessionOptions = session({
            secret: process.env.SESSION_SECRET || "defaultsecret", // Secret key for signing session ID
            store: store, // Use the correct store (MongoDB or MySQL)
            resave: false, // Don't resave session if not modified
            saveUninitialized: false, // Don't save empty sessions
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 31, // Cookie expiration (31 days)
                httpOnly: true, // Prevent access to cookie via JavaScript
                secure: process.env.NODE_ENV === "production", // Set secure flag in production
            },
        });

        this.app.use(sessionOptions);
        this.app.use(flash());
    }
    // Function to setup CSRF protection
    setupCSRFProtection() {
        // Configure CSRF protection with double CSRF token
        const { generateToken, doubleCsrfProtection } = doubleCsrf({
            getSecret: (req) => req.session.csrfSecret, // Retrieve CSRF secret from session
            cookieName: "csrf-token", // Name of the CSRF token cookie
            cookieOptions: {
                httpOnly: true, // Ensure cookie is not accessible via JavaScript
                sameSite: "strict", // Enforce SameSite cookie policy
                secure: process.env.NODE_ENV === "production", // Set secure flag in production
            },
            size: 64, // Size of the CSRF token
            ignoredMethods: ["GET", "HEAD", "OPTIONS"], // Exclude safe HTTP methods from CSRF protection
        });

        this.app.use((req, res, next) => {
            if (!req.session.csrfSecret) {
                req.session.csrfSecret = crypto.randomBytes(32).toString("hex"); // Generate a random secret
                req.session.save((err) => {
                    // Save session
                    if (err) return next(err);
                    next();
                });
            } else {
                next();
            }
        });

        this.app.use(doubleCsrfProtection); // Apply CSRF protection middleware
        this.app.use((req, res, next) => {
            res.locals.csrfToken = generateToken(req, res); // Generate CSRF token for views
            next();
        });
    }

    // Function to setup global middlewares and routes
    setupGlobalMiddlewaresAndRoutes() {
        this.app.use(helmet());
        this.app.use(express.urlencoded({ extended: true })); // Use global middleware (e.g., logging, error handling)
        this.app.use(express.json()); // Check for CSRF errors
        this.app.use(express.static("./public")); // Apply custom application routes

        // Setup rate limiter to prevent abuse (limit to 100 requests per 15 minutes)
        // const limiter = rateLimit({
        //     windowMs: 15 * 60 * 1000, // 15 minutes window
        //     max: 100, // Max 100 requests per window
        // });
        // this.app.use(limiter); // Apply rate limiter globally

        // Setup CORS to allow cross-origin requests (mainly for the frontend)
        this.app.use(
            cors({
                origin:
                process.env.FRONTEND_URL || `http://localhost:${this.port}`, // Allow frontend from specified URL or localhost
                credentials: true, // Allow credentials (cookies) to be included
            })
        );

        // Configure view engine to use EJS for dynamic views
        this.app.set("views", path.resolve(__dirname, "src", "views")); // Set the views directory
        this.app.set("view engine", "ejs"); // Set the template engine to EJS


        
        // Function to setup global middlewares and routes
        this.app.use(middleWareGlobal); // Use global middleware (e.g., logging, error handling)
        this.app.use(checkCSRFError); // Check for CSRF errors
        this.app.use(mainRouter); // Apply custom application routes
    }
    // Main function to connect to the database, setup app, and start the server
    async start(port) {
        this.port = port;
        try {
            await this.connectToDatabase(); // Connect to MongoDB
            await this.syncModels(); // SIncronize models between mongo db and mysql
            this.setupSessionAndFlash(); // Setup session and flash messages
            this.setupCSRFProtection(); // Setup CSRF protection
            this.setupGlobalMiddlewaresAndRoutes(); // Setup global middlewares and routes
            this.app.listen(port, () =>
                this.logger.info(`Server running on http://localhost:${port}`)
            ); // Start the server
        } catch (error) {
            this.logger.error("Failed to initialize:", error); // Log error if initialization fails
        }
    }
}

const appInstance = new App();
export const logger = appInstance.logger; // Export the logger instance
export default appInstance;
