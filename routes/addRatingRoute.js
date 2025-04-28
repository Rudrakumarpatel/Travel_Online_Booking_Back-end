import express from 'express';
import verifyToken from '../middlewares/authMiddleware.js';
import { addRating } from '../Controllers/addRatingController.js';

const router = express.Router();

router.post("/addRating",verifyToken,addRating);

export default router;