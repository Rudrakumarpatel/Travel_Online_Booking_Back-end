import Listing from '../models/Listing.js';
import HolidayPackage from '../models/holidayPackage.js';
import { Op } from 'sequelize';

// export const percentageOffers = async (req, res) => {
//   try {
//     const listings = await Listing.findAll({
//       where: { type: 'HolidayPackage' },
//       attributes: ['id', 'name', 'city', 'country'],
//       include: [
//         {
//           model: HolidayPackage,
//           as: "HolidayPackages",
//           required: true,
//           where: {
//             percentageDiscount: { [Op.lte]: 25 }
//           },
//           attributes: [
//             'id', 'name', 'price', 'percentageDiscount', 'location',
//             'itinerary', 'visitors', 'startTime', 'leavingTime',
//             'duration', 'image'
//           ]
//         }
//       ]
//     });

//     if (!listings.length) {
//       return res.status(200).json({
//         success: true,
//         message: "No holiday packages found with percentage discount up to 25%",
//         data: []
//       });
//     }

//     // Optimized data grouping by city
//     const groupedByCity = {};
//     listings.forEach(listing => {
//       const city = listing.city || "Unknown";
//       if (!groupedByCity[city]) groupedByCity[city] = [];

//       groupedByCity[city].push({
//         listingId: listing.id,
//         name: listing.name,
//         country: listing.country,
//         holidayPackages: listing.HolidayPackages.map(pkg => ({
//           id: pkg.id,
//           name: pkg.name,
//           price: pkg.price,
//           percentageDiscount: pkg.percentageDiscount,
//           location: pkg.location,
//           itinerary: pkg.itinerary,
//           visitors: pkg.visitors, // Fixed case: `visitors` should be lowercase
//           startTime: pkg.startTime,
//           leavingTime: pkg.leavingTime,
//           duration: pkg.duration,
//           image: pkg.image
//         }))
//       });
//     });

//     res.status(200).json({ success: true, data: groupedByCity });

//   } catch (error) {
//     console.error("Error fetching percentage offers:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };



// // Fetch international offers (outside India)
// export const internationalOffers = async (req, res) => {
//   try {
//     const offers = await fetchHolidayPackages({ country: { [Op.ne]: 'India' }, isdiscount: true });
//     res.json(offers);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch international offers' });
//   }
// };

// // Fetch domestic offers (only in India)
// export const domesticOffers = async (req, res) => {
//   try {
//     const offers = await fetchHolidayPackages({ country: 'India', isdiscount: true });
//     res.json(offers);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch domestic offers' });
//   }
// };

// // Fetch all offers (both international & domestic) with discounts
// export const allOffers = async (req, res) => {
//   try {
//     const offers = await fetchHolidayPackages({ isdiscount: true });
//     res.json(offers);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch all offers' });
//   }
// };

// // Fetch all holiday packages (both discounted & non-discounted)
// export const allHolidayPackages = async (req, res) => {
//   try {
//     const offers = await fetchHolidayPackages({});
//     res.json(offers);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch holiday packages' });
//   }
// };

// // Helper function to fetch holiday packages from the database
// const fetchHolidayPackages = async (filter) => {
//   const whereCondition = { type: 'HolidayPackage' };

//   // Apply country filter if provided
//   if (filter.country) {
//     whereCondition.country = filter.country;
//   }

//   // Apply isdiscount filter if true
//   if (filter.isdiscount !== undefined) {
//     whereCondition.isdiscount = true;
//   }

//   const listings = await Listing.findAll({
//     where: whereCondition,
//     attributes: ['id', 'name', 'description', 'isdiscount', 'city', 'country', 'images', 'image'], // Added 'image' attribute
//     include: [{
//       model: HolidayPackage,
//       attributes: ['id', 'name', 'price', 'discount', 'percentageDiscount', 'image', 'location', 'duration'],
//     }]
//   });

//   return groupByCity(listings);
// };

// // Helper function to group listings by city
// const groupByCity = (listings) => {
//   return listings.reduce((acc, listing) => {
//     const city = listing.city;
//     if (!acc[city]) {
//       acc[city] = [];
//     }
    
//     acc[city].push({
//       id: listing.id,
//       name: listing.name,
//       description: listing.description,
//       isdiscount: listing.isdiscount,
//       city: listing.city,
//       country: listing.country,
//       packageImage: listing.images, // Listing images (package image)
//       image: listing.image, // ✅ Added Listing's image
//       holidayPackages: listing.HolidayPackages.map(pkg => ({
//         id: pkg.id,
//         name: pkg.name,
//         price: pkg.price,
//         discount: pkg.discount,
//         percentageDiscount: pkg.percentageDiscount,
//         image: pkg.image, // HolidayPackage image
//         location: pkg.location,
//         duration: pkg.duration,
//       }))
//     });

//     return acc;
//   }, {});
// };



import { readFileSync } from 'fs';
import fs from 'fs';
import { readFile } from 'fs/promises';

// Load test data from JSON file
const holidayData = JSON.parse(readFileSync('./Json/holidayPackage.json', 'utf-8'));

export const percentageOffers = async (req, res) => {
    try {
        const {percentage} = req.body;
        if(typeof percentage !== 'number' || percentage <= 0 || percentage >= 100) {
          return res.status(400).json({ success: false, message: "Invalid percentage Enter valid number" });
        }
       
        const filteredListings = holidayData.listings
            .map(listing => {
                const matchingPackages = listing.HolidayPackages.filter(pkg => pkg.percentageDiscount <= percentage);
                return matchingPackages.length > 0 ? { ...listing, HolidayPackages: matchingPackages } : null;
            })
            .filter(listing => listing !== null); 

        if (!filteredListings.length) {
            return res.status(200).json({
                success: true,
                message: "No holiday packages found with percentage discount up to 25%",
                data: []
            });
        }

        const groupedByCity = filteredListings.reduce((acc, listing) => {
            const city = listing.city || "Unknown";
            if (!acc[city]) acc[city] = [];
            acc[city].push({
                listingId: listing.id,
                name: listing.name,
                country: listing.country,
                holidayPackages: listing.HolidayPackages
            });
            return acc;
        }, {});

        res.status(200).json({ success: true, data: Object.entries(groupedByCity).map(([city, listings]) => ({ city, listings })) });

    } catch (error) {
        console.error("Error fetching percentage offers:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


const loadHolidayPackages = async () => {
  try {
    const data = await readFile('./Json/holidayPackage.json');
    return JSON.parse(data.toString());
  } catch (error) {
    console.error('Error loading JSON data:', error);
    return [];
  }
};

// Fetch international offers
export const internationalOffers = async (req, res) => {
  try {
    const offers = await fetchHolidayPackages({ country: { [Op.ne]: 'India' },isdicount:true });
    res.json(offers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch international offers' });
  }
};

// Fetch domestic offers (only in India)
export const domesticOffers =  async (req, res) => {
  try {
    const offers = await fetchHolidayPackages({ country: 'India',isdicount:true });
    res.json(offers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch domestic offers' });
  }
};

// Fetch all offers (both international & domestic)

export const allOffers =  async (req, res) => {
  try {
    const offers = await fetchHolidayPackages({isdicount:true});
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
