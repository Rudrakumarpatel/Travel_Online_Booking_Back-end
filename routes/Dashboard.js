import express from 'express';
import verifyToken from '../middlewares/authMiddleware.js';
import { display_HolidayPackages } from '../Controllers/displayListingController.js';

const router = express.Router();

router.get("/Vendor_Dashboard/Display_HolidayPackage",verifyToken,display_HolidayPackages);

export default router;