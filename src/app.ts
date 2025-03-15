// Load environment variables from a .env file and expand any references to other variables
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const envConfig = dotenv.config();
dotenvExpand.expand(envConfig);

// Import necessary modules for application setup
import path from "path"; // To handle file and directory paths


// Import third-party libraries for various functionalities

// Database
import express, { Express, Request, Response, NextFunction } from 'express';
//import express from "express"; // Web framework for routing and handling HTTP requests
import mongoose from "mongoose"; // MongoDB object modeling tool
import MongoStore from "connect-mongo"; // Session store for MongoDB
//import { Sequelize } from "sequelize";
import connectSessionSequelize from "connect-session-sequelize";

// Session // Correct import

import session from "express-session"; // Middleware for session management

// Security
import helmet from "helmet"; // Security headers middleware
import {
    doubleCsrf
} from "csrf-csrf"; // CSRF protection middleware

// Rate Limiting & CORS
import rateLimit from "express-rate-limit"; // Rate limiting middleware
import cors from "cors"; // Cross-origin resource sharing middleware

// Cryptographic Functionality
import crypto from "crypto"; // Built-in module for cryptographic functionalities

// Logging
import winston from "winston";

// Import custom routes and middleware functions
import mainRouter from "./routes/routes.js";
import {
    middleWareGlobal,
    checkCSRFError,
    databaseMiddleware,
} from "./middlewares/middleware.js";

// Import Node.js built-in modules
import http from "http"; // HTTP server module
import https from "https"; // HTTPS server module
import fs from "fs"; // File system module


// Import socket.io
import { Server } from "socket.io"; // WebSocket library for real-time communication

// Resolve the current file and directory paths (for setting views and static files)


import loadModels from './loadModels.js';// models loader from sequelize

import sequelizeConfiguration from "./databaseSequelize.js";

// Import the Swagger configuration
import swaggerConfig from './swagger.js';

import { DefaultEventsMap } from 'socket.io/dist/typed-events';

class App {
    public app: Express;
    public DB_TYPE: 'mysql' | 'mongo' ;
    public mongoConnectionString: string;
    public sequelize: any;
    public mongoose: typeof mongoose;
    public logger: winston.Logger;
    public port: number | null;
    public https: boolean;
    public host: string | null;
    public modelsPath: string;

    private server: http.Server | https.Server | null = null;
    private io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown> | null = null

