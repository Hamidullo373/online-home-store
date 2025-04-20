import { compare, hash } from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { BaseException } from "../exception/base.exseption.js";
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_SECRET,
} from "../config/jwt.config.js";
import { sendMail } from "../utils/email.utils.js";
import { error, log } from "node:console";
import e from "express";

const register = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.render("register", {
        error: "Email yoki telefon raqam allaqachon ro'yxatdan o'tgan",
      });
    }

    const passwordHash = await hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      phoneNumber,
      password: passwordHash,
    });

    // await sendMail({
    //   to: email,
    //   subject: "Xush kelibsiz!",
    //   text: `Salom ${name}! Fashion loyihamizga muvaffaqiyatli ro'yxatdan o'tdingiz.`,
    // });

    return res.redirect("/users/login");
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.render("auth/login", { error: "Foydalanuvchi topilmadi" });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.render("auth/login", { error: "Noto'g'ri parol" });
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: +ACCESS_TOKEN_EXPIRE_TIME,
        algorithm: "HS256",
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: +REFRESH_TOKEN_EXPIRE_TIME,
        algorithm: "HS256",
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: +ACCESS_TOKEN_EXPIRE_TIME * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: +REFRESH_TOKEN_EXPIRE_TIME * 1000,
    });

    res.cookie("user", JSON.stringify(user));

    return res.redirect("/");
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.render("forgot-password", {
        error: "Foydalanuvchi topilmadi",
        message: null,
      });
    }

    const token = crypto.randomBytes(50).toString("hex");
    user.token = token;
    await user.save();

    const resetLink = `http://localhost:3000/users/reset-password?token=${token}`;

    await sendMail({
      to: email,
      subject: "Parolni tiklash",
      html: `
        <h2>Parolni tiklash uchun quyidagi linkni bosing:</h2>
        <a href="${resetLink}">Parolni tiklash</a>
      `,
    });

    res.render("forgot-password", {
      message: "Emailga tiklash havolasi yuborildi!",
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.query;

    if (!token) {
      return res.redirect("/users/login");
    }

    const user = await userModel.findOne({ token });
    if (!user) {
      return res.redirect("/users/forgot-password");
    }

    const passwordHash = await hash(password, 10);
    user.password = passwordHash;
    user.token = null;

    await user.save();

    res.render("reset-password", {
      message: "Parolingiz muvaffaqiyatli yangilandi",
      error: null,
      token: null,
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const data = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign(data, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
      algorithm: "HS256",
    });

    const newRefreshToken = jwt.sign(data, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
      algorithm: "HS256",
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: +ACCESS_TOKEN_EXPIRE_TIME * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: +REFRESH_TOKEN_EXPIRE_TIME * 1000,
    });

    res.send({
      message: "Tokenlar yangilandi",
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new BaseException("Refresh token muddati tugagan", 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new BaseException("Noto'g'ri refresh token", 400));
    } else {
      next(error);
    }
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find().populate({
      path: "orders",
      populate: {
        path: "orderItems",
        populate: "food",
      },
    });

    res.send({
      message: "Foydalanuvchilar ro'yxati",
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  refresh,
  getAllUsers,
};
