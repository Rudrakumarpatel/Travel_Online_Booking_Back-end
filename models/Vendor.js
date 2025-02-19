import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Vendor = sequelize.define('Vendor', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  mobile: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },

  // Optional Fields (Not required at login)
  googleId: { type: DataTypes.STRING, unique: true, allowNull: true },
  otp: { type: DataTypes.STRING, allowNull: true },

  businessName: { type: DataTypes.STRING, allowNull: true },
  businessType: { 
    type: DataTypes.ENUM('Hotel', 'Homestay', 'Villa', 'Holiday Package'), 
    allowNull: true 
  },
  address: { type: DataTypes.STRING, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: true },

  // Package Details (Optional)
  packagesUploaded: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: true },
  activePackages: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: true },

}, { timestamps: true });

export default Vendor;
