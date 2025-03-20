import express from 'express';
import {DeleteHolidayPackage, editHolidayPackage, editPackageGetData} from '../Controllers/editListingController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put("/editHolidayPackage",verifyToken,editHolidayPackage);
router.delete("/DeleteHolidayPackage",verifyToken,DeleteHolidayPackage);
router.get("/editPackageGetData",verifyToken,editPackageGetData);

export default router;