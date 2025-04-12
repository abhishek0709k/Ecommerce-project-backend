import jwt from "jsonwebtoken";
import Auth from "../models/auth.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json(new ApiError("Authorization token missing or invalid", 401));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Auth.findOne({ username: decoded.username });
    if (!user) {
      return res.status(401).json(new ApiError("User not found", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in verifyToken middleware:", error);
    return res.status(401).json(new ApiError("Invalid or expired token", 401));
  }
};

export default verifyToken;
