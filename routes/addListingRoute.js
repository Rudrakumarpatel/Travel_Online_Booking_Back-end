import express from 'express';
import {addHolidayPackage,addHotels} from '../Controllers/addListingController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/addHolidayPackage",verifyToken,addHolidayPackage);
router.post("/addHotels",verifyToken,addHotels);

export default router;