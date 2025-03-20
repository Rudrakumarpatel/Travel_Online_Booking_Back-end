import express from 'express';
import Vendor from '../models/Vendor.js';
import Listing from '../models/Listing.js';
import HolidayPackage from '../models/HolidayPackage.js';

export const display_HolidayPackages = async (req, res) => {
  try {
    const id = req.id;

    const vendor = await Vendor.findOne({ where: { id } });

    if (!vendor) {
      return res.status(400).json({ message: "Vendor not found" });
    }

    // Fetch Holiday
    const holidayPackages = await HolidayPackage.findAll({
      include: [
        {
          model: Listing,
          where: { vendorId: id, type: 'HolidayPackage' },
          attributes: ['city']
        }
      ],
      attributes: ['id','listingId','name', 'activeStatus']
    });

    if (!holidayPackages.length) {
      return res.status(200).json({ message: "No Holiday Packages found" });
    }

    // Format response
    const formattedResponse = holidayPackages.map(pkg => ({
      id:pkg.id,
      listingId:pkg.listingId,
      city: pkg.Listing.city,
      holidayPackageName: pkg.name,
      status: pkg.activeStatus
    }));

    return res.status(200).json({holidayPackages: formattedResponse });

  } catch (error) {
    console.error("Error fetching holiday packages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
