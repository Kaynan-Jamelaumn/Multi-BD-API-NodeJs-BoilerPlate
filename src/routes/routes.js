// mainRouter.js
import path from 'path'
import express from 'express';
import userRouter from './userRouter.js';// Example user router
import validatorRouter from './validatorRouter.js';
// import authRouter from './routes/authRouter.js'; // Example auth router

import { paginaInicial } from '../controllers/homeController.js'; 
import { testMiddleware } from '../middlewares/middleware.js';

const mainRouter = express.Router();


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
mainRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});


 mainRouter.use('/user', userRouter);

mainRouter.use('/validator', validatorRouter);

 // Serve static files(exp images) from the "public" directory
 const uploadDir = process.env.UPLOAD_DIR || 'public/uploads';
 mainRouter.use('/uploads', express.static(path.resolve(uploadDir)));

// Error-handling file upload middleware
mainRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    res.status(400).json({ error: err.message });
  } else {
    next();
  }
});

// Export the main router
export default mainRouter;