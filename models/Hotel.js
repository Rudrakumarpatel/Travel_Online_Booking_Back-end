import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Listing from './Listing.js';

const Hotel = sequelize.define('Hotel', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  listingId: { type: DataTypes.INTEGER, allowNull: false },
  pricePerNight: { type: DataTypes.FLOAT, allowNull: false },
  discountPerNight: { type: DataTypes.FLOAT, allowNull: true },
  availableRooms: { type: DataTypes.INTEGER, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  roomsavaliable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  amenities: { type: DataTypes.STRING, allowNull: true },
  checkInTime: { type: DataTypes.TIME, allowNull: true },
  checkOutTime: { type: DataTypes.TIME, allowNull: true },
  image: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true });

// 🔹 Listing-Hotel Relationship
Listing.hasOne(Hotel, { foreignKey: 'listingId', onDelete: 'CASCADE' });
Hotel.belongsTo(Listing, { foreignKey: 'listingId' });

export default Hotel;
