// src/swagger

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Define interfaces for Swagger options and configuration
interface SwaggerOptions {
  definition: {
    openapi: string;
    info: {
      title: string;
      version: string;
      description: string;
    };
    servers: {
      url: string;
      description: string;
    }[];
  };
  apis: string[];
}

interface SwaggerConfig {
  port: number;
  protocol: string;
  host: string;
  swaggerEnabled: boolean;
  swaggerRoute: string;
}

// Set up port, protocol, and host from environment variables or defaults
const port: number = Number(process.env.PORT) || 8765;
const protocol: string = process.env.HTTPS_ENABLED === 'true' ? 'https' : 'http';
const host: string = process.env.HOST || 'localhost';

// Define Swagger options
const options: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'API documentation for your Node.js application',
    },
    servers: [
      {
        url: process.env.FRONTEND_URL || `${protocol}://${host}:${port}`, // Update with your server URL
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*'], // Path to the API routes
};

// Generate Swagger specs
const specs = swaggerJsdoc(options);

// Define Swagger configuration
const swaggerConfig: SwaggerConfig = {
  port,
  protocol,
  host,
  swaggerEnabled: process.env.SWAGGER_ENABLED === 'true' || true,
  swaggerRoute: process.env.SWAGGER_ROUTE || '/api-docs',
};

// Export a function to set up Swagger UI
export default (app: Express): void => {
  // Check if Swagger is enabled in the .env file
  if (swaggerConfig.swaggerEnabled) {
    // Use the SWAGGER_ROUTE from .env or fallback to '/api-docs'
    app.use(swaggerConfig.swaggerRoute, swaggerUi.serve, swaggerUi.setup(specs));
    console.log(`Swagger UI is available at ${swaggerConfig.swaggerRoute}`);
  } else {
    console.log('Swagger UI is disabled.');
  }
};