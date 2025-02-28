import "dotenv/config";
import dotenvExpand from "dotenv-expand";
import jwt from 'jsonwebtoken';
import { logger } from "../../app.js";
import path from 'path'
import fs from "fs";
import IDValidator from "../utils/IDValidator.js";

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
    this.checkFieldAvailability = this.checkFieldAvailability.bind(this);
    this.failedValidationAndDeletePhoto = this.failedValidationAndDeletePhoto.bind(this);
    this.create = this.create.bind(this);
    this.update =  this.update.bind(this);
    this.login =  this.login.bind(this);
    this.delete =  this.delete.bind(this);
    this.fetchUsers =  this.fetchUsers.bind(this); 
    this.getUsers = this.getUsers.bind(this);
    this.getInactiveUsers = this.getInactiveUsers.bind(this);
    this.getActiveUsers = this.getActiveUsers.bind(this);

  }

  async create(req, res) {
    try {

  
      // Dynamically construct the profile picture path
      const uploadDir = process.env.UPLOAD_DIR || path.resolve("public/uploads");
      const relativeUploadPath = path.relative(path.resolve("public"), uploadDir); //get relative path from public folder
      const profilePicture = req.file ? `/${relativeUploadPath}/${req.file.filename}` : null;  // the Path that is saved in the bd starting from public exemple /uploads/picture.png
      const profilePictureTruePath = profilePicture? path.join(uploadDir, req.file.filename) : null; // exemple /plublic/uploads/picture.png
      const { username, name, surname, email, password, bio, birthDate, role } = req.body;
  
      this.failedValidationAndDeletePhoto(req, res, IDValidator.validateFields({ username, name, surname, email, password, role }, { required: false }), profilePictureTruePath)
  
  
      const isEmailAvailable = await this.checkFieldAvailability(
        req,
        res,
        'email',
        email,
        null,
        profilePicture,
        profilePictureTruePath
      );
      if (!isEmailAvailable) return; // Stop execution if email is not available
  
      // Check if username is available
      const isUsernameAvailable = await this.checkFieldAvailability(
        req,
        res,
        'username',
        username,
        null,
        profilePicture,
        profilePictureTruePath
      );
      if (!isUsernameAvailable) return; // Stop execution if username is not available
  

  
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
  
      let createdUser;
      if (process.env.DB_TYPE === 'mongo') {
        createdUser = await UserModel.create(newUser);
      } else if (process.env.DB_TYPE === 'mysql') {
        createdUser = await UserModel.create(newUser);
      }
  
      // Return the created user (excluding the password)
      const userResponse = { ...createdUser.toJSON() };
      delete userResponse.password;

      if (userResponse.profilePicture) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        userResponse.profilePicture = `${baseUrl}${userResponse.profilePicture}`;
    }
  
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

      const baseUrl = `${res.req.protocol}://${res.req.get('host')}`;
    
      // Map users to include the full profile picture URL
      const usersWithProfilePictures = users.map(user => ({
        ...user.toJSON(),
        profilePicture: user.profilePicture ? `${baseUrl}${user.profilePicture}` : null,
      }));

      return res.status(200).json(usersWithProfilePictures);
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
      const id = req.params.userId || req.body.userId;
      let user;
  
      if (process.env.DB_TYPE === 'mongo') {
        user = await UserModel.findOne({ _id: id }); // MongoDB query
      } else if (process.env.DB_TYPE === 'mysql') {
        user = await UserModel.findOne({ where: { id: id } }); // MySQL query
      }
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
    // Convert profilePicture path to full URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const profilePictureUrl = user.profilePicture ? `${baseUrl}${user.profilePicture}` : null;

    return res.status(200).json({
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      bio: user.bio,
      birthDate: user.birthDate,
      role: user.role,
      profilePicture: profilePictureUrl, // Send full URL
    });
    } catch (error) {
      logger.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
  
  async update(req, res) {
    try {
      // Use the logged-in user's ID if they are not an admin
      const id = req.user.role === 'Admin' ? req.params.userId || req.body.userId : req.user.id;
      const { username, name, surname, email, password, bio, birthDate, role } = req.body;

      // Check if a file was uploaded
      // Dynamically construct the profile picture path
      const uploadDir = process.env.UPLOAD_DIR || path.resolve("public/uploads");
      const relativeUploadPath = path.relative(path.resolve("public"), uploadDir); //get relative path from public folder
      const profilePicture = req.file ? `/${relativeUploadPath}/${req.file.filename}` : null; // exemple /updloads/picture.png
      const profilePictureTruePath = profilePicture? path.join(uploadDir, req.file.filename) : null; // exemple /plublic/uploads/picture.png

      let user;
      if (process.env.DB_TYPE === 'mongo') {
        user = await UserModel.findById(id);
      } else if (process.env.DB_TYPE === 'mysql') {
        user = await UserModel.findByPk(id);
      }
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      this.failedValidationAndDeletePhoto(req, res,   IDValidator.validateFields({ username, name, surname, email, password, role }, { required: false }), profilePictureTruePath)
  
  
      const isEmailAvailable = await this.checkFieldAvailability(
        req,
        res,
        'email',
        email,
        user,
        profilePicture,
        profilePictureTruePath
      );
      if (!isEmailAvailable) return; // Stop execution if email is not available
  
      // Check if username is available
      const isUsernameAvailable = await this.checkFieldAvailability(
        req,
        res,
        'username',
        username,
        user,
        profilePicture,
        profilePictureTruePath
      );
      if (!isUsernameAvailable) return; // Stop execution if username is not available
  


      // Update only the modified fields
      user.username = name || user.username;
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

      if (updatedUser.profilePicture) {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        updatedUser.profilePicture = `${baseUrl}${updatedUser.profilePicture}`;
    }
  
      return res.status(200).json(updatedUser);
    } catch (error) {
      logger.error('Error updating user:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
  async delete(req, res) {
    try {
      // Use the logged-in user's ID if they are not an admin
      const id = req.user.role === 'Admin' ? req.params.userId || req.body.userId : req.user.id;
  
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
      const id =  req.params.userId || req.body.userId;
  
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
      } else { //JWT -
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

    // Update the lastLogin field to the current date
    user.lastLogin = new Date();
    await user.save(); 

    const authType = process.env.TYPEAUTH;

    if (authType === 'JWT') {
      // JWT-based authentication
      const token = jwt.sign(
        { id: user.id || user._id, email: user.email }, // Handle both MongoDB and MySQL IDs
        process.env.JWTSECRET || "defaultsecret",
        { expiresIn: process.env.JWT_EXPIRATION || "1h" } // Token expiration time
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
  
  async searchUsers(req, res) { // exp: GET /users/search?page=1&limit=10&search=john&role=User&sortBy=name&order=asc
    try {
        const page = Math.max(1, parseInt(req.query.page || '1'));
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '10')));
        const order = ['asc', 'desc'].includes(req.query.order?.toLowerCase()) ? req.query.order.toLowerCase() : 'desc';
        const { search, role, sortBy = 'createdAt' } = req.query;
        const query = { isActive: true };

        // If a search term is provided, add it to the query
        if (search) {
            if (process.env.DB_TYPE === 'mongo') {
                // For MongoDB: Use $regex for case-insensitive search on name and email fields
                query.$or = [
                    { name: { $regex: search, $options: 'i' } }, // Search in name field
                    { email: { $regex: search, $options: 'i' } }, // Search in email field
                    { username: { $regex: search, $options: 'i' } } // Search in username field
                    
                ];
            } else {
                // For MySQL: Use Sequelize's Op.like for case-insensitive search on name and email fields
                const { Op } = require('sequelize'); // Import Sequelize operators
                query[Op.or] = [
                    { name: { [Op.like]: `%${search}%` } }, // Search in name field
                    { email: { [Op.like]: `%${search}%` } }, // Search in email field
                    { username: { [Op.like]: `%${search}%` } } // Search in username field
                ];
            }
        }

        // If a role is provided, add it to the query
        if (role) {
            query.role = role; // Filter users by role (e.g., "User" or "Admin")
        }

        const options = {
            where: query, // Apply the query filters
            attributes: { exclude: ['password'] },
            order: [[sortBy, order.toUpperCase()]], // Sort by the specified field and order
            offset: (page - 1) * limit, // Calculate the offset for pagination
            limit: parseInt(limit) // Limit the number of results per page
        };

        let result;
        if (process.env.DB_TYPE === 'mongo') {
            const users = await UserModel.find(query)
                .select({ password: 0 })
                .sort({ [sortBy]: order === 'desc' ? -1 : 1 })  // Sort by field and order
                .skip((page - 1) * limit) // Skip records for pagination
                .limit(parseInt(limit)); // Limit the number of results

            // Count the total number of matching users
            const count = await UserModel.countDocuments(query);
            result = { count, rows: users };
        } else {
            // For MySQL:
            // Use Sequelize's findAndCountAll to fetch users and count total matches
            result = await UserModel.findAndCountAll(options);
        }
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // Return the response with pagination details
        res.json({
            total: result.count, // Total number of matching users
            page: parseInt(page),  // Current page number
            totalPages: Math.ceil(result.count / limit), // Total number of pages
            users: result.rows.map(user => ({
              ...user.toJSON(),
              profilePicture: user.profilePicture ? `${baseUrl}${user.profilePicture}` : null,
            }))// List of users for the current page  including mapping for the url for the profile picture
        });
    } catch (error) {
        logger.error('Search error:', error);
        res.status(500).json({ error: 'Server error' });
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


  

  failedValidationAndDeletePhoto(req, res, validationError, profilePicture, pathToDelete ){
    if (validationError) {
      // Delete the uploaded photo if it exists
      if (profilePicture && pathToDelete && fs.existsSync(pathToDelete)) {
        fs.unlinkSync(pathToDelete); // Delete the photo file
      }
  
      // Send the validation error response
      return res.status(validationError.status).json({ error: validationError.error });
    }
    
  }
  async checkFieldAvailability(req, res, fieldName, fieldValue, user, profilePicture, pathToDelete) {
    if (fieldValue) {
      // If user is provided, check if the field value is different from the existing value
      if (user && fieldValue !== user[fieldName]) {
        let existingUser;
        if (process.env.DB_TYPE === 'mongo') {
          existingUser = await UserModel.findOne({ [fieldName]: fieldValue });
        } else if (process.env.DB_TYPE === 'mysql') {
          existingUser = await UserModel.findOne({ where: { [fieldName]: fieldValue } });
        }
  
        if (existingUser) {
          this.failedValidationAndDeletePhoto(
            req,
            res,
            { error: `${fieldName} is already in use by another user.`, status: 400 },
            profilePicture,
            pathToDelete
          );
          return false; // Field is not available
        }
      } else if (!user) {
        // If no user is provided (e.g., during user creation), check if the field value already exists
        let existingUser;
        if (process.env.DB_TYPE === 'mongo') {
          existingUser = await UserModel.findOne({ [fieldName]: fieldValue });
        } else if (process.env.DB_TYPE === 'mysql') {
          existingUser = await UserModel.findOne({ where: { [fieldName]: fieldValue } });
        }
  
        if (existingUser) {
          this.failedValidationAndDeletePhoto(
            req,
            res,
            { error: `${fieldName} is already in use by another user.`, status: 400 },
            profilePicture,
            pathToDelete
          );
          return false; // Field is not available
        }
      }
    }
    return true; // Field is available
  }

}

export default new UserController();