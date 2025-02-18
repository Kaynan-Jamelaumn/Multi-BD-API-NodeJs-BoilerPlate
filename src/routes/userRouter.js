import { Router } from 'express';
import UserController from '../controllers/userController.js';
const router = new Router();
import authMiddleware from '../middlewares/authmiddleware.js';

router.post('/create/', UserController.create);
router.post('/login/', UserController.login);
router.put('/update/', authMiddleware, UserController.update);
router.get('/get/', UserController.getUsers);
router.get('get/:id', UserController.getUser);
// router.delete('/delete/', authMiddleware, UserController.delete);
export default router;