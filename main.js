// Load environment variables from a .env file and expand any references to other variables
import 'dotenv/config';
import dotenvExpand from 'dotenv-expand';
dotenvExpand.expand(process.env);

// Import necessary modules for application setup
import path from 'path';  // To handle file and directory paths
import { fileURLToPath } from 'url';  // To work with URLs in ES modules

// Import third-party libraries for various functionalities

// Database
import express from 'express';  // Web framework for routing and handling HTTP requests
import mongoose from 'mongoose';  // MongoDB object modeling tool
import MongoStore from 'connect-mongo';  // Session store for MongoDB
import { Sequelize } from 'sequelize';
import connectSessionSequelize from 'connect-session-sequelize';

// Flash
import session from 'express-session';  // Middleware for session management
import flash from 'connect-flash';  // Flash messages for session-based notifications

// Security
import helmet from 'helmet';  // Security headers middleware
import { doubleCsrf } from 'csrf-csrf';  // CSRF protection middleware

// Rate Limiting & CORS
import rateLimit from 'express-rate-limit';  // Rate limiting middleware
import cors from 'cors';  // Cross-origin resource sharing middleware

// Cryptographic Functionality
import crypto from 'crypto';  // Built-in module for cryptographic functionalities

// Logging 
import winston from 'winston';

// Import custom routes and middleware functions
import routes from './routes.js';  
import { middleWareGlobal, checkCSRFError } from './src/middlewares/middleware.js';

// Resolve the current file and directory paths (for setting views and static files)
const __filename = fileURLToPath(import.meta.url);  // Get the full path of the current module
const __dirname = path.dirname(__filename);  // Get the directory name of the current module

// Database configuration
const DB_TYPE = process.env.DB_TYPE || 'mongo';
let sequelize;
// MongoDB connection string, pulled from environment variable or defaults to local
const mongoConnectionString = process.env.DBCONNECTIONSTRING || 'mongodb://localhost:27017/test';

// Create an Express application instance
const app = express();

// Winston logger setup
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Middleware setup that doesn't depend on the database
app.use(helmet());  // Set various HTTP headers to improve security
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies (form submissions)
app.use(express.json());  // Parse JSON bodies (APIs)
app.use(express.static('./public'));  // Serve static files from the "public" directory

// Setup rate limiter to prevent abuse (limit to 100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes window
  max: 100,  // Max 100 requests per window
});
app.use(limiter);  // Apply rate limiter globally

// Setup CORS to allow cross-origin requests (mainly for the frontend)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8765',  // Allow frontend from specified URL or localhost
  credentials: true,  // Allow credentials (cookies) to be included
}));

// Configure view engine to use EJS for dynamic views
app.set('views', path.resolve(__dirname, 'src', 'views'));  // Set the views directory
app.set('view engine', 'ejs');  // Set the template engine to EJS

// Function to connect to MongoDB database or Mysql
async function connectToDatabase() {
  if (DB_TYPE === 'mongo') {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        logger.info("Connecting to MongoDB...");
        await mongoose.connect(mongoConnectionString);  // Attempt to connect to the database
        logger.info("MongoDB connected!");
        return;
      } catch (error) {
        retries++;
        logger.error(`MongoDB connection attempt ${retries} failed:`, error);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
    }
    throw new Error("Failed to connect to MongoDB after multiple attempts");
  } else if (DB_TYPE === 'mysql') {
    const maxRetries = 5;
    let retries = 0;

    sequelize = new Sequelize(
      process.env.DB_NAME || 'database',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        retry: {
          max: 5,
          timeout: 60000,
        }
      }
    );

    while (retries < maxRetries) {
      try {
        logger.info("Connecting to MySQL...");
        await sequelize.authenticate();
        logger.info("MySQL connected!");
        return;
      } catch (error) {
        retries++;
        logger.error(`MySQL connection attempt ${retries} failed:`, error);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
    }
    throw new Error("Failed to connect to MySQL after multiple attempts");
  } else {
    throw new Error(`Unsupported database type: ${DB_TYPE}`);
  }
}

// Function to setup session management and flash messaging
function setupSessionAndFlash() {
  let store;

  // Create a session store using MongoDB or MySQL
  if (DB_TYPE === 'mongo') {
    store = MongoStore.create({
      client: mongoose.connection.getClient(),  // Use the MongoDB client from mongoose
      dbName: mongoose.connection.name,  // Optional: specify the database name
      collectionName: 'sessions',  // Optional: specify the collection name
    });
  } else if (DB_TYPE === 'mysql') {
    const SequelizeStore = connectSessionSequelize(session.Store);
    store = new SequelizeStore({
      db: sequelize,
      tableName: 'sessions',
    });
  }

  // Configure session options
  const sessionOptions = session({
    secret: process.env.SESSIONSECRET || 'defaultsecret',  // Secret key for signing session ID
    store: store,  // Use the correct store (MongoDB or MySQL)
    resave: false,  // Don't resave session if not modified
    saveUninitialized: false,  // Don't save empty sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 31,  // Cookie expiration (31 days)
      httpOnly: true,  // Prevent access to cookie via JavaScript
      secure: process.env.NODE_ENV === 'production',  // Set secure flag in production
    },
  });

  app.use(sessionOptions);  // Use session middleware
  app.use(flash());  // Enable flash messages
}

// Function to setup CSRF protection
function setupCSRFProtection() {
  // Configure CSRF protection with double CSRF token
  const { generateToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: (req) => req.session.csrfSecret,  // Retrieve CSRF secret from session
    cookieName: "csrf-token",  // Name of the CSRF token cookie
    cookieOptions: {
      httpOnly: true,  // Ensure cookie is not accessible via JavaScript
      sameSite: "strict",  // Enforce SameSite cookie policy
      secure: process.env.NODE_ENV === "production",  // Set secure flag in production
    },
    size: 64,  // Size of the CSRF token
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],  // Exclude safe HTTP methods from CSRF protection
  });

  // Middleware to initialize CSRF secret in session if not already present
  app.use((req, res, next) => {
    if (!req.session.csrfSecret) {
      req.session.csrfSecret = crypto.randomBytes(32).toString('hex');  // Generate a random secret
      req.session.save(err => {  // Save session
        if (err) return next(err);
        next();
      });
    } else {
      next();
    }
  });

  app.use(doubleCsrfProtection);  // Apply CSRF protection middleware
  app.use((req, res, next) => {
    res.locals.csrfToken = generateToken(req, res);  // Generate CSRF token for views
    next();
  });
}

// Function to setup global middlewares and routes
function setupGlobalMiddlewaresAndRoutes() {
  app.use(middleWareGlobal);  // Use global middleware (e.g., logging, error handling)
  app.use(checkCSRFError);  // Check for CSRF errors
  app.use(routes);  // Apply custom application routes
}

// Function to start the server and listen for incoming requests
async function startServer() {
  try {
    await app.listen(8765);
    logger.info("Server running on http://localhost:8765");
  } catch (error) {
    logger.error("Failed to start server:", error);
  }
}

// Main function to connect to the database, setup app, and start the server
async function connectAndSetup() {
  try {
    await connectToDatabase();  // Connect to MongoDB
    setupSessionAndFlash();  // Setup session and flash messages
    setupCSRFProtection();  // Setup CSRF protection
    setupGlobalMiddlewaresAndRoutes();  // Setup global middlewares and routes
    await startServer();  // Start the server
  } catch (error) {
    logger.error("Failed to initialize:", error);  // Log error if initialization fails
  }
}

// Call the main function to start the application
connectAndSetup();