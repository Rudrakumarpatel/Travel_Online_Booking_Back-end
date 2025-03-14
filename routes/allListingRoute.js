import express from 'express';
import { allHolidayPackages } from '../Controllers/listringController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/allHolidayPackages",verifyToken,allHolidayPackages);

export default router;