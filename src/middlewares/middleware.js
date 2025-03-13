import { logger } from '../app.js';

export const middleWareGlobal = (req, res, next) => {
  logger.info("Global middleware");
  next();
};


export const databaseMiddleware = (mongoose, sequelize, DB_TYPE) => (req, res, next) => {
  req.db = {
      mongoose,
      sequelize,
      DB_TYPE
  };
  next();
};


export const checkCSRFError = (err, req, res, next) => {
  if (err && err.code === 'EBADCSRFTOKEN') {
    logger.error("Invalid CSRF", err, err.code)
    return res.status(403).send('Invalid CSRF token');
  }
  next();
};

export const testMiddleware = (req, res, next) => {
  logger.info("Middleware Test Initialized");

  // Ensure session is initialized before modifying it
  if (!req.session) {
    return next(new Error("Session is not available"));
  }

  req.session.nome = 'teste';
  next();
};
