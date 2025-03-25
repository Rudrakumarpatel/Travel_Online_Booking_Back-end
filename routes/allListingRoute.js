import express from 'express';
import { allHolidayPackages, searchHolidayPackages } from '../Controllers/listringController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/allHolidayPackages",allHolidayPackages);
router.get("/searchHolidayPackages",searchHolidayPackages);

export default router;