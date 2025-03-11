import express from 'express';
import {addHolidayPackage} from '../Controllers/addListingController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/addHolidayPackage",verifyToken,addHolidayPackage);

export default router;