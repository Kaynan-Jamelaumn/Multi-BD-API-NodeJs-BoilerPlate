import { Router } from 'express';
import UserController from '../controllers/userController.js';
const router = new Router();
import authMiddleware from '../middlewares/authmiddleware.js';

router.post('/create/', UserController.create);
router.post('/login/', UserController.login);
router.put('/update/', authMiddleware, UserController.update);
// router.get('/', authMiddleware, userController.index);
// router.get('/:id', UserController.filterById);
// router.delete('/delete/', authMiddleware, UserController.delete);
export default router;