// src/server.ts

import app from './app.js';
import "dotenv/config";


// Get the port from the environment variable, fallback to 8765 if not defined
const port: number = parseInt(process.env.PORT || '8765', 10);
const host: string = process.env.HOST || 'localhost';
const httpsEnabled: boolean = process.env.HTTPS_ENABLED === 'true' || false;


interface AppInstance {
    start: (httpsEnabled: boolean, host: string, port: number) => void;
}

// Explicitly type the imported app instance
const typedApp: AppInstance = app;

// Start the application
typedApp.start(httpsEnabled, host, port);