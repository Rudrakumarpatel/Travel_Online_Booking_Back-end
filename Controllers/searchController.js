import Listing from '../models/Listing.js';

export const searchLocation = async (req, res) => {
  const { city } = req.body;

  const listingCity = await Listing.findAll({attributes:['city']});

  console.log(listingCity);
  const cityName = listingCity.map((listing)=>listing.city);

  if (!city || !cityName || !Array.isArray(cityName)) {
    return res.status(400).json({ error: "Invalid request data" });
  }


  const searchQuery = city.toLowerCase();

  const locations = cityName
    .filter(item => item.toLowerCase().includes(searchQuery)) // Case-insensitive match
    .sort((a, b) => {
      let aStarts = a.toLowerCase().startsWith(searchQuery);
      let bStarts = b.toLowerCase().startsWith(searchQuery);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.localeCompare(b);
    });

  if (locations.length == 0) {
    return res.status(201).json({ message: "Result is not Found" });
  };
  return res.json({ locations });
}