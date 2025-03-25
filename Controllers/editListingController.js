import HolidayPackage from "../models/holidayPackage.js";
import Vendor from "../models/Vendor.js";
import Listing from "../models/Listing.js";
import homestayAndVilla from "../models/homestayAndVillas.js";
import Hotel from "../models/Hotel.js"
import cloudinary from 'cloudinary';


cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
})

export const editHolidayPackage = async (req, res) => {
  try {
    const packageId = req.header("id");
    const listingId = req.header("listingId");
    const updateData = req.body;
    const id = req.id;

    const vendor = await Vendor.findByPk(id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const listing = await Listing.findOne({ where: { vendorId: id, id: listingId } });
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    const holidayPackage = await HolidayPackage.findOne({ where: { listingId: listing.id, id: packageId } });
    if (!holidayPackage) return res.status(404).json({ message: "Holiday Package not found" });


    // Extract city and country update for Listing
    const { city, country, ...holidayPackageUpdates } = updateData;
    if (city !== undefined || country !== undefined) {
      await listing.update({ city, country });
    }


    // Image Handling
    const packageImages = req.files?.Packageimages; // Many images (inside package)
    const thumbnailImages = req.files?.Packagephotos; // Thumbnail image

    // Function to delete images from Cloudinary
    const deleteFromCloudinary = async (imageUrls) => {
      for (const url of imageUrls) {
        const publicId = url.split('/').pop().split('.')[0]; // Extract publicId from URL
        await cloudinary.uploader.destroy(publicId);
      }
    };

    // Handle package images (inside package)
    if (packageImages && packageImages.length > 0) {
      if (holidayPackage.packageImages) {
        await deleteFromCloudinary(holidayPackage.packageImages); // Delete old images
      }

      const uploadedImages = await Promise.all(
        packageImages.map(file => cloudinary.uploader.upload(file.path))
      );

      updateData.packageImages = uploadedImages.map(img => img.secure_url); // Save new images
    }

    // Handle thumbnail images
    if (thumbnailImages && thumbnailImages.length > 0) {
      if (holidayPackage.thumbnailImage) {
        await deleteFromCloudinary([holidayPackage.thumbnailImage]); // Delete old thumbnail
      }

      const uploadedThumbnail = await cloudinary.uploader.upload(thumbnailImages[0].path);
      updateData.thumbnailImage = uploadedThumbnail.secure_url; // Save new thumbnail
    }

    //update vandor activePackages
    if (updateData.activeStatus) {
      vendor.activePackages += 1;
    }
    else if (updateData.activeStatus === false) {
      vendor.activePackages -= 1;
    }
    await vendor.save();


    // Update price, discount, and duration calculations
    if (updateData.price && updateData.discount) {
      updateData.isdiscount = updateData.discount > 0;
      updateData.percentageDiscount = parseFloat((updateData.discount / updateData.price) * 100);
    }

    if (updateData.discount !== undefined && updateData.price === undefined) {
      updateData.isdiscount = updateData.discount > 0;
      if (holidayPackage.price) {
        updateData.percentageDiscount = parseFloat((updateData.discount / holidayPackage.price) * 100);
      }
    }

    if (updateData.price !== undefined && updateData.discount === undefined) {
      if (holidayPackage.discount)
        updateData.percentageDiscount = parseFloat((holidayPackage.discount / updateData.price) * 100);
    }

    if (updateData.startTime || updateData.leavingTime) {
      const start = new Date(updateData.startTime || holidayPackage.startTime);
      const leaving = new Date(updateData.leavingTime || holidayPackage.leavingTime);
      updateData.duration = `${Math.ceil((leaving - start) / (1000 * 60 * 60 * 24))} Days`;
    }

    // Update the holiday package
    await holidayPackage.update(updateData);

    res.status(200).json({ message: "Holiday Package updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const editPackageGetData = async (req, res) => {
  try {
    const packageId = req.header('id');
    const listingId = req.header("listingId");
    const id = req.id;
    // Validate required headers
    if (!packageId || !listingId) {
      return res.status(400).json({
        message: "Missing required headers: 'id' and 'listingId'"
      });
    }

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
      raw: true
    });

    if (!holidayPackage) {
      return res.status(404).json({ message: "Holiday Package not found" });
    }

    // Combine the data
    const responseData = {
      ...holidayPackage,
      city: Listing1.city,
      country: Listing1.country
    };

    return res.status(200).json({ message: "Package Data", holidayPackage: responseData});
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

    const status = await HolidayPackage.findOne({
      where: { listingId: listing.id, name: HolidayPackageName },
      attributes: ['activeStatus']
    })

    const isActive = status?.dataValues?.activeStatus ?? false;

    // Delete the Holiday Package
    const deletedHolidayPackage = await HolidayPackage.destroy({
      where: { listingId: listing.id, name: HolidayPackageName }
    });

    //update vandor activePackages
    if (isActive) {
      vendor.activePackages -= 1;
    }
    vendor.packagesUploaded -= 1;
    await vendor.save();

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
