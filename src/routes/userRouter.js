import { Router } from 'express';
import UserController from '../controllers/UserController.js';
const router = new Router();
//import loginrequired from '../middlewares/loginrequired';

router.post('/create/', UserController.create);
router.post('/login/', UserController.login);
// router.get('/', authMiddleware, userController.index);
// router.get('/:id', UserController.filterById);
// router.put('/update/', authMiddleware, UserController.update);
// router.delete('/delete/', authMiddleware, UserController.delete);
export default router;