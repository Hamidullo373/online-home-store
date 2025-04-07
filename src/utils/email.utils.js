import { config } from "dotenv";
import transporter from "../config/email.config.js";
import { BaseException } from "../exception/base.exseption.js";

config();

export const sendMail = async ({ to, subject, text = "", html = "" }) => {
  try {
    const mail = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
      html,
    });

    return mail.messageId;
  } catch (err) {
    console.log(err);
    throw new BaseException("Email yuborishda xatolik yuz berdi", 500);
  }
};
