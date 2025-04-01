import { UpdateProfileEmail } from '../utility/Email_Sending.js';
import Vendor from '../models/Vendor.js';
import HolidayPackage from '../models/holidayPackage.js';
import Listing from '../models/Listing.js';

export const packageViewDetails = async (req, res) => {
  try {
    const { holidayPackageId } = req.body;

    if (!holidayPackageId) {
      return res.status(400).json({ error: "holidayPackageId is required" });
    }

    const packageDetails = await HolidayPackage.findOne({
      where: { id: holidayPackageId },
      include: {
        model: Listing,
        attributes: ["id"], // Fetch Listing ID
        include: {
          model: Vendor,
          attributes: ["name", "email"], // Fetch Vendor details
        },
      },
    });

    if (!packageDetails) {
      return res.status(404).json({ message: "Package not found" });
    }

    return res.json({ packageDetails });
  } catch (error) {
    console.error("Error fetching package details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};