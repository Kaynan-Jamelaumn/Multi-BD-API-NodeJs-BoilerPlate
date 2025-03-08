import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import { pathToFileURL } from 'url';
import sequelizeConfiguration from "../../dbconfig/databaseSequelize.js";

// Recursively searches for a model file in a directory and its subdirectories
async function findModelFile(startPath, targetNames) {
  const entries = await fs.readdir(startPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(startPath, entry.name);
    // If it's a directory, search recursively
    if (entry.isDirectory()) {
      const found = await findModelFile(fullPath, targetNames);
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

/**
 * Dynamically imports models based on the controller name and DB configuration
 * @param {string} fileUrl - The URL of the controller file
 * @returns {Promise<object>} - The loaded model
 * @throws {Error} - If model file cannot be found or loaded
 */
export async function getModel(fileUrl) {
  try {
    // Extract filename from URL and remove extension
    const fileName = fileUrl.split('/').pop().replace('.js', '');
    
    // Extract base model name by removing 'Controller' suffix
    const firstWord = fileName.replace(/Controller$/, '');
    
    // Capitalize first letter for case-insensitive matching
    const capitalizedFirstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
    
    // Get base path for models directory
    const modelsBasePath = join(dirname(fileURLToPath(import.meta.url)), '../models');
    
    // Determine database type from environment variable
    const dbType = process.env.DB_TYPE.toLowerCase();
    
    // Define search order: primary DB type first, then fallback
    const searchDirs = [dbType, dbType === 'mysql' ? 'mongo' : 'mysql'];
    
    let model;
    let foundPath = null;

    // Search through directories in order
    for (const dir of searchDirs) {
      const fullDirPath = join(modelsBasePath, dir);
      
      // Determine appropriate suffix for current directory
      const suffix = dir === 'mysql' ? 'Mysql' : 'Mongo';
      
      // Generate all possible filename variations
      const targetFiles = [
        `${firstWord}${suffix}.js`,       // e.g., userMysql.js
        `${capitalizedFirstWord}${suffix}.js`, // e.g., UserMysql.js
        `${firstWord}.js`,               // e.g., user.js
        `${capitalizedFirstWord}.js`     // e.g., User.js
      ];

      try {
        // Check if directory exists
        await fs.access(fullDirPath, fs.constants.F_OK);
        
        // Search for model file recursively
        const modelPath = await findModelFile(fullDirPath, targetFiles);
        
        if (modelPath) {
          foundPath = modelPath;
          break;
        }
      } catch (err) {
        // Directory doesn't exist, continue to next
        continue;
      }
    }

    // If not found in type-specific directories, search root models directory
    if (!foundPath) {
      const suffixes = ['Mysql', 'Mongo'];
      for (const suffix of suffixes) {
        const targetFiles = [
          `${firstWord}${suffix}.js`,
          `${capitalizedFirstWord}${suffix}.js`,
          `${firstWord}.js`,
          `${capitalizedFirstWord}.js`
        ];
        
        const modelPath = await findModelFile(modelsBasePath, targetFiles);
        if (modelPath) {
          foundPath = modelPath;
          break;
        }
      }
    }

    // If no model file was found, throw error
    if (!foundPath) {
      throw new Error(`Model file not found for ${firstWord} in ${searchDirs.join(' or ')} directories`);
    }

    // Convert found path to file URL and import the model
    const modelUrl = pathToFileURL(foundPath).href;
    const modelModule = await import(modelUrl);
    model = modelModule.default;

    // If it's a MySQL model, initialize it with Sequelize configuration
    if (dbType === 'mysql') {
      model = model(sequelizeConfiguration);
    }

    return model;
  } catch (error) {
    // Log and rethrow error with additional context
    console.log(`Error loading model for file ${fileUrl}:`, error);
    throw new Error(`Failed to load model for file ${fileUrl}`);
  }
}