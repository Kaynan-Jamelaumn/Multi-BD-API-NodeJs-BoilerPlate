import 'dotenv/config'; // Load environment variables
import dotenvExpand from 'dotenv-expand'; // Para expandir variáveis dinamicamente (opcional)
dotenvExpand.expand(process.env); // Expande variáveis de ambiente dinâmicas

// Core modules (built into Node.js)
import path from 'path';
import { fileURLToPath } from 'url';

// Web framework
import express from 'express';

// Database
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';

// Session & Flash messages
import session from 'express-session';
import flash from 'connect-flash';

// Security
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';

// Application setup
import routes from './routes.js';
import { middleWareGlobal, checkCSRFError, CSRFMiddleware } from './src/middlewares/middleware.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Log environment variables for debugging
//console.log('DB Connection String:', process.env.DBCONNECTIONSTRING);
//console.log('Session Secret:', process.env.SESSIONSECRET);


// Set MongoDB connection string with a default fallback
const mongoConnectionString = process.env.DBCONNECTIONSTRING || 'mongodb://localhost:27017/test';

// Connect to MongoDB
async function connectToDatabase() {
  try {
    console.log("Trying to connect to Database..."); // Log para garantir que a função está sendo chamada
    await mongoose.connect(mongoConnectionString);
    console.log('Database connected successfully');
    app.emit('ready'); // Emite o evento 'ready' para iniciar o servidor
  } catch (err) {
    console.log('Error trying to connect to Database:', err); // Log detalhado de erro
  }
}

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
  size: 64, // Token length generated in Bytes
  ignoredMethods: ["GET", "HEAD", "OPTIONS"], // Methods that do not require CSRF protection
});

// Application setup
const app = express();

// Apply security middleware
app.use(helmet()); // Secure against XSS and Clickjacking
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

// Start the server only after the database connection is successful
app.on('ready', () => {
  console.log('Event ready triggered');
  app.listen(8765, () => {
    console.log("Server running in: http://localhost:8765");
  });
});

// Tente conectar ao banco de dados diretamente
connectToDatabase();