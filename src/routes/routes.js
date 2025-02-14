// mainRouter.js
import express from 'express';
import userRouter from './userRouter.js';// Example user router
// import authRouter from './routes/authRouter.js'; // Example auth router

import { paginaInicial } from '../controllers/homeController.js'; 
import { testMiddleware } from '../middlewares/middleware.js';

const mainRouter = express.Router();

mainRouter.get('/', testMiddleware, paginaInicial);


mainRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});



// Use the individual routers
 mainRouter.use('/user', userRouter);
// mainRouter.use('/auth', authRouter);

// Export the main router
export default mainRouter;