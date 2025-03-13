import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Logger } from 'winston';
import mongoose from 'mongoose';
import {DatabaseConfig} from './types/database.js'

// Define a type alias for Mongoose to avoid circular reference issues
type MongooseType = typeof mongoose;

async function loadModels(
    dbType: 'mysql' | 'mongo',
    sequelize: any,
    mongooseInstance: MongooseType,
    modelsPath: string,
    shouldLogModels: boolean = false,
    logger: Logger
): Promise<void> {
    const entries = fs.readdirSync(modelsPath, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = path.join(modelsPath, entry.name);

        if (entry.isDirectory()) {
            await loadModels(dbType, sequelize, mongooseInstance, entryPath, shouldLogModels, logger);
            continue;
        }

        if (!isValidDatabaseFile(dbType, entry.name)) continue;

        await processModelFile(dbType, entryPath, {
            sequelize,
            mongooseInstance,
            shouldLogModels,
            logger
        });
    }
}

// Validation helpers
function isValidDatabaseFile(dbType: string, fileName: string): boolean {
    const suffixMap = {
        mysql: 'Mysql.js',
        mongo: 'Mongo.js'
    };
    return fileName.endsWith(suffixMap[dbType as keyof typeof suffixMap]);
}

// Processing functions
async function processModelFile(
    dbType: 'mysql' | 'mongo',
    filePath: string,
    context: {
        sequelize: any,
        mongooseInstance: MongooseType,
        shouldLogModels: boolean,
        logger: Logger
    }
) {
    try {
        const modelModule = await import(pathToFileURL(filePath).href);
        if (!modelModule?.default) {
            context.logger.warn(`File ${filePath} has no default export`);
            return;
        }

        if (dbType === 'mysql') {
            await handleSequelizeModel(modelModule.default, filePath, context);
        } else {
            await handleMongooseModel(modelModule.default, filePath, context);
        }
    } catch (error) {
        context.logger.error(`Error loading model from ${filePath}:`, error);
    }
}

async function handleSequelizeModel(
    modelFactory: (sequelize: any) => any,
    filePath: string,
    context: {
        sequelize: any,
        logger: Logger,
        shouldLogModels: boolean
    }
) {
    const model = modelFactory(context.sequelize);
    
    if (isValidSequelizeModel(model)) {
        context.sequelize.models[model.name] = model;
        logModelValidation(true, 'Sequelize', filePath, context);
    } else {
        logModelValidation(false, 'Sequelize', filePath, context);
    }
}

async function handleMongooseModel(
    modelFactory: (mongoose: MongooseType) => any,
    filePath: string,
    context: {
        mongooseInstance: MongooseType,
        logger: Logger,
        shouldLogModels: boolean
    }
) {
    const model = modelFactory(context.mongooseInstance);
    
    if (isValidMongooseModel(model)) {
        logModelValidation(true, 'Mongoose', filePath, context);
    } else {
        logModelValidation(false, 'Mongoose', filePath, context);
    }
}

// Validation predicates
function isValidSequelizeModel(model: any): model is { name: string } {
    return typeof model?.name === 'string' && typeof model === 'function';
}

function isValidMongooseModel(model: any): model is { modelName: string } {
    return typeof model?.modelName === 'string';
}

// Logging helpers
function logModelValidation(
    isValid: boolean,
    dbType: 'Sequelize' | 'Mongoose',
    filePath: string,
    context: { logger: Logger, shouldLogModels: boolean }
) {
    if (!context.shouldLogModels) return;

    const status = isValid ? 'Valid' : 'Invalid';
    const message = `${status} ${dbType} model: ${filePath}`;
    
    isValid ? context.logger.info(message) : context.logger.warn(message);
}

export default loadModels;
