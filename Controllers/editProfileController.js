import { UpdateProfileEmail } from '../Email_Sending/Email_Sending.js';
import Vendor from '../models/Vendor.js';

export const updateVendorProfile = async (req, res) => {
  try {
    const id = req.user;
    const updates = req.body; // Get provided fields
    console.log(id);
    console.log(updates);
    // Find vendor
    const vendor = await Vendor.findByPk(id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // Send email notification to the updated email address if it has changed
    const { name: oldName, email: oldEmail } = vendor;

    // Update provided fields
    await vendor.update(updates);

    UpdateProfileEmail(updates.email || oldEmail, updates.name || oldName);

    res.json({ message: "Profile updated successfully", vendor });

  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};