    constructor() {
        this.app = express();
        this.DB_TYPE = this.getDBType(process.env.DB_TYPE);
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
                new winston.transports.File({
                    filename: "combined.log"
                }),
            ],
        });
        this.port = null;
        this.https = false;
        this.host = null;
        this.modelsPath = path.resolve(process.env.MODELS_PATH || './src/models');
        this.server = null; // Store the server instance for graceful shutdown
    }

    getDBType(envValue: string | undefined): 'mysql' | 'mongo' {
        return envValue === "mysql" || envValue === "mongo" ? envValue : "mongo";
    }

    async connectToDatabase(): Promise<void> {
        const maxRetries = 5; // Define the maximum number of retries for a connection attempt.
        let retries = 0; // Initialize the retry counter.

        // Helper function to attempt connection with retry logic.
        const connectWithRetry = async (connectFunction: () => Promise<any>, loggerInfo: string, loggerError: string, errorMessage: string) => {
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

    async syncModels(): Promise<void> {
        try {
            await loadModels(this.DB_TYPE, this.sequelize, this.mongoose, this.modelsPath, true, this.logger);
            if (this.DB_TYPE === "mysql") {
                await this.sequelize.sync({
                    alter: true
                }); // Synchronize Sequelize models
                this.logger.info('All Sequelize models were synchronized successfully.');
            } else if (this.DB_TYPE === "mongo") {
                // Mongoose models are automatically synchronized, so no need to call sync()
                this.logger.info('All Mongoose models were loaded successfully.');
            }
        } catch (error) {
            this.logger.error('Error synchronizing models:', error);
        }
    }

    async setupSessionAndFlash(): Promise<void> {
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
            await store.sync();
        }
        // Configure session options
        const sessionOptions = session({
            secret: process.env.SESSION_SECRET || "defaultsecret", // Secret key for signing session ID
            store: store, // Use the correct store (MongoDB or MySQL)
            resave: false, // Don't resave session if not modified
            saveUninitialized: false, // Don't save empty sessions
            cookie: {
                maxAge: process.env.SESSION_COOKIE_MAX_AGE ? parseInt(process.env.SESSION_COOKIE_MAX_AGE) : 1000 * 60 * 60 * 24 * 31, // Cookie expiration (31 days)
                httpOnly: true, // Prevent access to cookie via JavaScript
                secure: process.env.NODE_ENV === "production", // Set secure flag in production
            },
        });

        this.app.use(sessionOptions);
        //this.app.use(flash());
    }

    setupCSRFProtection() {
        // Configure CSRF protection with double CSRF token
        const {
            generateToken,
            doubleCsrfProtection
        } = doubleCsrf({
            getSecret: (req?: Request) => {    
                // Handle the case where `req` or `req.session` is undefined
                if (!req || !req.session) {
                    throw new Error('Session is not initialized');
                }
                // Ensure `csrfSecret` exists in the session
                if (!req.session.csrfSecret) {
                    req.session.csrfSecret = crypto.randomBytes(32).toString('hex');
                }
                return req.session.csrfSecret;}, // Retrieve CSRF secret from session
            cookieName: process.env.CSRF_COOKIE_NAME || "csrf-token", // Name of the CSRF token cookie
            cookieOptions: {
                httpOnly: true, // Ensure cookie is not accessible via JavaScript
                sameSite: (process.env.CSRF_COOKIE_SAMESITE as "strict" | "lax" | "none") || "strict", // Enforce SameSite cookie policy 
                secure: process.env.NODE_ENV === "production", // Set secure flag in production
            },
            size: 64, // Size of the CSRF token
            ignoredMethods: ["GET", "HEAD", "OPTIONS"], // Exclude safe HTTP methods from CSRF protection
        });

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            if (!req.session.csrfSecret) {
                req.session.csrfSecret = crypto.randomBytes(32).toString("hex"); // Generate a random secret
                req.session.save((err) => {
                    // Save session
                    if (err) {
                        //logger.error('Error saving session:', err);
                        return next(err);
                    }
                    //logger.log('CSRF secret set:', req.session.csrfSecret);
                    next();
                });
            } else {
                //logger.log('CSRF secret already set:', req.session.csrfSecret);
                next();
            }
        });

        // Apply CSRF protection only to non-static routes
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            if (req.path.startsWith('/uploads')) {
                // Skip CSRF protection for /uploads
                return next();
            }
            // Apply CSRF protection to all other routes
            doubleCsrfProtection(req as any, res as any, next as any);
        });

        // Generate CSRF token for views
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            if (!req.path.startsWith('/uploads')) {
                res.locals.csrfToken = generateToken(req, res);
            }
            next();
        });
    }

    setupGlobalMiddlewaresAndRoutes() {

        this.app.use(databaseMiddleware(this.mongoose.connection, this.sequelize, this.DB_TYPE));

        
        this.app.use(helmet());

        const staticFileDir = process.env.STATIC_FILE_DIR || 'public';
        this.app.use(express.static(staticFileDir));

        // Setup rate limiter to prevent abuse (limit to 100 requests per 15 minutes)
        const limiter = rateLimit({
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes window  15 * 60 * 1000
            max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),  // Max 100 requests per window
        });
        this.app.use(limiter); // Apply rate limiter globally

        // Determine the protocol (http or https) based on HTTPS_ENABLED
        const protocol = process.env.HTTPS_ENABLED === 'true' ? 'https' : 'http';

        // Setup CORS to allow cross-origin requests (mainly for the frontend)
        const corsEnabled = process.env.ENABLE_CORS === 'true' || true;
        if (corsEnabled) {
            this.app.use(
                cors({
                    origin: "*",//process.env.FRONTEND_URL || `${protocol}://${this.host}:${this.port}`, // Allow frontend from specified URL or localhost
                    credentials: true, // Allow credentials (cookies) to be included
                })
            );
        }

        //const __filename = fileURLToPath(import.meta.url); // Get the full path of the current module
