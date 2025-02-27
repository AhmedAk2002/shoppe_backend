import mongoose from "mongoose";

export const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // Link transactions to users
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  note: { type: String }
});

export const Transaction = mongoose.model("Transaction", transactionSchema);
