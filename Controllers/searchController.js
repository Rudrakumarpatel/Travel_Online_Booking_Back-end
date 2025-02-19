export const searchLocation = async (req, res) => {
  const { city } = req.body;

  //This Destinations From HolidayPakaage API| Currently it is only Testing Perpose.
  const holidayDestinations = [
    "Goa",
    "Manali",
    "Shimla",
    "Ooty",
    "Munnar",
    "Darjeeling",
    "Andaman",
    "Rishikesh",
    "Udaipur",
    "Jaipur",
    "Agra",
    "Varanasi",
    "Leh",
    "Kodaikanal",
    "Coorg",
    "Lonavala",
    "Mahabaleshwar",
    "Alleppey",
    "Mysore",
    "Gangtok",
    "Pondicherry",
    "Gokarna",
    "Kanyakumari",
    "Jaisalmer",
    "Ranthambore",
    "Chikmagalur",
    "Mussoorie",
    "Haridwar",
    "Khajuraho",
    "Hampi"
  ];

  if (!city || !holidayDestinations || !Array.isArray(holidayDestinations)) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  const searchQuery = city.toLowerCase();

  const locations = holidayDestinations
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