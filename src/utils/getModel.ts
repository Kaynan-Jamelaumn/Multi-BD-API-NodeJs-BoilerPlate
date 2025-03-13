import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import { pathToFileURL } from 'url';
import sequelizeConfiguration from "../databaseSequelize.js";
import { Model, MysqlModel, MongoModel } from '../types/models.js';
import { DatabaseConfig } from '../types/database.js';

// Recursively searches for a model file in a directory and its subdirectories
async function findModelFile(startPath: string, targetNames: string[], recursive: boolean = true): Promise<string | null> {
  const entries = await fs.readdir(startPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(startPath, entry.name);
    // If it's a directory and recursive is enabled, search recursively
    if (entry.isDirectory() && recursive) {
      const found = await findModelFile(fullPath, targetNames, recursive);
      if (found) return found;
    }
    // If it's a file and matches any of the target names (case-insensitive)
    else if (entry.isFile() && targetNames.some(name => 
      entry.name.toLowerCase() === name.toLowerCase()
    )) {
      return fullPath;
    }
  }
  return null;
}

// Dynamically imports models based on the controller name and DB configuration
export async function getModel(fileUrl: string): Promise<Model> {
  try {
    // Extract filename from URL and remove extension
    const fileName = fileUrl.split('/').pop()!.replace('.js', '');

    // Extract base model name by removing 'Controller' suffix
    const firstWord = fileName.replace(/Controller$/, '');

    // Capitalize first letter for case-insensitive matching
    const capitalizedFirstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);

    // Get base path for models directory
    const modelsBasePath = join(dirname(fileURLToPath(import.meta.url)), '../models');

    // Determine database type from environment variable
    const dbType = process.env.DB_TYPE!.toLowerCase() as 'mysql' | 'mongo';

    // Define current database-specific suffix
    const currentSuffix = dbType === 'mysql' ? 'Mysql' : 'Mongo';

    // 1. Search priority: type-specific directory first (recursive)
    const typeSpecificPath = join(modelsBasePath, dbType);
    const typeSpecificFiles = [
      `${firstWord}${currentSuffix}.js`,       // e.g., userMysql.js
      `${capitalizedFirstWord}${currentSuffix}.js`, // e.g., UserMysql.js
      `${firstWord}.js`,               // e.g., user.js
      `${capitalizedFirstWord}.js`     // e.g., User.js
    ];

    let foundPath = await findModelFile(typeSpecificPath, typeSpecificFiles);

    // If not found, check root directory (non-recursive)
    if (!foundPath) {
      const rootFiles = [
        `${firstWord}${currentSuffix}.js`,
        `${capitalizedFirstWord}${currentSuffix}.js`,
        `${firstWord}.js`,
        `${capitalizedFirstWord}.js`
      ];

      foundPath = await findModelFile(modelsBasePath, rootFiles, false);
    }

    // Fallback check across all directories
    if (!foundPath) {
      const allFiles = [
        `${firstWord}${currentSuffix}.js`,
        `${capitalizedFirstWord}${currentSuffix}.js`,
        `${firstWord}${dbType === 'mysql' ? 'Mongo' : 'Mysql'}.js`,
        `${firstWord}.js`,
        `${capitalizedFirstWord}.js`
      ];

      foundPath = await findModelFile(modelsBasePath, allFiles, true);
    }

    // If no model file was found, throw error
    if (!foundPath) {
      throw new Error(`Model file not found for ${firstWord}`);
    }

    // Convert found path to file URL and import the model
    const modelUrl = pathToFileURL(foundPath).href;
    const modelModule = await import(modelUrl);
    let model: Model = modelModule.default;

    // If it's a MySQL model, initialize it with Sequelize configuration
    if (dbType === 'mysql') {
      // Cast model to MysqlModel and call it as a function
      model = (model as MysqlModel)(sequelizeConfiguration);
    }

    return model;
  } catch (error) {
    // Log and rethrow error with additional context
    console.error(`Error loading model for ${fileUrl}:`, error);
    throw new Error(`Failed to load model for ${fileUrl}`);
  }
}