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
          'activeStatus', 'images'
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
        images: pkg.images
      }))
    }));

    res.json(formattedListings);
  } catch (error) {
    console.error('Error fetching holiday packages:', error);
    res.status(500).json({ error: 'Failed to fetch holiday packages' });
  }
};
