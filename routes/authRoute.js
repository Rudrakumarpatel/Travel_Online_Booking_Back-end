import express from 'express';
import { sendOTP, verifyOTP, googleAuth, User_emailAuth, Vendor_emailAuth } from '../Controllers/authController.js';
import { body, validationResult } from 'express-validator';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to send OTP
router.post('/send-otp', sendOTP);

// Route to verify OTP
router.post('/verify-otp', verifyOTP);

// Route to authenticate via Google (Google OAuth2)
router.post('/google-auth', googleAuth);

// Route to authenticate via Email/Password
router.post('/user-email-auth', [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required')], User_emailAuth);

router.post('/vendor-emailauth',[ body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),body("mobile").notEmpty().isMobilePhone('any')], Vendor_emailAuth);

export default router;
