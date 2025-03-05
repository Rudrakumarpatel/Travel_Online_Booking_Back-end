import express from 'express';
import Vendor from '../models/Vendor.js';
import Listing from '../models/Listing.js';
import HolidayPackage from '../models/holidayPackage.js';
import { addFirstListingEmail } from '../Email_Sending/Email_Sending.js';


export const addHolidayPackage = async (req, res) => {
  try {
    const id = req.id;
    const { name, city, country, description, isdiscount, checkAvailable, images, packages } = req.body;

    // Step 1: Check if Vendor Exists
    const vendor = await Vendor.findByPk(id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const listingCount = await Listing.count({ where: { vendorId: id } });
    let listing = null;
    console.log("listing Count",listingCount);
    if (listingCount !== 0) {
      listing = await Listing.findOne({ where: { vendorId: id, city } });
    }
    
    // Step 2: Check if Listing Exists for the City
    if (!listing) {
      listing = await Listing.create({
        vendorId: id,
        type: 'HolidayPackage',
        name,
        city,
        country,
        description: description || '',
        isdiscount: isdiscount || false,
        checkAvailable: checkAvailable || false,
        images: images || []
      });
    }
    
    // Step 3: Add HolidayPackages to the Existing Listing
    if (packages && Array.isArray(packages)) {
      await HolidayPackage.bulkCreate(
        packages.map(pkg => ({
          listingId: listing.id,
          name: pkg.name,
          price: pkg.price,
          discount: pkg.discount || 0,
          percentageDiscount: (pkg.discount / pkg.price) * 100,
          location: pkg.location,
          itinerary: pkg.itinerary || '',
          visitors: Math.max(1, Math.floor(pkg.price / 1000)),
          startTime: pkg.startTime || null,
          leavingTime: pkg.leavingTime || null,
          duration: pkg.duration || '',
          image: pkg.image || '',
          activeStatus:pkg.activeStatus
        }))
      );
    }
    
    // Step 4: Update Vendor activePackages and UpdatePackage
    if (packages && Array.isArray(packages)) {
        packages.map(async (pkg) =>{
        vendor.activePackages = vendor.activePackages + 1;
        vendor.packagesUploaded = vendor.packagesUploaded + 1;
          await vendor.save();
        });
      }

    // Step 5: Send Email if this is the first listing created by the vendor
    if(listingCount === 0) {
      addFirstListingEmail(vendor.email,vendor.name,listing.name);
    }
    return res.status(201).json({ message: "Holiday Packages added successfully", listingId: listing.id });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
