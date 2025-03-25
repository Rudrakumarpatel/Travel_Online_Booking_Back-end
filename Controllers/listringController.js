import { readFileSync } from 'fs';
import fs from 'fs';
import { readFile } from 'fs/promises';
import Listing from '../models/Listing.js';
import HolidayPackage from '../models/holidayPackage.js';
import { Op } from 'sequelize';

// Fetch all holiday packages
export const allHolidayPackages = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: { type: 'HolidayPackage' },
      attributes: ['id','city', 'country', 'images'],
      include: [{
        model: HolidayPackage,
        attributes: [
          'id', 'name', 'price','discount', 'isdiscount',
          'percentageDiscount', 'location', 'itinerary',
          'description',
          'visitors', 'startTime', 'leavingTime', 'duration',
          'activeStatus', 'images','packageImages'
        ]
      }]
    });

    const formattedListings = listings.map(listing => ({
      id: listing.id,
      city: listing.city,
      country: listing.country,
      images: listing.images,
      HolidayPackages: listing.HolidayPackages.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        discount:pkg.discount,
        isdiscount:pkg.isdiscount,
        percentageDiscount: pkg.percentageDiscount,
        location: pkg.location,
        itinerary: pkg.itinerary,
        description:pkg.description,
        visitors: pkg.visitors,
        startTime: pkg.startTime,
        leavingTime: pkg.leavingTime,
        duration: pkg.duration,
        images: pkg.images,
        packageImages:pkg.packageImages
      }))
    }));
    
    return res.json(formattedListings);
  } catch (error) {
    console.error('Error fetching holiday packages:', error);
    return res.status(500).json({ error: 'Failed to fetch holiday packages' });
  }
};


export const searchHolidayPackages = async (req, res) => {
  try {
    const { cityOrCountry, departureDate} = req.body;

    if (!cityOrCountry) {
      return res.status(400).json({ message: "City or Country is required." });
    }

    // Prepare filters
    let whereCondition = { activeStatus: true };

    if (departureDate) {
      whereCondition.startTime = { [Op.gte]: new Date(departureDate) };
    }

    const holidayPackages = await HolidayPackage.findAll({
      include: [
        {
          model: Listing,
          where: {
            [Op.or]: [{ city: cityOrCountry }, { country: cityOrCountry }],
          },
          attributes: ["city", "country"],
        },
      ],
      where: whereCondition,
      order: [["visitors", "DESC"]], // Sort by visitors in descending order
    });

    if (holidayPackages.length === 0) {
      return res.status(404).json({ message: "No holiday packages found for the given criteria." });
    }

    return res.status(200).json({ holidayPackages });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
