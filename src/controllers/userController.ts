// src/controllers/userController

import "dotenv/config";
import dotenvExpand from "dotenv-expand";
import path from 'path';
import fs from "fs";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {Request, Response} from 'express';
import {File} from '../types/multer';

import {logger} from "../app";
import IDValidator from "../utils/IDValidator";
import {getDBManager} from "../manager/dbManagerFactory";
import {getModel} from "../utils/getModel";

import {Model} from "../types/models";
import {DBManager} from '../manager/DBManager';
import { User } from "../types/user";

import {Op} from 'sequelize';
import {StringValue} from 'ms';

// Extend Express Request type to include file property
interface RequestWithFile extends Request {
    file ? : File;
}

import dotenv from 'dotenv';
const envConfig = dotenv.config();
dotenvExpand.expand(envConfig);

// Dynamically import the User model based on the class name
let UserModel: Model;
try {
    UserModel = await getModel(import.meta.url);
} catch (error) {
    console.log('Error loading user model:', error);
    throw new Error('Failed to load user model');
}

const dbManager: DBManager < any > = getDBManager(UserModel);

class UserController {
    // Helper method to get profile picture paths
    private getProfilePicturePaths(req: RequestWithFile): {
        profilePicture: string | null,
        profilePictureTruePath: string | null
    } {
        const uploadDir = path.resolve(process.env.UPLOAD_DIR || "public/uploads");
        const relativeUploadPath = path.relative(path.resolve("public"), uploadDir); //get relative path from public folder
        const profilePicture = req.file ? `/${relativeUploadPath}/${req.file.filename}` : null; // the Path that is saved in the bd starting from public exemple /uploads/picture.png
        const profilePictureTruePath = profilePicture && req.file ? path.join(uploadDir, req.file.filename) : null; // exemple /plublic/uploads/picture.png
        return {
            profilePicture,
            profilePictureTruePath
        };
    }

    // Format the user response and remove sensitive info
    private formatUserResponse(user: any, req: Request): any {
        const userJson = user.toJSON();
        delete userJson.password;

        if (userJson.profilePicture) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            userJson.profilePicture = `${baseUrl}${userJson.profilePicture}`;
        }

