export const middleWareGlobal = (req, res, next) => {
  console.log("Global middleware");
  next();
};

export const checkCSRFError = (err, req, res, next) => {
  if (err && err.code === 'EBADCSRFTOKEN') {
    return res.status(403).send('Invalid CSRF token');
  }
  next();
};

// Remove CSRFMiddleware since token is already set in res.locals

export const testMiddleware = (req, res, next) => {
  console.log("Middleware Test Initialized");

  // Ensure session is initialized before modifying it
  if (!req.session) {
    return next(new Error("Session is not available"));
  }

  req.session.nome = 'teste';
  next();
};
