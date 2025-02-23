import { readFileSync } from 'fs';
import fs from 'fs';
import { readFile } from 'fs/promises';
import Listing from '../models/Listing.js';
import HolidayPackage from '../models/holidayPackage.js';
import { Op } from 'sequelize';

// // Fetch all holiday packages
// export const allHolidayPackages = async (req, res) => {
//   try {
//     const listings = await Listing.findAll({
//       where: { type: 'HolidayPackage' },
//       attributes: ['id', 'name', 'description', 'isdiscount', 'city', 'country', 'images'], // Fetching relevant fields
//       include: [{
//         model: HolidayPackage,
//         attributes: [
//           'id', 'name', 'price', 'percentageDiscount', 'location', 'itinerary',
//           'visitors', 'startTime', 'leavingTime', 'duration', 'image'
//         ]
//       }]
//     });

//     const formattedListings = listings.map(listing => ({
//       id: listing.id,
//       name: listing.name,
//       description: listing.description,
//       isdiscount: listing.isdiscount,
//       city: listing.city,
//       country: listing.country,
//       images: listing.images,
//       HolidayPackages: listing.HolidayPackages.map(pkg => ({
//         id: pkg.id,
//         name: pkg.name,
//         price: pkg.price,
//         percentageDiscount: pkg.percentageDiscount,
//         location: pkg.location,
//         itinerary: pkg.itinerary,
//         visitors: pkg.visitors,
//         startTime: pkg.startTime,
//         leavingTime: pkg.leavingTime,
//         duration: pkg.duration,
//         image: pkg.image
//       }))
//     }));

//     res.json(formattedListings);
//   } catch (error) {
//     console.error('Error fetching holiday packages:', error);
//     res.status(500).json({ error: 'Failed to fetch holiday packages' });
//   }
// };


// Load test data from JSON file
const holidayData = JSON.parse(readFileSync('./Json/holidayPackage.json', 'utf-8'));


// Load JSON data from file
const loadHolidayPackages = async () => {
  try {
    const data = await readFile('./Json/holidayPackage.json');
    return JSON.parse(data.toString());
  } catch (error) {
    console.error('Error loading JSON data:', error);
    return [];
  }
};

// Fetch all holiday packages 
export const allHolidayPackages =  async (req, res) => {
  try {
    const offers = await fetchHolidayPackages({});
    res.json(offers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch all offers' });
  }
};

// Helper function to filter JSON data
const fetchHolidayPackages = async (filter) => {
  const holidayPackages = await loadHolidayPackages();

  return holidayData.listings.filter((listing) => {
    if(filter.isdicount)
    {
      if (!listing.isdiscount) return false;
    }
    if (filter.country) {
      if (filter.country[Op.ne] && listing.country === 'India') return false;
      if (filter.country === 'India' && listing.country !== 'India') return false;
    }

    return true;
  });
};
