import mongoose from "mongoose";

const HomesSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
    },
    price: {
      type: mongoose.SchemaTypes.Number,
      required: [true, "House narxi berilishi shart"],
      min: 0,
    },
    description: {
      type: mongoose.SchemaTypes.String,
      required: false,
    },
    imageUrl: {
      type: mongoose.SchemaTypes.String,
      required: false,
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
    },
  },
  {
    collection: "homes",
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Homes", HomesSchema);
