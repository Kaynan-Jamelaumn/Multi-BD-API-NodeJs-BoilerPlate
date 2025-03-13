import "dotenv/config";
import dotenvExpand from "dotenv-expand";
import path from 'path'
import fs from "fs";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { logger } from "../app.js";
import IDValidator from "../utils/IDValidator.js";
import { getDBManager } from "../manager/dbManagerFactory.js";
import { getModel } from "../utils/getModel.js";


dotenvExpand.expand(process.env);
// Dynamically import the User model based on the class name
let UserModel;
try {
  // Automatically get the class name using the current file's URL to getModel
  UserModel =  await getModel(import.meta.url); // Pass the class name
} catch (error) {
  console.log('Error loading user model:', error);
  throw new Error('Failed to load user model');
}

const dbManager = getDBManager(UserModel);

class UserController {

  // Helper method to get profile picture paths
  getProfilePicturePaths(req) {
    const uploadDir = process.env.UPLOAD_DIR || path.resolve("public/uploads");
    const relativeUploadPath = path.relative(path.resolve("public"), uploadDir); //get relative path from public folder
    const profilePicture = req.file ? `/${relativeUploadPath}/${req.file.filename}` : null;  // the Path that is saved in the bd starting from public exemple /uploads/picture.png
    const profilePictureTruePath = profilePicture ? path.join(uploadDir, req.file.filename) : null; // exemple /plublic/uploads/picture.png
    return { profilePicture, profilePictureTruePath };
  }

   // Format the user response and remove sensitive info
  formatUserResponse = (user, req) => {
    const userJson = user.toJSON();
    delete userJson.password;
    
    if (userJson.profilePicture) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      userJson.profilePicture = `${baseUrl}${userJson.profilePicture}`;
    }
    
