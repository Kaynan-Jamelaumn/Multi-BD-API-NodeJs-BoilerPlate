import jwt from 'jsonwebtoken';
import { logger } from "../../app.js";
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
  console.log('Error loading user model:', error);
  throw new Error('Failed to load user model');
}

class UserController {
  constructor() {
    this.validateUserData = this.validateUserData.bind(this);
    this.create = this.create.bind(this);
    this.update =  this.update.bind(this);
  }
  async create(req, res) {
    try {
      logger.info("Raw Body:", req.body); // Log the raw body
      // Check if req.body exists
      if (!req.body) {

        return res.status(400).json({ error: 'Request body is missing.' });
      }
  
      const { name, surname, email, password, bio, profilePicture, birthDate, role } = req.body;
  
      // Validate user data
      await this.validateUserData({ name, surname, email, password });
  
      // Check if user already exists
      let existingUser;
      if (process.env.DB_TYPE === 'mongo') {
        existingUser = await UserModel.findOne({ email });
      } else if (process.env.DB_TYPE === 'mysql') {
        existingUser = await UserModel.findOne({ where: { email } });
      }
  
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists.' });
      }
  
      // Create new user
      const newUser = {
        name,
        surname,
        email,
        password,
        bio,
        profilePicture,
        birthDate,
        role: role || 'User', // Default role is 'User'
      };
  
      let createdUser;
      if (process.env.DB_TYPE === 'mongo') {
        createdUser = await UserModel.create(newUser);
      } else if (process.env.DB_TYPE === 'mysql') {
        createdUser = await UserModel.create(newUser);
      }
  
      // Return the created user (excluding the password)
      const userResponse = { ...createdUser.toJSON() };
      delete userResponse.password;
  
      return res.status(201).json(userResponse);
    } catch (error) {
      logger.error('Error creating user:', error);
      return res.status(400).json({ error: error.message });
    }
  }
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
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, surname, email, password, bio, profilePicture, birthDate, role } = req.body;
  
      let user;
      if (process.env.DB_TYPE === 'mongo') {
        user = await UserModel.findById(id);
      } else if (process.env.DB_TYPE === 'mysql') {
        user = await UserModel.findByPk(id);
      }
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
        await this.validateUserData({
          name: name || user.name,
          surname: surname || user.surname,
          email: email || user.email,
          password: password || user.password,
        });
  
      if (email && email !== user.email) {
        let existingUser;
        if (process.env.DB_TYPE === 'mongo') {
          existingUser = await UserModel.findOne({ email });
        } else if (process.env.DB_TYPE === 'mysql') {
          existingUser = await UserModel.findOne({ where: { email } });
        }
  
        if (existingUser) {
          return res.status(400).json({ error: 'Email is already in use by another user.' });
        }
      }
  
      // Update only the modified fields
      user.name = name || user.name;
      user.surname = surname || user.surname;
      user.email = email || user.email;
      user.bio = bio || user.bio;
      user.profilePicture = profilePicture || user.profilePicture;
      user.birthDate = birthDate || user.birthDate;
      user.role = role || user.role;
  
      // Password hash will be automatically be updated by the hooks on the DB 
      if (password) {
        user.password = password;
      }
  
      await user.save();
  
      const updatedUser = { ...user.toJSON() };
      delete updatedUser.password;
  
      return res.status(200).json(updatedUser);
    } catch (error) {
      logger.error('Error updating user:', error);
      return res.status(500).json({ error: 'Internal server error.' });
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


  async validateUserData(userData) {
    const { name, surname, email, password } = userData;
  
    // Validate required fields
    if (!name || !surname || !email || !password) {
      throw new Error('All fields (name, surname, email, password) are required.');
    }

    // Validate name and surname length
    if (name.length < 2 || surname.length < 2) {
      throw new Error('Name and surname must be at least 2 characters long.');
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format.');
    }

    // Validate password length and strength
    //const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; <- password regex including special chars
    const passwordREgex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter and a number.');
    }
     // Validate role
    if (role && !['User', 'Admin'].includes(role)) {
      throw new Error('Invalid role. Allowed values are "User" or "Admin".');
    }
  
  }
}

export default new UserController();