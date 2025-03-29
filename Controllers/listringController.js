import { readFileSync } from 'fs';
import fs from 'fs';
import { readFile } from 'fs/promises';
import Listing from '../models/Listing.js';
import HolidayPackage from '../models/holidayPackage.js';
import { Op, Sequelize } from 'sequelize';
import Review from '../models/ReviewAndRating.js';
import Hotel from '../models/Hotel.js';

// Fetch all holiday packages
export const allHolidayPackages = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: { type: 'HolidayPackage' },
      attributes: ['id', 'city', 'country', 'images'],
      include: [{
        model: HolidayPackage,
        attributes: [
          'id', 'name', 'price', 'discount', 'isdiscount',
          'percentageDiscount', 'location', 'itinerary',
          'description',
          'visitors', 'startTime', 'leavingTime', 'duration',
          'activeStatus', 'images', 'packageImages',
          [Sequelize.fn('AVG', Sequelize.col('Reviews.rating')), 'averageRating']
        ],
        include: [
          {
            model: Review,
            attributes: []
          }
        ]
      }
      ],
      group: ['Listing.id', 'HolidayPackages.id']
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
        discount: pkg.discount,
        isdiscount: pkg.isdiscount,
        percentageDiscount: pkg.percentageDiscount,
        location: pkg.location,
        itinerary: pkg.itinerary,
        description: pkg.description,
        visitors: pkg.visitors,
        startTime: pkg.startTime,
        leavingTime: pkg.leavingTime,
        duration: pkg.duration,
        review: parseFloat(pkg.dataValues.averageRating || 0).toFixed(1),
        images: pkg.images,
        packageImages: pkg.packageImages,
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
    const { cityOrCountry, departureDate } = req.query;

    if (!cityOrCountry) {
      return res.status(400).json({ message: "City or Country is required." });
    }

    // Prepare filters
    let whereCondition = { activeStatus: true };

    if (departureDate) {
      whereCondition.startTime = { [Op.eq]: new Date(departureDate) };
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

export const searchHotels = async (req, res) => {
  try {
    const { cityOrCountry, checkIn, checkOut } = req.query;

    if (!cityOrCountry) {
      return res.status(400).json({ message: "City or Country is required." });
    }

    const Hotels = await Hotel.findAll({
      include: [
        {
          model: Listing,
          where: {
            [Op.or]: [{ city: cityOrCountry }, { country: cityOrCountry }],
          },
          attributes: ["city", "country"],
        },
        {
          model: Review,
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [Sequelize.fn("AVG", Sequelize.col("Reviews.rating")), "averageRating"],
        ],
      },
      group: ["Hotel.id", "Listing.id"],
      order: [["visitors", "DESC"]],
    });

    const formattedHotels = Hotels.map(hotel => ({
      ...hotel.toJSON(),
      checkIn: checkIn,
      checkOut: checkOut,
    }));

    if (Hotels.length === 0) {
      return res.status(404).json({ message: "No hotels found for the given criteria." });
    }

    return res.status(200).json({ Hotels: formattedHotels });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
