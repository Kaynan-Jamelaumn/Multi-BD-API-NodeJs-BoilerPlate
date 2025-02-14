import app from './app.js';
import path from 'path'

const sequelize_models_path = path.resolve('./src/models');
const port = 8765;
app.start(port, sequelize_models_path);