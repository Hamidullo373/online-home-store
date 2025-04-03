import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    children: {
      type: mongoose.Schema.Types.Array,
      ref: "Category",
    },
  },
  {
    collection: "categories",
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Category", categorySchema);
