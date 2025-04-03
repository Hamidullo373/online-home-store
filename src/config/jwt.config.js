import { config } from "dotenv";
import jwt from "jsonwebtoken";

// Load environment variables from .env file
config();

// Export constants for token secret and expiration
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY;
export const ACCESS_TOKEN_EXPIRE_TIME = process.env.ACCESS_TOKEN_EXPIRE_TIME;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET_KEY;
export const REFRESH_TOKEN_EXPIRE_TIME = process.env.REFRESH_TOKEN_EXPIRE_TIME;

// Function to generate a JWT token
export const generateToken = (userId, phoneNumber) => {
  return jwt.sign(
    { userId, phoneNumber },
    ACCESS_TOKEN_SECRET, // Using the TOKEN_SECRET from the environment variables
    { expiresIn: ACCESS_TOKEN_EXPIRE_TIME } // Expiration time from the environment variables
  );
};
