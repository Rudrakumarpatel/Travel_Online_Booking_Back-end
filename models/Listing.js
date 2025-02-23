import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Vendor from './Vendor.js';

const Listing = sequelize.define('Listing', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  vendorId: { type: DataTypes.INTEGER, allowNull: false, index: true },
  type: { 
    type: DataTypes.ENUM('Hotel', 'Homestay&Villa', 'HolidayPackage'), 
    allowNull: false 
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true }, 
  isdiscount: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  city: { type: DataTypes.STRING, allowNull: false },
  country: { type: DataTypes.STRING, allowNull: false },
  images: { type: DataTypes.JSON, allowNull: true } 
}, { timestamps: true });

// 🔹 Vendor-Listing Relationship
Vendor.hasMany(Listing, { foreignKey: 'vendorId', onDelete: 'CASCADE' });
Listing.belongsTo(Vendor, { foreignKey: 'vendorId' });

export default Listing;
