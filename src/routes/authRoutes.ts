// Define authentication routes; signup, login, refresh-token, logout, and profile.

import express from 'express';
import * as authController from '../controllers/authController';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/profile', authController.getUserProfile);

export default router;
