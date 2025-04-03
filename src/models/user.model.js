import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
      match:
        /^\+998(9[012345789]|6[125679]|7[01234569]|3[3]|8[8]|2[0]|5[05])[0-9]{7}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "users",
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("User", userSchema);
