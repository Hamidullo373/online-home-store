import { ROLES } from "../constants/role.constants.js";
import { BaseException } from "../exception/base.exseption.js";

export const Roles = (...roles) => {
  return (req, _, next) => {
    const userRole = req.role;

    if (roles.includes(ROLES.ALL)) {
      return next();
    }

    if (!roles.includes(userRole)) {
      return next(
        new BaseException(
          "Kechirasiz sizga bu amalni bajarishga ruhsat yo'q",
          403
        )
      );
    }

    next();
  };
};
