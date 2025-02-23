import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, sequelize } from './config/db.js';
import authRoutes from './routes/authRoute.js';
import search_Location from './routes/search_Location.js';
import offers from './routes/offers.js';
import allListing from './routes/allListingRoute.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MySQL first
connectDB().then(() => {
  // Sync models after a successful DB connection
  sequelize.sync({ alter: true })
  .then(() => console.log("✅ Database synced successfully"))
  .catch(err => console.error("❌ Sync failed: ", err));
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', search_Location);
app.use("/api/Offers",offers);

app.use("/api/allListing",allListing);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
