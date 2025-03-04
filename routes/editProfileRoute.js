import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import { updateVendorProfile } from "../Controllers/editProfileController.js";

const router = express.Router();

// Update Vendor Profile
router.put("/vendorProfile", verifyToken, updateVendorProfile);

export default router;