

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url'
import { logger } from './app.js';

async function loadModels(dbType, sequelize, mongoose, modelsPath, shouldLogModels = false) {
    const files = fs.readdirSync(modelsPath); // Read all files in the models directory

    for (const file of files) {
        // Skip files that don't match the current DB_TYPE
        if (dbType === "mysql" && !file.endsWith('Mysql.js')) continue;
        if (dbType === "mongo" && !file.endsWith('Mongo.js')) continue;

        const filePath = path.join(modelsPath, file); // Get the full path of the file
        const fileUrl = pathToFileURL(filePath).href; // Convert the file path to a file:// URL

        try {
            const modelModule = await import(fileUrl); // Dynamically import the model

            // Check if the module has a default export (the model function)
            if (modelModule.default) {
                if (dbType === "mysql") {
                    const model = modelModule.default(sequelize); // Initialize the Sequelize model
                    if (model && model.name && typeof model === 'function') {
                        console.warn(`Valid Sequelize model: ${filePath}`);
                        sequelize.models[model.name] = model; // Add the model to Sequelize
                    } else {
                        if (shouldLogModels) {
                            logger.warn(`Skipping invalid Sequelize model in file ${filePath}`);
                        }
                    }
                } else if (dbType === "mongo") {
                    const model = modelModule.default(mongoose); // Initialize the Mongoose model
                    if (model && model.modelName) {
                        console.warn(`Valid Mongoose model: ${filePath}`);
                        // Mongoose models are automatically registered, so no need to add them manually
                    } else {
                        if (shouldLogModels) {
                            logger.warn(`Skipping invalid Mongoose model in file ${filePath}`);
                        }
                    }
                }
            }
        } catch (error) {
            logger.error(`Error loading model from file ${filePath}:`, error);
        }
    }
}

export default loadModels;
