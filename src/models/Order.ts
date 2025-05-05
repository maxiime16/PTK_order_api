import { Schema, model } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
); // _id: false => on n’a pas besoin d’un sous-document ID

const orderSchema = new Schema(
  {
    clientId: {
      type: String,
      required: true,
    },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: { type: String, default: "PENDING" },
  },
  {
    timestamps: true, // createdAt, updatedAt automatiques
  }
);

export const Order = model("Order", orderSchema);
