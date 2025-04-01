import express from 'express';
import {addHolidayPackage,addHotel} from '../Controllers/addListingController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get("/payment",verifyToken, (req, res) => {
    res.send("Payment route is working");
});

export default router;