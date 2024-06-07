import express from 'express';
import { register } from '../controllers/users.register.js';
import { login } from '../controllers/users.login.js';
import { logout } from '../controllers/users.logout.js';
import { upload } from '../middlewares/multer.middlewares.js';
import { authmiddleware } from '../middlewares/verifyAccessToken.middlewares.js';
import { refreshAccessToken } from '../middlewares/refreshAccessToken.middlewares.js';
import { createMessage } from '../controllers/users.loginedpage.createMessage.js';
import { sendMessBox } from '../controllers/users.loginedPage.sendMessBox.js';
import { changePassword } from '../controllers/users.changePassword.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', upload.fields([{ name: 'userPhoto', maxCount: 1 }]), register);
router.post('/refresh-token', refreshAccessToken);

// Secured routes (requires authentication)
router.post('/password', authmiddleware, changePassword);
router.post('/:otherUserName/message/send', authmiddleware, createMessage);
router.post('/:otherUserName/message/:page', authmiddleware, sendMessBox);
router.post('/logout', logout);

export default router;
