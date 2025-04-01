import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import { packageViewDetails } from "../Controllers/ListingViewDetailsController.js";

const router = express.Router();

router.get("/packageViewDetails",packageViewDetails);

export default router; 