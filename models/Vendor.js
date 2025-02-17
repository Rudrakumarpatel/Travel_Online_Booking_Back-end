import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Vendor = sequelize.define('Vendor', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  mobile: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },  
  googleId: { type: DataTypes.STRING, unique: true, allowNull: true },  
  otp: { type: DataTypes.STRING, allowNull: true },  
  listing: { type: DataTypes.JSON, allowNull: true },  // Store array as JSON
});

export default Vendor;
