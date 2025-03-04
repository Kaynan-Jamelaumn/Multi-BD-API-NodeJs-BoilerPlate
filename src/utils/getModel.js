import sequelizeConfiguration from "../../dbconfig/databaseSequelize.js";

// Function to dynamically import models based on the first word of the class name
export async function getModel(fileUrl) {
  try {
    // Extract the filename from the file URL (e.g., "addressController.js")
    const fileName = fileUrl.split('/').pop().replace('.js', '');

    // Extract the first word of the filename (e.g., "address" from "addressController")
    const firstWord = fileName.replace(/Controller$/, ''); // Removes "Controller" suffix

    let model;
    if (process.env.DB_TYPE === 'mongo') {
      model = (await import(`../models/${firstWord}Mongo.js`)).default;
    } else if (process.env.DB_TYPE === 'mysql') {
      const modelModule = (await import(`../models/${firstWord}Mysql.js`)).default;
      model = modelModule(sequelizeConfiguration); // Initialize the Sequelize model
    } else {
      throw new Error('Invalid DB_TYPE in .env file. Must be "mongo" or "mysql".');
    }
    return model;
  } catch (error) {
    console.log(`Error loading model for file ${fileUrl}:`, error);
    throw new Error(`Failed to load model for file ${fileUrl}`);
  }
}