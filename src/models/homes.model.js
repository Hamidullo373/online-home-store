import mongoose from "mongoose";
import { ROLES } from "../constants/role.constants.js";

const { Schema, SchemaTypes } = mongoose;

const HomesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
    },
    price: {
      type: Number,
      required: [true, "Uy narxi berilishi shart"],
      min: [0, "Narx manfiy bo'lishi mumkin emas"],
    },
    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    description: {
      type: String,
      required: false,
      maxlength: 1000,
    },
    imageUrl: {
      type: String,
      required: false,
      default: "",
    },
    category: {
      type: SchemaTypes.ObjectId,
      ref: "Category",
      required: true,
    },

    role: {
      type: String,
      enum: [ROLES.VIEWER, ROLES.STORE_OWNER, ROLES.SUPER_ADMIN],
      default: ROLES.STORE_OWNER,
    },

    createdBy: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    collection: "homes",
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Homes", HomesSchema);
