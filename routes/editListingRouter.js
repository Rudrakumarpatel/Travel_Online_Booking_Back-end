import express from 'express';
import {editHolidayPackage} from '../Controllers/editListingController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/editHolidayPackage",verifyToken,editHolidayPackage);

export default router;