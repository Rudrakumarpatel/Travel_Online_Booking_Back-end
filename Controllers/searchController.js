import Listing from '../models/Listing.js';

export const searchLocation = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    const listingCity = await Listing.findAll({ attributes: ["city"] });

    // Extract city names, remove null/undefined values
    const cityName = [...new Set(listingCity.map((listing) => listing.city).filter(Boolean))];

    const searchQuery = city.toLowerCase();

    const cities = cityName
      .filter((item) => item?.toLowerCase().includes(searchQuery)) // Case-insensitive match
      .sort((a, b) => {
        let aStarts = a.toLowerCase().startsWith(searchQuery);
        let bStarts = b.toLowerCase().startsWith(searchQuery);

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.localeCompare(b);
      });

    if (cities.length === 0) {
      return res.status(201).json({ message: "Result is not Found" });
    }

    return res.json({ cities });
  } catch (error) {
    console.error("Error searching cities:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
