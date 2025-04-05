import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/jwt.config.js";
import { BaseException } from "../exception/base.exseption.js";

export const Protected = (isProtected) => {
  return (req, _, next) => {
    if (!isProtected) {
      req.role = "VIEWER";
      return next();
    }

    const token = req.headers["authorization"];

    if (!token || !token.includes("Bearer ") || !token.split(" ")[1]) {
      return next(new BaseException("Iltimos tokenni berib yuboring!", 400));
    }

    const accessToken = token.split(" ")[1];

    try {
      const decodedData = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

      req.role = decodedData.role;
      req.user = decodedData.user;

      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return next(new BaseException("Token muddati eskirgan", 406));
      } else if (err instanceof jwt.JsonWebTokenError) {
        return next(
          new BaseException("JWT token xato formatda yuborildi", 400)
        );
      } else if (err instanceof jwt.NotBeforeError) {
        return next(new BaseException("Not Before Error", 409));
      } else {
        next(err);
      }
    }
  };
};
