import mongoose, { Schema, Document } from 'mongoose';

export interface IHolding {
  symbol: string;
  quantity: number;
  averagePrice: number;
}

export interface IPortfolio extends Document {
  cash: number;
  holdings: IHolding[];
  createdAt: Date;
  updatedAt: Date;
}

const holdingSchema = new Schema<IHolding>({
  symbol: { type: String, required: true, uppercase: true },
  quantity: { type: Number, required: true, min: 0 },
  averagePrice: { type: Number, required: true, min: 0 },
}, { _id: false });

const portfolioSchema = new Schema<IPortfolio>(
  {
    cash: { type: Number, required: true, default: 100000 },
    holdings: [holdingSchema],
  },
  { timestamps: true }
);

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', portfolioSchema);
