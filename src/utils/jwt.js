import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE_TIME,
} from "../config/jwt.config.js";

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
  });
};

export const verifyToken = (token, type = "access") => {
  const secret = type === "access" ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
