import express from 'express';
import { allHolidayPackages } from '../Controllers/listringController.js';

const router = express.Router();

router.get("/allHolidayPackages",allHolidayPackages);

export default router;