import mongoose from "mongoose";
import { ROLES } from "../constants/role.constants.js";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    token: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
      match:
        /^(9[012345789]|6[125679]|7[01234569]|3[3]|8[8]|2[0]|5[05])[0-9]{7}$/,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
    },
    birthDate: {
      type: Date,
      required: false,
    },
    imageUrl: {
      type: String,
      required: false,
      default: "",
    },
    role: {
      type: String,
      enum: [ROLES.VIEWER, ROLES.STORE_OWNER, ROLES.SUPER_ADMIN],
      default: ROLES.VIEWER,
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    cart: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    token: {
      type: String,
      required: false,
    },
  },
  {
    collection: "users",
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("User", userSchema);
