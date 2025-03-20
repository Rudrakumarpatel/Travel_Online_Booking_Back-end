import HolidayPackage from "../models/holidayPackage.js";
import Vendor from "../models/Vendor.js";
import Listing from "../models/Listing.js";
import homestayAndVilla from "../models/homestayAndVillas.js";
import Hotel from "../models/Hotel.js"


export const editHolidayPackage = async (req, res) => {
  try {
    const packageId = req.header("id");
    const listingId = req.header("listingId");
    const updateData = req.body;
    const id = req.id;
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    const Listing1 = await Listing.findOne({ where: { vendorId: id, id: listingId } });

    if (!Listing1) {
      return res.status(404).json({ message: "Listing is not found" });
    }

    const holidayPackage = await HolidayPackage.findOne({ where: { listingId: Listing1.id, id: packageId } });

    if (!holidayPackage) {
      return res.status(404).json({ message: "Holiday Package not found" });
    }

    // Extract city and country for Listing
    const { city, country, ...holidayPackageUpdates } = updateData;

    // Update Listing (only city & country)
    if (city !== undefined || country !== undefined) {
      await Listing1.update({ city, country });
    }

    // Manually updating dependent fields
    //both price and discount in input
    if (updateData.price && updateData.discount) {
      updateData.isdiscount = updateData.discount > 0;
      updateData.percentageDiscount = parseFloat((updateData.discount / updateData.price) * 100);
    }

    //Discount in input
    if (updateData.discount !== undefined && updateData.price === undefined) {
      updateData.isdiscount = updateData.discount > 0;
      if (holidayPackage.price) {
        updateData.percentageDiscount = parseFloat((updateData.discount / holidayPackage.price) * 100);
      }
    }

    //Price in input
    if (updateData.price !== undefined && updateData.discount === undefined) {
      if (holidayPackage.discount)
        updateData.percentageDiscount = parseFloat((holidayPackage.discount / updateData.price) * 100);
    }

    // Updating duration based on startTime and leavingTime
    //in input both have startime & leavingTime
    if (updateData.startTime && updateData.leavingTime) {
      const start = new Date(updateData.startTime);
      const leaving = new Date(updateData.leavingTime);
      const diffDays = Math.ceil((leaving - start) / (1000 * 60 * 60 * 24));
      updateData.duration = `${diffDays} Days`;
    }
    //in input have only starttime
    if (updateData.startTime && !updateData.leavingTime) {
      const s = new Date(updateData.startTime);
      const l = new Date(holidayPackage.leavingTime);
      const diffDays = Math.ceil((l - s) / (1000 * 60 * 60 * 24));
      updateData.duration = `${diffDays} Days`;
    }


    if (!updateData.startTime && updateData.leavingTime) {
      const s = new Date(holidayPackage.startTime);
      const l = new Date(updateData.leavingTime);
      const diffDays = Math.ceil((l - s) / (1000 * 60 * 60 * 24));
      updateData.duration = `${diffDays} Days`;
    }

    // Update the holiday package
    await holidayPackage.update(updateData);

    res.status(200).json({ message: "Holiday Package updated successfully" });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const editPackageGetData = async (req, res) => {
  try {
    const packageId = req.header('id');
    const listingId = req.header("listingId");
    const id = req.id;

    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const Listing1 = await Listing.findOne({ where: { vendorId: id, id: listingId } });

    if (!Listing1) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const holidayPackage = await HolidayPackage.findOne({
      where: { listingId, id: packageId },
      include: {
        model: Listing,
        attributes: ['city', 'country']
      }
    });

    if (!holidayPackage) {
      return res.status(404).json({ message: "Holiday Package not found" });
    }

    return res.status(200).json({ message: "Package Data", holidayPackage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const DeleteHolidayPackage = async (req, res) => {
  try {
    const id = req.id;
    const { city, HolidayPackageName } = req.body;

    const vendor = await Vendor.findOne({ where: { id } });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const listing = await Listing.findOne({ where: { vendorId: id, city } });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Delete the Holiday Package
    const deletedHolidayPackage = await HolidayPackage.destroy({
      where: { listingId: listing.id, name: HolidayPackageName }
    });

    if (!deletedHolidayPackage) {
      return res.status(404).json({ message: "No holiday package found with given details" });
    }

    // Count remaining Holiday Packages, Hotels, and Villas for this Listing
    const remainingPackages = await HolidayPackage.count({ where: { listingId: listing.id } });
    const remainingHotels = await Hotel.count({ where: { listingId: listing.id } });
    const remainingVillas = await homestayAndVilla.count({ where: { listingId: listing.id } });

    // If all are 0, delete the Listing
    if (remainingPackages === 0 && remainingHotels === 0 && remainingVillas === 0) {
      await listing.destroy();
      return res.status(200).json({ message: "Holiday Package and Listing deleted successfully" });
    }

    return res.status(200).json({ message: "Holiday Package deleted successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
