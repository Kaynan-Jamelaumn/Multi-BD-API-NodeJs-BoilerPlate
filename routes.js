import express from 'express';
const route = express.Router();

import { paginaInicial } from './src/controllers/homeController.js'; 

route.get('/', paginaInicial);

export default route;
