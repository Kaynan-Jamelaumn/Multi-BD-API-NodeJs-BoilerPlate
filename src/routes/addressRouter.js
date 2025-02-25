import { Router } from 'express';
import AddressController from '../controllers/addressController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = new Router();

// Create a new address (requires authentication)
router.post('/create', authMiddleware, AddressController.create);

// Get all addresses for the authenticated user
router.get('/get', authMiddleware, AddressController.getUserAddresses);

// Get a specific address by ID (must be the owner)
router.get('/get/:addressId?', authMiddleware, AddressController.getAddressById);


// Get a specific addresses by User ID
router.get('/get-user-addresses/:userId?', authMiddleware, AddressController.getByUserId);

// Update an existing address
router.put('/update/:addressId?', authMiddleware, AddressController.update);

// Delete an address by ID
router.delete('/delete/:addressId?', authMiddleware, AddressController.delete);

// Set an address as primary
router.put('/set-primary/:userId?/:addressId?', authMiddleware, AddressController.setPrimaryAddress);

// Get the primary address of a user
router.get('/primary/:userId?', authMiddleware, AddressController.getPrimaryAddress);

export default router;
