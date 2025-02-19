import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Listing from './Listing.js';

const HolidayPackage = sequelize.define('HolidayPackage', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  listingId: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  discount: { type: DataTypes.FLOAT, allowNull: true },
  itinerary: { type: DataTypes.TEXT, allowNull: true },
  Visitors: { type: DataTypes.INTEGER, allowNull: false },
  startTime: { type: DataTypes.TIME, allowNull: true },
  leavingTime: { type: DataTypes.TIME, allowNull: true },
  duration: { type: DataTypes.STRING, allowNull: true },
}, { timestamps: true });

// 🔹 Listing-HolidayPackage Relationship
Listing.hasOne(HolidayPackage, { foreignKey: 'listingId', onDelete: 'CASCADE' });
HolidayPackage.belongsTo(Listing, { foreignKey: 'listingId' });

export default HolidayPackage;
