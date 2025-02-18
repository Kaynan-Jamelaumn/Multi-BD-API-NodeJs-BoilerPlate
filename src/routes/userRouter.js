import { Router } from 'express';
import UserController from '../controllers/userController.js';
const router = new Router();
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

router.post('/create/', UserController.create);
router.post('/login/', UserController.login);
router.put('/update/', authMiddleware, UserController.update);
router.get('/get/', UserController.getUsers);
router.get('/getActive/', adminMiddleware, UserController.getActiveUsers);
router.get('/getInactive/', adminMiddleware, UserController.getInactiveUsers);
router.get('/self/:id', UserController.self);
router.get('/self/', UserController.self);
router.get('/delete/:id', UserController.delete);
router.get('/delete/', UserController.delete);
router.get('/reactivate/:id', UserController.reactivate);
router.get('/reactivate/', UserController.reactivate);
// router.delete('/delete/', authMiddleware, UserController.delete);
export default router;