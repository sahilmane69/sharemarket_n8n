import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  mode: 'simulation' | 'alpaca';
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    symbol: { type: String, required: true, uppercase: true },
    type: { type: String, enum: ['buy', 'sell'], required: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true },
    mode: { type: String, enum: ['simulation', 'alpaca'], required: true },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
