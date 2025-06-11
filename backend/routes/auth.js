import express from 'express';
import { authController } from '../controllers/auth.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/check', authenticateToken, authController.check);

export { router as auth }; 