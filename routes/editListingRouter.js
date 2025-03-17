import express from 'express';
import {DeleteHolidayPackage, editHolidayPackage} from '../Controllers/editListingController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put("/editHolidayPackage",verifyToken,editHolidayPackage);
router.delete("/DeleteHolidayPackage",verifyToken,DeleteHolidayPackage)

export default router;