//const __dirname = path.dirname(__filename); // Get the directory name of the current module
//const __dirname = path.dirname(__filename);



        // Configure view engine to use EJS for dynamic views
        // this.app.set("views", path.resolve(__dirname, "src", "views")); // Set the views directory
        // this.app.set("view engine", "ejs"); // Set the template engine to EJS

        // Serve static files from the React app
        // const reactBuildPath = path.resolve(__dirname, '..', 'client', 'build');
        // this.app.use(express.static(reactBuildPath));

        // // Handle React routing, return all requests to React app
        // this.app.get('*', (req, res) => {
        //     res.sendFile(path.join(reactBuildPath, 'index.html'));
        // });

        // Setup Swagger documentation
        (swaggerConfig as (app: Express) => void)(this.app);

        // Function to setup global middlewares and routes
        this.app.use(middleWareGlobal); // Use global middleware (e.g., logging, error handling)
        this.app.use(mainRouter); // Apply custom application routes

        this.setupCSRFProtection(); // Setup CSRF protection

        // Handle 404 errors
        this.app.use((req, res, next) => {
            res.status(404).send("404 Not Found");
        });
        // Handle CSRF errors
        this.app.use(checkCSRFError as express.ErrorRequestHandler); // Check for CSRF errors
    }

    async start(httpsEnabled: boolean, host: string, port: number): Promise<void> {
        this.port = port;
        this.https = httpsEnabled;
        this.host = host;
        try {
            await this.connectToDatabase(); // Connect to MongoDB
            await this.syncModels(); // SIncronize models between mongo db and mysql
            await this.setupSessionAndFlash(); // Setup session and flash messages

            const hasPayloadLimit = process.env.HAS_PAYLOAD_LIMIT === 'true' || true
            if (hasPayloadLimit) {
                this.app.use(express.json({
                    limit: process.env.MAX_PAYLOAD_SIZE || '50mb'
                }));
            } else {
                this.app.use(express.json());
            }
            this.app.use(express.urlencoded({
                extended: true
            }));

            this.setupGlobalMiddlewaresAndRoutes(); // Setup global middlewares and routes

            // Determine if HTTPS is enabled
            const isHttpsEnabled = this.https;
            
            // Ensure HTTPS key and cert paths are defined
            const httpsKeyPath = process.env.HTTPS_KEY_PATH;
            const httpsCertPath = process.env.HTTPS_CERT_PATH;

            if (isHttpsEnabled && (!httpsKeyPath || !httpsCertPath)) {
                throw new Error('HTTPS key or certificate path is not defined in environment variables.');
            }
            // Determine the server type and create the appropriate server
            this.server = isHttpsEnabled ?
                https.createServer({
                        key: fs.readFileSync(httpsKeyPath!, 'utf8'),
                        cert: fs.readFileSync(httpsCertPath!, 'utf8'),
                    },
                    this.app
                ) :
                http.createServer(this.app);
            
            // Check if WebSocket is enabled
            const isWebSocketEnabled = process.env.WEBSOCKET_ENABLED === 'true';

            if (isWebSocketEnabled) {
                // Initialize socket.io
                this.io = new Server(this.server, {
                    cors: {
                      origin: process.env.FRONTEND_URL || `${isHttpsEnabled ? 'https' : 'http'}://${this.host}:${this.port}`,
                      methods: ["GET", "POST"],
                    },
                  });

                // Socket.io connection handler
                this.io.on("connection", (socket) => {
                    this.logger.info(`Socket connected: ${socket.id}`);

                    // Example: Handle a custom event
                    socket.on("customEvent", (data) => {
                        this.logger.info(`Received customEvent: ${JSON.stringify(data)}`);
                        // Broadcast the event to all connected clients
                        this.io?.emit("customEventResponse", { message: "Hello from server!" });
                    });

                    // Handle disconnection
                    socket.on("disconnect", () => {
                        this.logger.info(`Socket disconnected: ${socket.id}`);
                    });
                });

                this.logger.info('WebSocket is enabled and initialized.');
            } else {
                this.logger.info('WebSocket is disabled.');
            }
           


            this.server.listen(this.port, this.host, () => {
                const protocol = isHttpsEnabled ? 'https' : 'http';
                this.logger.info(`${protocol.toUpperCase()} Server running on ${protocol}://${this.host}:${this.port}`);
            });

            // Graceful shutdown logic
            const shutdown = async () => {
                this.logger.info('Shutting down gracefully...');
            
                if (this.server) {
                    this.server.close(() => {
                        this.logger.info('Server closed.');
                    });
                }
            
                if (this.DB_TYPE === "mongo") {
                    await this.mongoose.connection.close();
                    this.logger.info('MongoDB connection closed.');
                } else if (this.DB_TYPE === "mysql") {
                    await this.sequelize.close();
                    this.logger.info('MySQL connection closed.');
                }
            
                this.logger.info('Process exiting...');
                process.exit(0);
            };
            
            process.on('SIGINT', () => {
                this.logger.info('SIGINT received');
                shutdown().catch(err => {
                    this.logger.error('Error during shutdown:', err);
                    process.exit(1);
                });
            });
            
            process.on('SIGTERM', () => {
                this.logger.info('SIGTERM received');
                shutdown().catch(err => {
                    this.logger.error('Error during shutdown:', err);
                    process.exit(1);
                });
            });
        } catch (error) {
            this.logger.error("Failed to initialize:", error); // Log error if initialization fails
            console.log(error)
            if (error instanceof Error) {
                this.logger.error(error.stack); // Mostra o stack trace completo
              }
              process.exit(1); // Força saída com erro
        }
    }
}

const appInstance = new App();
export const logger = appInstance.logger; // Export the logger instance
export default appInstance;