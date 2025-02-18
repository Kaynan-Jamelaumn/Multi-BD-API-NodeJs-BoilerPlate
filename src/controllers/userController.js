import "dotenv/config";
import dotenvExpand from "dotenv-expand";
import jwt from 'jsonwebtoken';
import { logger } from "../../app.js";
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
    this.validateUserDataForUpdate = this.validateUserDataForUpdate.bind(this);
    this.create = this.create.bind(this);
    this.update =  this.update.bind(this);
    this.login =  this.login.bind(this);
    this.delete =  this.delete.bind(this);
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
      await this.validateUserData({ name, surname, email, password }, res);
  
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

  async fetchUsers(query, res) {
    try {
      let users;

      if (process.env.DB_TYPE === 'mongo') {
        users = await UserModel.find(query).select({ password: 0 }); // MongoDB query
      } else if (process.env.DB_TYPE === 'mysql') {
        const whereClause = query ? { where: query } : {};
        users = await UserModel.findAll({
          ...whereClause,
          attributes: { exclude: ['password'] },
        }); // MySQL query
      }

      if (!users || users.length === 0) {
        return res.status(404).json({ message: 'No users were found' });
      }

      return res.status(200).json(users);
    } catch (error) {
      logger.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  async getUsers(req, res) {
    return this.fetchUsers(null, res); // Fetch all users
  }

  async getInactiveUsers(req, res) {
    return this.fetchUsers({ isActive: false }, res); // Fetch inactive users
  }

  async getActiveUsers(req, res) {
    return this.fetchUsers({ isActive: true }, res); // Fetch active users
  }

  async self(req, res) {
    try {
      const id = req.params.id || req.body.id;
      let user;
  
      if (process.env.DB_TYPE === 'mongo') {
        user = await UserModel.findOne({ _id: id }); // MongoDB query
      } else if (process.env.DB_TYPE === 'mysql') {
        user = await UserModel.findOne({ where: { id: id } }); // MySQL query
      }
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      return res.status(200).json(user);
    } catch (error) {
      logger.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  async update(req, res) {
    try {
      // Use the logged-in user's ID if they are not an admin
      const id = req.user.role === 'Admin' ? req.params.id || req.body.id : req.user.id;
      const { name, surname, email, password, bio, profilePicture, birthDate, role } = req.body;
      console.log('User ID:', id); 
      let user;
      if (process.env.DB_TYPE === 'mongo') {
        user = await UserModel.findById(id);
      } else if (process.env.DB_TYPE === 'mysql') {
        user = await UserModel.findByPk(id);
      }
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
  
      // Validate user data for update
      await this.validateUserDataForUpdate({
        name,
        surname,
        email,
        password,
        role,
      }, res);
  
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
  
      // Password hash will be automatically updated by the hooks on the DB
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
  async delete(req, res) {
    try {
      // Use the logged-in user's ID if they are not an admin
      const id = req.user.role === 'Admin' ? req.params.id || req.body.id : req.user.id;
  
      let user;
      if (process.env.DB_TYPE === 'mongo') {
        user = await UserModel.findById(id); // MongoDB
      } else if (process.env.DB_TYPE === 'mysql') {
        user = await UserModel.findByPk(id); // MySQL
      }
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Check if the user is already deactivated
      if (user.isActive === false) {
        return res.status(400).json({ error: 'User is already deactivated.' });
      }
  
      // Soft delete: Set isActive to false
      user.isActive = false;
  
      // Save the updated user
      if (process.env.DB_TYPE === 'mongo') {
        await user.save(); // MongoDB
      } else if (process.env.DB_TYPE === 'mysql') {
        await user.save(); // MySQL (or use user.update({ isActive: false }))
      }
  
      // Return the updated user (excluding sensitive fields like password)
      const updatedUser = user.toJSON();
      delete updatedUser.password;
  
      return res.status(200).json({ message: 'User deactivated successfully.', user: updatedUser });
    } catch (error) {
      logger.error('Error deactivating user:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  async reactivate(req, res) {
    try {
      const id =  req.params.id || req.body.id;
  
      let user;
      if (process.env.DB_TYPE === 'mongo') {
        user = await UserModel.findById(id);
      } else if (process.env.DB_TYPE === 'mysql') {
        user = await UserModel.findByPk(id);
      }
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      if (user.isActive === true) {
        return res.status(400).json({ error: 'User is already active.' });
      }
  
      user.isActive = true;
      await user.save();
  
      const updatedUser = user.toJSON();
      delete updatedUser.password;
  
      return res.status(200).json({ message: 'User reactivated successfully.', user: updatedUser });
    } catch (error) {
      logger.error('Error reactivating user:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  
  async logout(req, res) {
    try {
      if (process.env.TYPEAUTH === 'session') {
        req.session.destroy((err) => {
          if (err) {
            logger.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Could not log out, please try again.' });
          }
          return res.status(200).json({ message: 'Logged out successfully.' });
        });
      } else {
        return res.status(200).json({ message: 'Logout successful (JWT-based authentication).' });
      }
    } catch (error) {
      logger.error('Error logging out:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }


  async login(req, res) {
    const { email, password } = req.body;

    // Validate user
    const user = await this.validateUser(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if the user is active
    if (user.isActive === false) {
      return res.status(403).json({ error: 'Your account is deactivated. Please contact support.' });
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

  async validateUserData(userData, res) {
    const { name, surname, email, password, role } = userData;
  
    // Validate required fields
    if (!name || !surname || !email || !password) {
      return res.status(400).json({ error: 'All fields (name, surname, email, password) are required.' });
    }
  
    // Validate name and surname length
    if (name.length < 2 || surname.length < 2) {
      return res.status(400).json({ error: 'Name and surname must be at least 2 characters long.' });
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
  
    // Validate password length and strength
    //const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; <- password regex including special chars    //const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; <- password regex including special chars
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.',
      });
    }
  
    // Validate role
    if (role && !['User', 'Admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Allowed values are "User" or "Admin".' });
    }
  
    return true; // Validation successful
  }

  async validateUserDataForUpdate(userData, res) {
    const { name, surname, email, password, role } = userData;
  
    // Validate name and surname length if provided
    if (name && name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long.' });
    }
    if (surname && surname.length < 2) {
      return res.status(400).json({ error: 'Surname must be at least 2 characters long.' });
    }
  
    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }
    }
  
    // Validate password length and strength if provided
    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.',
        });
      }
    }
  
    // Validate role if provided
    if (role && !['User', 'Admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Allowed values are "User" or "Admin".' });
    }
  
    return true; // Validation successful
  }

}

export default new UserController();