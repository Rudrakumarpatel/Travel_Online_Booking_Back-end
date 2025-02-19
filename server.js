import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB, sequelize} from './config/db.js';
import authRoutes from './routes/authRoute.js';
import search_Location from './routes/search_Location.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


sequelize.sync({ force: false })
  .then(() => console.log("Database synced successfully"))
  .catch((err) => console.error("Error syncing database:", err));


// Connect to MySQL
connectDB();

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/search',search_Location)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
