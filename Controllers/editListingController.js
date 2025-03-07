import HolidayPackage from "../models/holidayPackage.js";
import Vendor from "../models/Vendor.js";

export const editHolidayPackage = async (req, res) => {
  try {
    const HolidayPackageName = req.header('HolidayPackageName');
    const Location = req.header('Location');
    const updateData = req.body;

    const vendor = await Vendor.findByPk(req.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const holidayPackage = await HolidayPackage.findOne({ where: { name: HolidayPackageName, location: Location } });
    if (!holidayPackage) {
      return res.status(404).json({ message: "Holiday Package not found" });
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
    if(updateData.price !== undefined && updateData.discount === undefined)
    {
      if(holidayPackage.discount)
      updateData.percentageDiscount = parseFloat((holidayPackage.discount/updateData.price) * 100);
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

    
    if(!updateData.startTime && updateData.leavingTime)
    {
      const s = new Date(holidayPackage.startTime);
      const l = new Date(updateData.leavingTime); 
      const diffDays = Math.ceil((l - s) / (1000 * 60 * 60 * 24)); 
      updateData.duration = `${diffDays} Days`;
    }

    // Update the holiday package
    await holidayPackage.update(updateData);

    res.status(200).json({ message: "Holiday Package updated successfully", holidayPackage });
  } 
  catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Server error", error });
  }
};
