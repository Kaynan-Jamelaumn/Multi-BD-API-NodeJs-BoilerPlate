import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Logger } from 'winston';
import mongoose from 'mongoose';

// Define a type alias for Mongoose to avoid circular reference issues
type MongooseType = typeof mongoose;

async function loadModels(
    dbType: string,
    sequelize: any,
    mongooseInstance: MongooseType,
    modelsPath: string,
    shouldLogModels: boolean = false,
    logger: Logger
): Promise<void> {
    const entries: fs.Dirent[] = fs.readdirSync(modelsPath, { withFileTypes: true }); // Get entries as Dirent objects

    for (const entry of entries) {
        const entryPath: string = path.join(modelsPath, entry.name);

        if (entry.isDirectory()) {
            // Recursively process directories
            await loadModels(dbType, sequelize, mongooseInstance, entryPath, shouldLogModels, logger);
            continue;
        }

        // Skip files that don't match the current DB_TYPE suffix
        if (dbType === "mysql" && !entry.name.endsWith('Mysql.js')) continue;
        if (dbType === "mongo" && !entry.name.endsWith('Mongo.js')) continue;

        const fileUrl: string = pathToFileURL(entryPath).href; // Convert the file path to a file:// URL

        try {
            const modelModule = await import(fileUrl); // Dynamically import the model

            // Check if the module has a default export (the model function)
            if (modelModule.default) {
                if (dbType === "mysql") {
                    const model = modelModule.default(sequelize); // Initialize the Sequelize model
                    if (model?.name && typeof model === 'function') {
                        if (shouldLogModels) {
                            logger.info(`Valid Sequelize model: ${entryPath}`);
                        }
                        sequelize.models[model.name] = model; // Add the model to Sequelize
                    } else {
                        if (shouldLogModels) {
                            logger.warn(`Skipping invalid Sequelize model in file ${entryPath}`);
                        }
                    }
                } else if (dbType === "mongo") {
                    const model = modelModule.default(mongooseInstance); // Initialize the Mongoose model
                    if (model?.modelName) {
                        if (shouldLogModels) {
                            logger.info(`Valid Mongoose model: ${entryPath}`);
                        }
                        // Mongoose models are automatically registered
                    } else {
                        if (shouldLogModels) {
                            logger.warn(`Skipping invalid Mongoose model in file ${entryPath}`);
                        }
                    }
                }
            }
        } catch (error) {
            logger.error(`Error loading model from file ${entryPath}:`, error);
        }
    }
}

export default loadModels;

