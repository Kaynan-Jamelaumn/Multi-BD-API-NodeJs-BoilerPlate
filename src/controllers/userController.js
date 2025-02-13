import jwt from 'jsonwebtoken';
import { logger } from '../../app.js';
import "dotenv/config";
import dotenvExpand from "dotenv-expand";
dotenvExpand.expand(process.env);

// Dynamically import the appropriate model based on DB_TYPE
let UserModel;
try {
  if (process.env.DB_TYPE === 'mongo') {
    UserModel = (await import('../models/UserMongo.js')).default;
  } else if (process.env.DB_TYPE === 'mysql') {
    UserModel = (await import('../models/UserMysql.js')).default;
  } else {
    throw new Error('Invalid DB_TYPE in .env file. Must be "mongo" or "mysql".');
  }
} catch (error) {
  logger.error('Error loading user model:', error);
  throw new Error('Failed to load user model');
}

class UserController {
  async login(req, res) {
    const { email, password } = req.body;

    // Validate user
    const user = await this.validateUser(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const authType = process.env.TYPEAUTH;

    if (authType === 'JWT') {
      // JWT-based authentication
      const token = jwt.sign(
        { id: user.id || user._id, email: user.email }, // Handle both MongoDB and MySQL IDs
        process.env.JWTSECRET || "defaultsecret",
        { expiresIn: '1h' } // Token expiration time
      );

      return res.json({ token });
    } else if (authType === 'session') {
      // Session-based authentication
      req.session.user = { id: user.id || user._id, email: user.email }; // Handle both MongoDB and MySQL IDs
      return res.json({ message: 'Logged in successfully' });
    } else {
      return res.status(500).json({ error: 'Invalid authentication type' });
    }
  }

  // Validate user by querying the appropriate database
  async validateUser(email, password) {
    try {
      let user;

      if (process.env.DB_TYPE === 'mongo') {
        // MongoDB query
        user = await UserModel.findOne({ email });
      } else if (process.env.DB_TYPE === 'mysql') {
        // MySQL query
        user = await UserModel.findOne({ where: { email } });
      }

      // Check if user exists and password is correct
      if (user && (await user.comparePassword(password))) {
        return user;
      }

      return null; // User not found or password mismatch
    } catch (error) {
      logger.error('Error validating user:', error);
      throw error;
    }
  }
}

export default new UserController();