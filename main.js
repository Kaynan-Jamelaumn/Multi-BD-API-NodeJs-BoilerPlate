require('dotenv').config(); // Load environment variables

// Core modules (built into Node.js)
const path = require('path');

// Web framework
const express = require('express');

// Database
const mongoose = require('mongoose');
const connectMongo = require('connect-mongo');

// Session & Flash messages
const session = require('express-session');
const flash = require('connect-flash');

// Security
const helmet = require('helmet');
const { doubleCsrf } = require('csrf-csrf');

// Application setup
const app = express();
const routes = require('./routes');
const { middleWareGlobal, checkCSRFError, CSRFMiddleware } = require('./src/middlewares/middleware');



// Log environment variables for debugging
//console.log('DB Connection String:', process.env.DBCONNECTIONSTRING);
//console.log('Session Secret:', process.env.SESSIONSECRET);

// Set MongoDB connection string with a default fallback
const mongoConnectionString = process.env.DBCONNECTIONSTRING || 'mongodb://localhost:27017/test';

// Connect to MongoDB
mongoose.connect(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected successfully');
    app.emit('ready');
  })
  .catch((err) => console.log('Failed to connect to the database:', err));

// CSRF Protection Configuration
const {
  generateToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: (req) => req.session.csrfSecret, // Store CSRF secret in session
  cookieName: "csrf-token", // Name of the CSRF token cookie
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production", // Use secure flag in production
  },
  size: 64, // Token lenght generated in Bytes
  ignoredMethods: ["GET", "HEAD", "OPTIONS"], // Methods that do not require CSRF protection
});

// Apply security middleware
app.use(helmet()); // Secure againts XSS and Clickjacking
app.use(express.urlencoded({ extended: true })); // Allow form data submission exemple url/name=John&hobbies=reading&hobbies=gaming

app.use(express.json());
app.use(express.static('./public')); // Serve static files like CSS and images

// Session Configuration using connect-mongo
const sessionOptions = session({
  secret: process.env.SESSIONSECRET || 'defaultsecret', // Use environment variable or fallback secret
  store: connectMongo.create({ mongoUrl: mongoConnectionString }), // Store sessions in MongoDB
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 31, // Set cookie expiration (31 days)
    httpOnly: true, // Prevent client-side JavaScript access to cookies
  },
});

app.use(sessionOptions);
app.use(flash()); // Flash messages middleware
app.set('views', path.resolve(__dirname, 'src', 'views')); // Set views directory
app.set('view engine', 'ejs'); // Use EJS template engine

// Apply CSRF protection middleware
app.use(doubleCsrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = generateToken(res, req); // Generate CSRF token for views
  next();
});

// Apply global middleware
app.use(middleWareGlobal);
app.use(checkCSRFError);
app.use(CSRFMiddleware);
app.use(routes);

// Start the server once the database is connected
app.on('ready', () => {
  app.listen(8765, () => console.log("Server is running at: http://localhost:8765"));
});