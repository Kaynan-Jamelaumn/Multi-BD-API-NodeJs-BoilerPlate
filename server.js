import app from './app.js';
import path from 'path'
import "dotenv/config";

// Define the path for the Sequelize models
const sequelize_models_path = process.env.MODELS_PATH || path.resolve('./src/models');

// Get the port from the environment variable, fallback to 8765 if not defined
const port = process.env.PORT || 8765;

app.start(port, sequelize_models_path);