// src/middleware/middleware.ts

import { Request, Response, NextFunction } from 'express';
import { logger } from '../app';
import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';

// Database Middleware: Attaches database instances to the request object
export const databaseMiddleware = (
  mongooseConnection: mongoose.Connection, 
  sequelize: Sequelize,
  DB_TYPE: string
) => (req: Request, res: Response, next: NextFunction) => {
  req.db = {
    DB_TYPE,
    mongoose: {
      connection: mongooseConnection  // Match the type structure from declaration
    },
    sequelize: {
      authenticate: () => sequelize.authenticate()  // Wrap sequelize method
    }
  };
  next();
};

// Global Middleware: Logs incoming requests
export const middleWareGlobal = (req: Request, res: Response, next: NextFunction) => {
  logger.info("Global middleware");
  next();
};

// CSRF Error Middleware: Handles CSRF token errors
export const checkCSRFError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err && err.code === 'EBADCSRFTOKEN') {
    logger.error("Invalid CSRF", err, err.code);
    return res.status(403).send('Invalid CSRF token');
  }
  next();
};
// Test Middleware: Initializes a test session variable
export const testMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info("Middleware Test Initialized");

  // Ensure session is initialized before modifying it
  if (!req.session) {
    return next(new Error("Session is not available"));
  }

  (req.session as any).nome = 'teste';
  next();
};