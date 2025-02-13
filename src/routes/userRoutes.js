import { Router } from 'express';
import userController from '../controllers/UserController';
const router = new Router();
import loginrequired from '../middlewares/loginrequired';

router.post('/create/', userController.create);
router.post('/login/', userController.login);
router.get('/', authMiddleware, userController.index);
router.get('/:id', userController.filterById);
router.put('/update/', authMiddleware, userController.update);
router.delete('/delete/', authMiddleware, userController.delete);
export default router;