    return userJson;
  }

  create = async (req, res) => {
    try {

      const { profilePicture, profilePictureTruePath } = this.getProfilePicturePaths(req);
      const { username, name, surname, email, password, bio, birthDate, role } = req.body;
  
      if (this.failedValidationAndDeletePhoto(
        req,
        res,
        IDValidator.validateFields({ username, name, surname, email, password, role }, { required: false }),
        profilePictureTruePath
      )) return;
  

      const isEmailAvailable = await this.checkFieldAvailability(req, res, 'email', email, null, profilePictureTruePath);
      if (!isEmailAvailable) return;
      
      const isUsernameAvailable = await this.checkFieldAvailability(req, res, 'username', username, null, profilePictureTruePath);
      if (!isUsernameAvailable) return;
  
      // Create new user
      const newUser = {
        username,
        name,
        surname,
        email,
        password,
        bio,
        profilePicture, // Save profile picture path
        birthDate,
        role: role || 'User', // Default role is 'User'
      };
  
      const createdUser = await dbManager.create(newUser);
      return res.status(201).json(this.formatUserResponse(createdUser, req));
    } catch (error) {
      logger.error('Error creating user:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  fetchUsers = async (query, res) => {
    try {
      const users = await dbManager.find(query, { 
        exclude: ['password'],
        sort: dbManager.buildSort('createdAt', 'DESC')
      });
  
      if (!users || users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
  
      const formattedUsers = users.map(user => 
        this.formatUserResponse(user, res.req));
      return res.status(200).json(formattedUsers);
    } catch (error) {
      logger.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  getUsers = async (req, res) => this.fetchUsers(null, res);// Fetch all users
  getInactiveUsers = async (req, res) => this.fetchUsers({ isActive: false }, res);// Fetch inactive users
  getActiveUsers = async (req, res) => this.fetchUsers({ isActive: true }, res);// Fetch active users
  

  self = async (req, res) => {
    try {
      const id = req.params.userId || req.body.userId;
      const user = await dbManager.findById(id, { exclude: ['password'] });

      if (!user) return res.status(404).json({ message: 'User not found.' });
      return res.status(200).json(this.formatUserResponse(user, req));
    } catch (error) {
      logger.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }


  update = async (req, res) => {
    try {
      // Use the logged-in user's ID if they are not an admin
      const id = req.user.role === 'Admin' ? req.params.userId || req.body.userId : req.user.id;
      const { username, name, surname, email, password, bio, birthDate, role } = req.body;

      const { profilePicture, profilePictureTruePath } = this.getProfilePicturePaths(req);

      const user = await dbManager.findById(id);
      if (!user) return res.status(404).json({ error: 'User not found.' });

      if (this.failedValidationAndDeletePhoto(req, res, 
        IDValidator.validateFields({ username, name, surname, email, password, role }, { required: false }),
        profilePictureTruePath
      )) return;
      
      const emailAvailable = await this.checkFieldAvailability(req, res, 'email', email, user, profilePictureTruePath);
      if (!emailAvailable) return;
      
      const usernameAvailable = await this.checkFieldAvailability(req, res, 'username', username, user, profilePictureTruePath);
      if (!usernameAvailable) return;

    const updateData = {
      username: username || user.username,
      name: name || user.name,
      surname: surname || user.surname,
      email: email || user.email,
      bio: bio || user.bio,
      profilePicture: profilePicture || user.profilePicture,
      birthDate: birthDate || user.birthDate,
      role: role || user.role,
      ...(password && { password })
    };

    const updatedUser = await dbManager.update(id, updateData);
    return res.status(200).json(this.formatUserResponse(updatedUser, req))

    } catch (error) {
      logger.error('Error updating user:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
  delete = async (req, res) => {
    try {

      // Use the logged-in user's ID if they are not an admin
      const id = req.user.role === 'Admin' ? req.params.userId || req.body.userId : req.user.id;  
      const user = await dbManager.findById(id);
      
      if (!user.isActive) return res.status(400).json({ error: 'User already deactivated.' });

      await dbManager.softDelete(id);

  
      return res.status(200).json({
        message: 'User deactivated successfully.',
        user: this.formatUserResponse(user, req)
      });
    } catch (error) {
      logger.error('Error deactivating user:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
  


  reactivate = async (req, res) => {
    try {
      const id =  req.params.userId || req.body.userId;
      const user = await dbManager.reactivate(id);
  
      if (!user) return res.status(404).json({ error: 'User not found.' });
      if (user.isActive) return res.status(400).json({ error: 'User already active.' });

      return res.status(200).json({
        message: 'User reactivated successfully.',
        user: this.formatUserResponse(user, req)
      });
    } catch (error) {
      logger.error('Error reactivating user:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }

  
  logout = async (req, res) => {
    try {
      if (process.env.TYPEAUTH === 'session') {
        req.session.destroy((err) => {
          if (err) {
            logger.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Could not log out, please try again.' });
          }
          return res.status(200).json({ message: 'Logged out successfully.' });
        });
      } else { //JWT -
        return res.status(200).json({ message: 'Logout successful (JWT-based authentication).' });
      }
    } catch (error) {
      logger.error('Error logging out:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Get user with password included
      const user = await dbManager.findOne({ email }, { exclude: [] });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Direct password comparison
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      if (user.isActive === false) {
        return res.status(403).json({ error: 'Account deactivated' });
      }
  
      // Update last login
      await dbManager.update(user.id, { 
        lastLogin: new Date() 
      });
  
      // JWT handling
      if (process.env.TYPEAUTH === 'JWT') {
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWTSECRET || "defaultsecret",
          { expiresIn: process.env.JWT_EXPIRATION || "1h" }
        );
        return res.json({ 
          user: this.formatUserResponse(user, req), 
          token 
        });
      }
  
      // Session handling
      req.session.user = { 
        id: user.id, 
        email: user.email 
      };
      return res.json({ message: 'Logged in successfully' });
  
    } catch (error) {
      logger.error('Login error:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
  searchUsers = async (req, res) => {
    try {
      const { page = 1, limit = 10, search, role, sortBy = 'createdAt', order = 'desc' } = req.query;
      const query = { isActive: true };

      if (search) {
        Object.assign(query, dbManager.buildSearchQuery(search, ['name', 'email', 'username']));
      }

      if (role) query.role = role;

      const { count, rows } = await dbManager.findAndCount(query, {
        exclude: ['password'],
        sort: [[sortBy, order.toUpperCase()]],
        offset: (page - 1) * limit,
        limit: Math.min(100, Math.max(1, parseInt(limit)))
      });

      return res.json({
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        users: rows.map(user => this.formatUserResponse(user, req))
      });
    } catch (error) {
      logger.error('Search error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Validate user by querying the appropriate database
  validateUser = async (email, password) => {
    try {
      const user = await dbManager.findOne({ email });
      
      if (!user) return null;
      
      // For MySQL instances
      if (typeof user.comparePassword === 'function') {
        const isValid = await user.comparePassword(password);
        return isValid ? user : null;
      }
      
      // Fallback for raw objects (MongoDB)
      if (user.password) {
        return await bcrypt.compare(password, user.password) ? user : null;
      }
      
      return null;
    } catch (error) {
      logger.error('Validation error:', error);
      throw error;
    }
  } 

  

  failedValidationAndDeletePhoto = (req, res, validationError, pathToDelete) => {
    if (validationError) {
      if (pathToDelete && fs.existsSync(pathToDelete)) {
        fs.unlinkSync(pathToDelete);
      }
      res.status(validationError.status).json({ error: validationError.error });
      return true;
    }
    return false;
  }
  checkFieldAvailability = async (req, res, fieldName, fieldValue, existingUser, pathToDelete) => {
    try {
      if (!fieldValue) return true;
  
      // For new user creation (existingUser is null)
      if (!existingUser) {
        const user = await dbManager.findOne({ [fieldName]: fieldValue });
        if (user) {
          this.failedValidationAndDeletePhoto(
            req,
            res,
            { error: `${fieldName} is already in use`, status: 400 },
            pathToDelete
          );
          return false;
        }
        return true;
      }
  
      // For user updates (existingUser is provided)
      if (fieldValue === existingUser[fieldName]) return true;
  
      const whereClause = {
        [fieldName]: fieldValue,
        id: { [dbManager.Op.ne]: existingUser.id }
      };
  
      const user = await dbManager.findOne(whereClause);
      if (user) {
        this.failedValidationAndDeletePhoto(
          req,
          res,
          { error: `${fieldName} is already in use`, status: 400 },
          pathToDelete
        );
        return false;
      }
      return true;
    } catch (error) {
      logger.error(`Field availability check error for ${fieldName}:`, error);
      this.failedValidationAndDeletePhoto(
        req,
        res,
        { error: 'Validation failed', status: 500 },
        pathToDelete
      );
      return false;
    }
  }
}
export default new UserController();