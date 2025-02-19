import { Router } from 'express';
import UserController from '../controllers/userController.js';
const router = new Router();
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

router.post('/create/', UserController.create);
router.post('/login/', UserController.login);
router.put('/update/:id?', authMiddleware, UserController.update);
router.get('/get/', UserController.getUsers);
router.get('/getActive/', authMiddleware, adminMiddleware, UserController.getActiveUsers);
router.get('/getInactive/', authMiddleware, adminMiddleware, UserController.getInactiveUsers);
router.get('/self/:id?', UserController.self);
router.get('/delete/:id?', UserController.delete);
router.get('/reactivate/:id?', UserController.reactivate);
router.get('/search/', authMiddleware, UserController.searchUsers);

// router.delete('/delete/', authMiddleware, UserController.delete);
export default router;