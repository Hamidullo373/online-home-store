import { verifyToken } from "../utils/jwt.js";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).send({
      message: "Token not provided",
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).send({
      message: "Invalid or expired token",
    });
  }

  req.userId = decoded.userId;
  next();
};
