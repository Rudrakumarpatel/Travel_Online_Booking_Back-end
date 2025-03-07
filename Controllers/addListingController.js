import express from 'express';
import Vendor from '../models/Vendor.js';
import Listing from '../models/Listing.js';
import HolidayPackage from '../models/holidayPackage.js';
import { addFirstListingEmail } from '../Email_Sending/Email_Sending.js';
import moment from 'moment/moment.js';


export const addHolidayPackage = async (req, res) => {
  try {
    const id = req.id;
    const { city, country, Listingimages, name, price, discount, location, description, itinerary, startTime, leavingTime, Packageimages, activeStatus } = req.body;

    // Step 1: Check if Vendor Exists
    const vendor = await Vendor.findByPk(id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const listingCount = await Listing.count({ where: { vendorId: id } });
    let listing = null;
    console.log("Listing Count:", listingCount);

    // Step 2: Check if Listing Exists for the City
    if (listingCount !== 0) {
      listing = await Listing.findOne({ where: { vendorId: id, city } });
    }
    
    if (listing && Listingimages) {
      listing.images = [...(listing.images || []), ...(Array.isArray(Listingimages) ? Listingimages : [Listingimages])];
      await listing.save();
    }

    if (!listing) {
      listing = await Listing.create({
        vendorId: id,
        type: 'HolidayPackage',
        city,
        country,
        images: Listingimages || []
      });
    }

    // Step 3: Prevent Duplicate Packages
    const existingPackage = await HolidayPackage.findOne({
      where: { listingId: listing.id, name, location }
    });

    if (existingPackage) {
      return res.status(400).json({ message: "A package with the same name and location already exists." });
    }

    // Step 4: Create HolidayPackage
    const holidayPackage = await HolidayPackage.create({
      listingId: listing.id,
      name,
      price,
      discount: discount || 0,
      isdiscount: discount ? true : false,
      percentageDiscount: parseFloat((parseFloat(discount) / parseFloat(price)) * 100),
      location,
      itinerary: itinerary || '',
      description: description || '',
      visitors: Math.max(1, Math.floor(price / 1000)),
      startTime: startTime || null,
      leavingTime: leavingTime || null,
      duration: startTime && leavingTime
        ? moment(leavingTime).diff(moment(startTime), 'days') + ' days'
        : '',
      images: Packageimages || [],
      activeStatus: activeStatus !== false // Default to true if not provided
    });

    // Step 5: Update Vendor activePackages and packagesUploaded
    if (holidayPackage.activeStatus) {
      vendor.activePackages += 1;
    }
    vendor.packagesUploaded += 1;
    await vendor.save();

    // Step 6: Send Email if this is the first listing created by the vendor
    if (listingCount === 0) {
      addFirstListingEmail(vendor.email, vendor.name, holidayPackage.name);
    }

    return res.status(201).json({ message: "Holiday Package added successfully", holidayPackagename: holidayPackage.name, city:listing.city});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
