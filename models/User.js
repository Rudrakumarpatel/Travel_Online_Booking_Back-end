import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  mobile: { type: DataTypes.STRING, unique: true, allowNull: true},
  password: { type: DataTypes.STRING, allowNull: false },  // For email/password login
  googleId: { type: DataTypes.STRING, unique: true, allowNull: true },  // For Google OAuth2
  otp: { type: DataTypes.STRING, allowNull: true },  // OTP for mobile authentication
});

export default User;
