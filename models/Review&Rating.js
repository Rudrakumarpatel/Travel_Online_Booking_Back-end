import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Listing from './Listing.js';
import User from './User.js'; // Assuming you have a User model

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  listingId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT, allowNull: true }
}, { timestamps: true });

//Relationships
Listing.hasMany(Review, { foreignKey: 'listingId', onDelete: 'CASCADE' });
Review.belongsTo(Listing, { foreignKey: 'listingId' });

User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId' });

export default Review;
