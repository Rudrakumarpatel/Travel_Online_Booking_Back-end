import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Allows cross-origin requests

// API Route
app.get("/search", (req, res) => {
    
});

// Start Server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
