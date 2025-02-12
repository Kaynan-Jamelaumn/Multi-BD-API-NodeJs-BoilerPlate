export const middleWareGlobal = (req, res, next) => {
  console.log("sou o middleware passei");
  next();
}

export const checkCSRFError = (err, req, res, next) => {
  if (err && err.code === 'EBADCSRFTOKEN') {
    return res.send('BAD CSRF');
  }
}

export const CSRFMiddleware = (req, res, next) => {
  res.locals.csrftoken = req.csrfToken(); // Use req.csrfToken() here
  next();
}
