import { Router } from 'express';
import UserController from '../controllers/userController.js';
const router = new Router();
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import uploadMiddlware from '../utils/fileupload.js';

router.post('/create/', uploadMiddlware.single('profilePicture'), UserController.create);
router.post('/login/', UserController.login);
router.get('/logout/', UserController.logout);
router.put('/update/:userId?',  authMiddleware, uploadMiddlware.single('profilePicture'), authMiddleware, UserController.update);
router.get('/get/', UserController.getUsers);
router.get('/getActive/', authMiddleware, adminMiddleware, UserController.getActiveUsers);
router.get('/getInactive/', authMiddleware, adminMiddleware, UserController.getInactiveUsers);
router.get('/self/:userId?', UserController.self);
router.get('/delete/:userId?', UserController.delete);
router.get('/reactivate/:userId?', UserController.reactivate);
router.get('/search/', authMiddleware, UserController.searchUsers);

// router.delete('/delete/', authMiddleware, UserController.delete);
export default router;