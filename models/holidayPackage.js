import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Listing from './Listing.js';

const HolidayPackage = sequelize.define('HolidayPackage', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  listingId: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  discount: { type: DataTypes.FLOAT, allowNull: true },
  percentageDiscount: { type: DataTypes.FLOAT, allowNull: true }, // Fixed spelling
  location: { type: DataTypes.STRING, allowNull: false },
  itinerary: { type: DataTypes.TEXT, allowNull: true },
  visitors: { type: DataTypes.INTEGER, allowNull: false }, // Fixed capitalization
  startTime: { type: DataTypes.TIME, allowNull: true },
  leavingTime: { type: DataTypes.TIME, allowNull: true },
  duration: { type: DataTypes.STRING, allowNull: true },
  image: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true });

Listing.hasMany(HolidayPackage, { foreignKey: 'listingId', onDelete: 'CASCADE' });
HolidayPackage.belongsTo(Listing, { foreignKey: 'listingId' });

export default HolidayPackage;
