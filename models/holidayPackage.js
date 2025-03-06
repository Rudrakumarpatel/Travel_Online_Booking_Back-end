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
  description: { type: DataTypes.TEXT, allowNull: true }, 
  visitors: { type: DataTypes.INTEGER, allowNull: true }, 
  startTime: { type: DataTypes.DATE, allowNull: true },
  leavingTime: { type: DataTypes.DATE, allowNull: true },
  duration: { type: DataTypes.STRING, allowNull: true },
  activeStatus: {type: DataTypes.BOOLEAN, allowNull: true,defaultValue: true},
  image: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true });

Listing.hasMany(HolidayPackage, { foreignKey: 'listingId', onDelete: 'CASCADE' });
HolidayPackage.belongsTo(Listing, { foreignKey: 'listingId' });

export default HolidayPackage;
