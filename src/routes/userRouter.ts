// src/routes/userRouter.ts

import { Router } from 'express';
import UserController from '../controllers/userController.js';


import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import uploadMiddlware from '../utils/fileUpload.js';

const router =  Router();
/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               bio:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               role:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/create/', uploadMiddlware.single('profilePicture'), UserController.create);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
router.post('/login/', UserController.login);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Internal server error
 */
router.get('/logout/', UserController.logout);

/**
 * @swagger
 * /users/update/{userId}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               bio:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               role:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/update/:userId?', authMiddleware, uploadMiddlware.single('profilePicture'), UserController.update);

/**
 * @swagger
 * /users/get:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       404:
 *         description: No users found
 *       500:
 *         description: Internal server error
 */
router.get('/get/', UserController.getUsers);

/**
 * @swagger
 * /users/getActive:
 *   get:
 *     summary: Get all active users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active users
 *       404:
 *         description: No active users found
 *       500:
 *         description: Internal server error
 */
router.get('/getActive/', authMiddleware, adminMiddleware, UserController.getActiveUsers);

/**
 * @swagger
 * /users/getInactive:
 *   get:
 *     summary: Get all inactive users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of inactive users
 *       404:
 *         description: No inactive users found
 *       500:
 *         description: Internal server error
 */
router.get('/getInactive/', authMiddleware, adminMiddleware, UserController.getInactiveUsers);

/**
 * @swagger
 * /users/self/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/self/:userId?', UserController.self);

/**
 * @swagger
 * /users/delete/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:userId?',authMiddleware,  UserController.delete);

/**
 * @swagger
 * /users/reactivate/{userId}:
 *   put:
 *     summary: Reactivate a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User reactivated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/reactivate/:userId?', UserController.reactivate);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: The search term
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: The role to filter by
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: The field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: The sort order (asc or desc)
 *     responses:
 *       200:
 *         description: List of users matching the search criteria
 *       500:
 *         description: Internal server error
 */
router.get('/search/', authMiddleware, UserController.searchUsers);
// router.delete('/delete/', authMiddleware, UserController.delete);
export default router;