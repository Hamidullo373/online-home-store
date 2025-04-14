import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
} from "../config/jwt.config.js";
import { BaseException } from "../exception/base.exseption.js";

export const Protected = (isProtected) => {
  return (req, res, next) => {
    if (!isProtected) {
      req.role = "VIEWER";
      return next();
    }

    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.redirect("/login");
    }

    if (!accessToken && refreshToken) {
      try {
        const data = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        const newAccessToken = jwt.sign(
          { user: data.user, role: data.role },
          ACCESS_TOKEN_SECRET,
          {
            expiresIn: +ACCESS_TOKEN_EXPIRE_TIME,
            algorithm: "HS256",
          }
        );

        const newRefreshToken = jwt.sign(
          { user: data.user, role: data.role },
          REFRESH_TOKEN_SECRET,
          {
            expiresIn: +REFRESH_TOKEN_EXPIRE_TIME,
            algorithm: "HS256",
          }
        );

        res.cookie("accessToken", newAccessToken, {
          maxAge: +ACCESS_TOKEN_EXPIRE_TIME * 1000,
          httpOnly: true,
        });

        res.cookie("refreshToken", newRefreshToken, {
          maxAge: +REFRESH_TOKEN_EXPIRE_TIME * 1000,
          httpOnly: true,
        });

        return res.redirect(req.originalUrl);
      } catch (err) {
        return next(
          new BaseException("Refresh token noto‘g‘ri yoki eskirgan", 401)
        );
      }
    }

    try {
      const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
      req.user = decoded.user;
      req.role = decoded.role;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return next(new BaseException("Token muddati tugagan", 406));
      } else if (err instanceof jwt.JsonWebTokenError) {
        return next(new BaseException("Noto‘g‘ri JWT token", 400));
      } else if (err instanceof jwt.NotBeforeError) {
        return next(new BaseException("Token hali yaroqli emas", 409));
      } else {
        return next(err);
      }
    }
  };
};
