import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Vendor from './Vendor.js';

const Listing = sequelize.define('Listing', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  vendorId: { type: DataTypes.INTEGER, allowNull: false },
  type: { 
    type: DataTypes.ENUM('Hotel', 'Homestay&Villa', 'HolidayPackage'), 
    allowNull: false 
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true }, 
  location: { type: DataTypes.STRING, allowNull: false },
  checkavaliable: { type: DataTypes.BOOLEAN, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  Contry: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true });

// 🔹 Vendor-Listing Relationship
Vendor.hasMany(Listing, { foreignKey: 'vendorId', onDelete: 'CASCADE' });
Listing.belongsTo(Vendor, { foreignKey: 'vendorId' });

export default Listing;
