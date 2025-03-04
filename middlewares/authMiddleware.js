import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {

  const token = req.header("Authorization").split(" ")[1];

  console.log(token);

  const authHeader = req.header("Authorization");


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const token = authHeader.split(" ")[1]; // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.userId || decoded.vendorId;
    console.log(req.user);
    next(); // Continue to the next middleware


    req.vendorId = decoded.vendorId; // ✅ Attach vendorId to request
    

    if (!req.vendorId) {
      return res.status(401).json({ message: "Unauthorized: No vendor ID in token" });
    }

    next();

  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(403).json({ message: "Invalid token" });
  }
};

export default verifyToken;