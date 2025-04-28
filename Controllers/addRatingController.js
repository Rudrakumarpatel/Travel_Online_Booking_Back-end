import HolidayPackage from "../models/holidayPackage.js";
import Hotel from "../models/Hotel.js";
import Listing from "../models/Listing.js";
import Review from "../models/ReviewAndRating.js";
import HomestayVilla from "../models/homestayAndVillas.js";

export const addRating = async (req, res) => {
  try {
    const { ListingId, rating, review, type, typeId } = req.body;
    const id = req.id;
    console.log(req.body);
    const listing = await Listing.findOne({ where: { id: ListingId } });

    if (!listing) return res.status(404).json({ message: "Listing not found" });
    console.log(req.body);

    //reviewType
    let reviewType = "";
    if (rating >= 4.5) {
      reviewType = "Excellent";
    } else if (rating >= 3.5) {
      reviewType = "Very Good";
    } else if (rating >= 2.5) {
      reviewType = "Good";
    } else {
      reviewType = "Poor";
    }

    console.log(req.body);


    if (type === "Hotel") {
      const hotel = await Hotel.findOne({ where: { id: typeId } });

      console.log(req.body);

      if (!hotel) return res.status(404).json({ message: "Hotel not found" });
      
      const Rating = await Review.create({
        listingId: ListingId,
        rating: rating,
        userId: id,
        hotelId: typeId,
        reviewType,
        holidayPackageId: null,
        villaId: null,
        comment: review,
      });
    }

    else if (type === "HolidayPackage") {
      const holidayPackage = await HolidayPackage.findOne({ where: { id: typeId } });
      if (!holidayPackage) return res.status(404).json({ message: "Holiday Package not found" });
      const Rating = await Review.create({
        listingId: ListingId,
        rating: rating,
        userId: id,
        holidayPackageId: typeId,
        hotelId: null,
        villaId: null,
        reviewType,
        comment: review,
      });
    }

    else if (type === "Homestay&Villa") {
      const villa = await HomestayVilla.findOne({ where: { id: typeId } });
      if (!villa) return res.status(404).json({ message: "Villa not found" });
      const Rating = await Review.create({
        listingId: ListingId,
        rating: rating,
        userId: id,
        villaId: typeId,
        hotelId: null,
        holidayPackageId: null,
        reviewType,
        comment: review,
      });
    }
    else {
      return res.status(400).json({ message: "Invalid type" });
    }
    return res.status(201).json({ message: "Review added successfully", rating });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
