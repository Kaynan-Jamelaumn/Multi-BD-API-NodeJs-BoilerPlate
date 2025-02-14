

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url'
import { logger } from './app.js';

async function loadModels(sequelize, modelsPath, shouldLogModels=false) {
    const files = fs.readdirSync(modelsPath); // Read all files in the models directory

    for (const file of files) {
        const filePath = path.join(modelsPath, file); // Get the full path of the file
        const fileUrl = pathToFileURL(filePath).href; // Convert the file path to a file:// URL

        try {
            const modelModule = await import(fileUrl); // Dynamically import the model

            // Check if the module has a default export (the model function)
            if (modelModule.default) {
                const model = modelModule.default(sequelize); // Initialize the model
                logger.info(model); // Debug: Log the model object

                // Check if the model is valid (has _modelName and is a Sequelize model)
                if (model && model.name && typeof model === 'function') {
                    console.warn(`Valid model: ${filePath}`);
                    sequelize.models[model.name] = model; // Add the model to Sequelize
                } else {
                    if (shouldLogModels) {

                        logger.warn(`Skipping invalid model in file ${filePath}`);
                    }
                }
            }
        } catch (error) {
            logger.error(`Error loading model from file ${filePath}:`, error);
        }
    }
}

export default loadModels;