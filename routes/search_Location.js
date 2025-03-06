import express from 'express';
import { searchLocation } from '../Controllers/searchController.js';
import { body, validationResult } from 'express-validator';
const router = express.Router();

// Route to search location
router.post('/search-location', [
  body('city').notEmpty().withMessage('Location is required'),
],searchLocation);

export default router;