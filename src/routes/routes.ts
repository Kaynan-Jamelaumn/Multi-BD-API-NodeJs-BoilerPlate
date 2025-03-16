// src/routes/routes.ts

import path from 'path';
import express, { Request, Response, NextFunction, Router } from 'express';
import multer from 'multer'; // Import multer for file upload error handling
import userRouter from './userRouter.js'; // Example user router
import addressesRouter from './addressRouter.js';
import validatorRouter from './validatorRouter.js';

import { paginaInicial } from '../controllers/homeController.js';
import { testMiddleware } from '../middlewares/middleware.js';

// Extend the Express Request type to include the `db` property
declare module 'express' {
  interface Request {
    db: {
      DB_TYPE: string;
      mongoose?: {
        connection: {
          readyState: number;
        };
      };
      sequelize?: {
        authenticate: () => Promise<void>;
      };
    };
  }
}

const mainRouter: Router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns the homepage
 *     responses:
 *       200:
 *         description: The homepage
 */
mainRouter.get('/', testMiddleware, paginaInicial);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
mainRouter.get('/health', async (req: Request, res: Response) => {
  try {
    let databaseStatus: string;
    if (req.db.DB_TYPE === 'mongo') {
      databaseStatus = req.db.mongoose?.connection.readyState === 1 ? 'connected' : 'disconnected';
    } else if (req.db.DB_TYPE === 'mysql') {
      await req.db.sequelize?.authenticate();
      databaseStatus = 'connected';
    } else {
      databaseStatus = 'unsupported';
    }

    res.status(200).json({
      status: 'UP',
      database: databaseStatus,
      timestamp: new Date(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'DOWN',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date(),
    });
  }
});

// Use routers
mainRouter.use('/user', userRouter);
mainRouter.use('/address', addressesRouter);
mainRouter.use('/validator', validatorRouter);

// Serve static files (e.g., images) from the "public" directory
const uploadDir = process.env.UPLOAD_DIR || 'public/uploads';
mainRouter.use('/uploads', express.static(path.resolve(uploadDir)));

// Error-handling file upload middleware
mainRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    res.status(400).json({ error: err.message });
  } else {
    next();
  }
});

// Export the main router
export default mainRouter;