import { Router } from 'express';
import AddressController from '../controllers/addressController.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';

const router = new Router();

// Create a new address (requires authentication)

/**
 * @swagger
 * /addresses/create:
 *   post:
 *     summary: Create a new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               country:
 *                 type: string
 *               isPrimary:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/create', authMiddleware, AddressController.create);

// Get all addresses for the authenticated user
/**
 * @swagger
 * /addresses/get:
 *   get:
 *     summary: Get all addresses for the authenticated user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of addresses
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No addresses found
 */
router.get('/get', authMiddleware, AddressController.getUserAddresses);

// Get a specific address by ID (must be the owner)
/**
 * @swagger
 * /addresses/get/{addressId}:
 *   get:
 *     summary: Get a specific address by ID
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         schema:
 *           type: string
 *         required: true
 *         description: The address ID
 *     responses:
 *       200:
 *         description: Address details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.get('/get/:addressId?', authMiddleware, AddressController.getAddressById);


// Get a specific addresses by User ID
/**
 * @swagger
 * /addresses/get-user-addresses/{userId}:
 *   get:
 *     summary: Get addresses by User ID
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of addresses for the user
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No addresses found
 */
router.get('/get-user-addresses/:userId?', authMiddleware, AddressController.getByUserId);

// Update an existing address
/**
 * @swagger
 * /addresses/update/{addressId}:
 *   put:
 *     summary: Update an existing address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         schema:
 *           type: string
 *         required: true
 *         description: The address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               country:
 *                 type: string
 *               isPrimary:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.put('/update/:addressId?', authMiddleware, AddressController.update);

// Delete an address by ID
/**
 * @swagger
 * /addresses/delete/{addressId}:
 *   delete:
 *     summary: Delete an address by ID
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         schema:
 *           type: string
 *         required: true
 *         description: The address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 */
router.delete('/delete/:addressId?', authMiddleware, AddressController.delete);

// Set an address as primary
/**
 * @swagger
 * /addresses/set-primary/{userId}/{addressId}:
 *   put:
 *     summary: Set an address as primary
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *       - in: path
 *         name: addressId
 *         schema:
 *           type: string
 *         required: true
 *         description: The address ID
 *     responses:
 *       200:
 *         description: Address set as primary successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address or user not found
 */
router.put('/set-primary/:userId?/:addressId?', authMiddleware, AddressController.setPrimaryAddress);

// Get the primary address of a user
/**
 * @swagger
 * /addresses/primary/{userId}:
 *   get:
 *     summary: Get the primary address of a user
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Primary address details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Primary address not found
 */
router.get('/primary/:userId?', authMiddleware, AddressController.getPrimaryAddress);

export default router;
