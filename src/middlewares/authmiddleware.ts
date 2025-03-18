// src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../app.js';
import "dotenv/config";
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { User } from '../types/user.js';


const envConfig = dotenv.config();
dotenvExpand.expand(envConfig);

// Auth Middleware: Verifies if the user is authenticated
export function authMiddleware(req: Request, res: Response, next: NextFunction) : void {
  // Verify authentication by JWT
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from the headers

  if (token) {
    try {
      // Decode the JWT Token
      const decoded = jwt.verify(token, process.env.JWTSECRET || "defaultsecret") as User; // Use your secret key
      req.user = decoded; // the decoded user is put as `req.user`
      next(); // go to next middleware/function
      return 
    } catch (error) {
      // Invalid token or middleware
      logger.error('Error while verifying JWT Token:', error);
      res.status(401).json({ error: 'Unauthorized access. Invalid token.' });
      return;
    }
  }

  // Try to authenticate by session
  if (req.session && req.session.user) {
    req.user = req.session.user // the decoded user is put as `req.user`
    next(); // go to next middleware/function
    return 
  }

  // If user is not authenticated by any means it return 401
  res.status(401).json({ error: 'Unauthorized access. You must login to proceed.' });
  return;
}

// Admin Middleware: Ensures the authenticated user has the 'Admin' role
export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  // Check if the user has the 'Admin' role
  if (req.user?.role !== 'Admin') {
    res.status(403).json({ error: 'Forbidden. You do not have permission to access this resource.' });
    return 
  }

  // If the user is an Admin, proceed to the next middleware/function
  next();
}