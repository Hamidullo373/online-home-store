import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    orderItems: [
      {
        clothesId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Clothes",
          required: true,
        },
        count: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
