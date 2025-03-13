import app from './app.js';
import path from 'path';
import "dotenv/config";


// Define the path for the Sequelize models
const sequelize_models_path: string = process.env.MODELS_PATH || path.resolve('./models');

// Get the port from the environment variable, fallback to 8765 if not defined
const port: number = parseInt(process.env.PORT || '8765', 10);
const host: string = process.env.HOST || 'localhost';
const https: boolean = process.env.HTTPS_ENABLED === 'true' || false;

app.start(https, host, port);