        return userJson;
    }

    public create = async (req: RequestWithFile, res: Response): Promise < any > => {
        try {
            const {
                profilePicture,
                profilePictureTruePath
            } = this.getProfilePicturePaths(req);
            const {
                username,
                name,
                surname,
                email,
                password,
                bio,
                birthDate,
                role
            } = req.body;

            if (this.failedValidationAndDeletePhoto(
                    req,
                    res,
                    IDValidator.validateFields({
                        username,
                        name,
                        surname,
                        email,
                        password,
                        role
                    }, {
                        required: false
                    }),
                    profilePictureTruePath
                )) return res;

            const isEmailAvailable = await this.checkFieldAvailability(req, res, 'email', email, null, profilePictureTruePath);
            if (!isEmailAvailable) return res;

            const isUsernameAvailable = await this.checkFieldAvailability(req, res, 'username', username, null, profilePictureTruePath);
            if (!isUsernameAvailable) return res;

            const newUser = {
                username,
                name,
                surname,
                email,
                password,
                bio,
                profilePicture,
                birthDate,
                role: role || 'User',
            };

            const createdUser: User = await dbManager.create(newUser);
            return res.status(201).json(this.formatUserResponse(createdUser, req));
        } catch (error: any) {
            logger.error('Error creating user:', error);
            return res.status(400).json({
                error: error.message
            });
        }
    }

    private fetchUsers = async (query: object | null, res: Response): Promise < any > => {
        try {
            const users = await dbManager.find(query || {}, {
                exclude: ['password'],
                sort: dbManager.buildSort('createdAt', 'DESC')
            });

            if (!users || users.length === 0) {
                return res.status(404).json({
                    message: 'No users found'
                });
            }

            const formattedUsers = users.map(user =>
                this.formatUserResponse(user, res.req as Request));
            return res.status(200).json(formattedUsers);
        } catch (error: any) {
            logger.error('Error fetching users:', error);
            return res.status(500).json({
                error: 'Internal server error.'
            });
        }
    }

    public getUsers = async (req: Request, res: Response): Promise < any > =>
        this.fetchUsers(null, res);

    public getInactiveUsers = async (req: Request, res: Response): Promise < any > =>
        this.fetchUsers({
            isActive: false
        }, res); // Fetch inactive users

    public getActiveUsers = async (req: Request, res: Response): Promise < any > =>
        this.fetchUsers({
            isActive: true
        }, res); // Fetch active users

    public self = async (req: Request, res: Response): Promise < any > => {
        try {
            const id = req.params.userId || req.body.userId;
            const user = await dbManager.findById(id, {
                exclude: ['password']
            });

            if (!user) return res.status(404).json({
                message: 'User not found.'
            });
            return res.status(200).json(this.formatUserResponse(user, req));
        } catch (error: any) {
            logger.error('Error fetching user:', error);
            return res.status(500).json({
                error: 'Internal server error.'
            });
        }
    }

    public update = async (req: RequestWithFile, res: Response): Promise < any > => {
        try {
            const id: string = req.user && req.user.role === 'Admin' ? req.params.userId || req.body.userId : req.user && req.user.id;
            const {
                username,
                name,
                surname,
                email,
                password,
                bio,
                birthDate,
                role
            } = req.body;
            const {
                profilePicture,
                profilePictureTruePath
            } = this.getProfilePicturePaths(req);

            const user = await dbManager.findById(id);
            if (!user) return res.status(404).json({
                error: 'User not found.'
            });

            if (this.failedValidationAndDeletePhoto(req, res,
                    IDValidator.validateFields({
                        username,
                        name,
                        surname,
                        email,
                        password,
                        role
                    }, {
                        required: false
                    }),
                    profilePictureTruePath
                )) return res;

            const emailAvailable = await this.checkFieldAvailability(req, res, 'email', email, user, profilePictureTruePath);
            if (!emailAvailable) return res;

            const usernameAvailable = await this.checkFieldAvailability(req, res, 'username', username, user, profilePictureTruePath);
            if (!usernameAvailable) return res;

            const updateData = {
                username: username || user.username,
                name: name || user.name,
                surname: surname || user.surname,
                email: email || user.email,
                bio: bio || user.bio,
                profilePicture: profilePicture || user.profilePicture,
                birthDate: birthDate || user.birthDate,
                role: role || user.role,
                ...(password && {
                    password
                })
            };

            const updatedUser = await dbManager.update(id, updateData);
            return res.status(200).json(this.formatUserResponse(updatedUser, req));
        } catch (error: any) {
            logger.error('Error updating user:', error);
            return res.status(500).json({
                error: 'Internal server error.'
            });
        }
    }

    public delete = async (req: Request, res: Response): Promise < any > => {
        try {
            // Use the logged-in user's ID if they are not an admin
            const id = req.user && req.user.role === 'Admin' ? req.params.userId || req.body.userId : req.user && req.user.id;
            const user = await dbManager.findById(id);

            if (!user.isActive) return res.status(400).json({
                error: 'User already deactivated.'
            });

            await dbManager.softDelete(id);
            return res.status(200).json({
                message: 'User deactivated successfully.',
                user: this.formatUserResponse(user, req)
            });
        } catch (error: any) {
            logger.error('Error deactivating user:', error);
            return res.status(500).json({
                error: 'Internal server error.'
            });
        }
    }

    public reactivate = async (req: Request, res: Response): Promise < any > => {
        try {
            const id = req.params.userId || req.body.userId;
            const user = await dbManager.reactivate(id);

            if (!user) return res.status(404).json({
                error: 'User not found.'
            });
            if (user.isActive) return res.status(400).json({
                error: 'User already active.'
            });

            return res.status(200).json({
                message: 'User reactivated successfully.',
                user: this.formatUserResponse(user, req)
            });
        } catch (error: any) {
            logger.error('Error reactivating user:', error);
            return res.status(500).json({
                error: 'Internal server error.'
            });
        }
    }

    public logout = async (req: Request, res: Response): Promise < any > => {
        try {
            if (process.env.TYPEAUTH === 'session') {
                req.session.destroy((err) => {
                    if (err) {
                        logger.error('Error destroying session:', err);
                        return res.status(500).json({
                            error: 'Could not log out, please try again.'
                        });
                    }
                    return res.status(200).json({
                        message: 'Logged out successfully.'
                    });
                });
                return res; // For TypeScript return path
            } else { //JWT -
                return res.status(200).json({
                    message: 'Logout successful (JWT-based authentication).'
                });
            }
        } catch (error: any) {
            logger.error('Error logging out:', error);
            return res.status(500).json({
                error: 'Internal server error.'
            });
        }
    }

    public login = async (req: Request, res: Response): Promise < any > => {
        try {
            const {
                email,
                password
            } = req.body;

            // Fetch the user from the database, including the password field
            const user = await dbManager.findOne({
                email
            }, {
                exclude: []
            });

            // If no user is found, return an error
            if (!user) return res.status(401).json({
                error: 'Invalid credentials'
            });

            // Compare the provided password with the hashed password in the database
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) return res.status(401).json({
                error: 'Invalid credentials'
            });

            // Check if the user's account is deactivated
            if (user.isActive === false) return res.status(403).json({
                error: 'Account deactivated'
            });

            // Update the user's last login timestamp
            await dbManager.update(user.id, {
                lastLogin: new Date()
            });

            // Handle JWT-based authentication
            if (process.env.TYPEAUTH === 'JWT') {
                // Define the JWT secret (fallback to "defaultsecret" if not set)
                const secret: jwt.Secret = process.env.JWTSECRET || "defaultsecret";
                // Define the token expiration (fallback to "1h" if not set)
                const expiration = (process.env.JWT_EXPIRATION || "1h") as StringValue;

                // Define JWT signing options
                const options: jwt.SignOptions = {
                    expiresIn: expiration // Set the token expiration
                };

                // Generate the JWT token
                const token = jwt.sign({
                        id: user.id,
                        email: user.email
                    }, // Payload
                    secret, // Secret key
                    options // Signing options
                );

                // Return the user data and token in the response
                return res.json({
                    user: this.formatUserResponse(user, req), // Format user data
                    token // Include the JWT token
                });
            }

            // Handle session-based authentication
            (req.session as any).user = {
                id: user.id,
                email: user.email
            };
            return res.json({
                message: 'Logged in successfully'
            });

        } catch (error: any) {
            // Log the error and return a server error response
            logger.error('Login error:', error);
            return res.status(500).json({
                error: 'Internal server error.'
            });
        }
    }
    public searchUsers = async (req: Request, res: Response): Promise < any > => {
        try {
            // Extract query parameters with default values
            const {
                page = 1, limit = 10, search, role, sortBy = 'createdAt', order = 'desc'
            } = req.query;

            // Define the base query to fetch only active users
            const query: any = {
                isActive: true
            };

            // Add search functionality if a search term is provided
            if (search) {
                Object.assign(query, dbManager.buildSearchQuery(search as string, ['name', 'email', 'username']));
            }

            // Filter by role if provided
            if (role) query.role = role;

            // Fetch users with pagination, sorting, and exclusion of sensitive fields
            const {
                count,
                rows
            } = await dbManager.findAndCount(query, {
                exclude: ['password'], // Exclude password field from the response
                sort: [
                    [sortBy as string, (order as string).toUpperCase()]
                ], // Apply sorting
                offset: (Number(page) - 1) * Number(limit), // Calculate pagination offset
                limit: Math.min(100, Math.max(1, Number(limit))) // Ensure limit is within bounds
            });

            // Return the paginated and formatted user data
            return res.json({
                total: count, // Total number of users
                page: Number(page), // Current page number
                totalPages: Math.ceil(count / Number(limit)), // Total number of pages
                users: rows.map(user => this.formatUserResponse(user, req)) // Format each user
            });

        } catch (error: any) {
            logger.error('Search error:', error);
            return res.status(500).json({
                error: 'Server error'
            });
        }
    }
    // Validate user by querying the appropriate database
    public validateUser = async (email: string, password: string): Promise < any | null > => {
        try {
            const user = await dbManager.findOne({
                email
            });
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
        } catch (error: any) {
            logger.error('Validation error:', error);
            throw error;
        }
    }

    private failedValidationAndDeletePhoto(
        req: Request,
        res: Response,
        validationError: {
            valid: boolean;status: number;error: string | null
        } | null,
        pathToDelete: string | null
    ): boolean {
        // Check if validation failed
        if (validationError && !validationError.valid) {
            // Delete the uploaded photo if it exists
            if (pathToDelete && fs.existsSync(pathToDelete)) {
                fs.unlinkSync(pathToDelete);
            }
            // Return the error response
            res.status(validationError.status).json({
                error: validationError.error || null
            });
            return true;
        }
        return false;
    }

    private async checkFieldAvailability(
        req: Request,
        res: Response,
        fieldName: string,
        fieldValue: string,
        existingUser: any | null,
        pathToDelete: string | null
    ): Promise < boolean > {
        try {
            // Skip validation if the field value is empty
            if (!fieldValue) return true;

            // For new user creation (existingUser is null)
            if (!existingUser) {
                // Check if the field value is already in use
                const user = await dbManager.findOne({
                    [fieldName]: fieldValue
                });
                if (user) {
                    // Handle validation failure and delete the uploaded photo
                    this.failedValidationAndDeletePhoto(
                        req,
                        res, {
                            valid: false,
                            error: `${fieldName} is already in use`,
                            status: 400
                        },
                        pathToDelete
                    );
                    return false;
                }
                return true;
            }

            // For user updates (existingUser is provided)
            if (fieldValue === existingUser[fieldName]) return true;

            // Check if the field value is already in use by another user
            const whereClause = {
                [fieldName]: fieldValue,
                id: {
                    [Op.ne]: existingUser.id
                } // Exclude the current user
            };

            const user = await dbManager.findOne(whereClause);
            if (user) {
                // Handle validation failure and delete the uploaded photo
                this.failedValidationAndDeletePhoto(
                    req,
                    res, {
                        valid: false,
                        error: `${fieldName} is already in use`,
                        status: 400
                    },
                    pathToDelete
                );
                return false;
            }
            return true;

        } catch (error: any) {
            // Log the error and handle validation failure
            logger.error(`Field availability check error for ${fieldName}:`, error);
            this.failedValidationAndDeletePhoto(
                req,
                res, {
                    valid: false,
                    error: 'Validation failed',
                    status: 500
                },
                pathToDelete
            );
            return false;
        }
    }
}

export default new UserController();