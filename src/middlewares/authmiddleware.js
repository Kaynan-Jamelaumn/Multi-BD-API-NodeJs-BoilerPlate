// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { logger } from '../../app.js';
import "dotenv/config";
import dotenvExpand from "dotenv-expand";
dotenvExpand.expand(process.env);

// Auth Middleware: Verifies if the user is authenticated
export function authMiddleware(req, res, next) {
  //  Verify authentication by JWT
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from the headers

  if (token) {
    try {
      // Decode the JWT Token
      const decoded = jwt.verify(token,  process.env.JWTSECRET || "defaultsecret"); // Use your secret key
      req.user = decoded; // the decoded user is put as `req.user`
      return next(); // go to next middleware/function
    } catch (error) {
      // Invalid token or middleware
      logger.error('Error while verifying JWT Token:', error);
    }
  }

  // Try to authenticate by session
  if (req.session && req.session.user) {
    req.user = req.session.user; // the decoded user is put as  `req.user`
    return next(); //  go to next middleware/function
  }

  // If user is not authenticated by any means it return 401
  return res.status(401).json({ error: 'Unauthorized access. You must login to proceed' });
}

// Admin Middleware: Ensures the authenticated user has the 'Admin' role
export function adminMiddleware(req, res, next) {
  // Check if the user has the 'Admin' role
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Forbidden. You do not have permission to access this resource.' });
  }

  // If the user is an Admin, proceed to the next middleware/function
  next();
}