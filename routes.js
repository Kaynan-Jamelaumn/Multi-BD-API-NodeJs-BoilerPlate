import express from 'express';
const route = express.Router();

import { paginaInicial } from './src/controllers/homeController.js'; 
import { testMiddleware } from './src/middlewares/middleware.js';
route.get('/', testMiddleware, paginaInicial);

export default route;
