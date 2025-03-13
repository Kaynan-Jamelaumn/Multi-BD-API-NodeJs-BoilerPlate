// swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const port: number = Number(process.env.PORT) || 8765;
const protocol: string = process.env.HTTPS_ENABLED === 'true' ? 'https' : 'http';
const host: string = process.env.HOST || 'localhost';
const options = {
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
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

export default (app: Express): void => {
  // Check if Swagger is enabled in the .env file
  const swaggerEnabled: boolean = process.env.SWAGGER_ENABLED === 'true' || true;
  if (swaggerEnabled) {
    // Use the SWAGGER_ROUTE from .env or fallback to '/api-docs'
    const swaggerRoute: string = process.env.SWAGGER_ROUTE || '/api-docs';
    app.use(swaggerRoute, swaggerUi.serve, swaggerUi.setup(specs));
    console.log(`Swagger UI is available at ${swaggerRoute}`);
  } else {
    console.log('Swagger UI is disabled.');
  }
};

