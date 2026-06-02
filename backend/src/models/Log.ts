import mongoose, { Schema, Document, Types } from 'mongoose';
import { LogEntry } from '../types/workflow.js';

export interface ILog extends Omit<LogEntry, 'executionId'>, Document {
  _id: mongoose.Types.ObjectId;
  executionId: Types.ObjectId;
}

const logSchema = new Schema<ILog>(
  {
    executionId: { type: Schema.Types.ObjectId, ref: 'Execution', required: true },
    nodeId: { type: String, required: true },
    level: { type: String, enum: ['info', 'warn', 'error', 'debug'], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: () => new Date() },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: false }
);

logSchema.index({ executionId: 1 });
logSchema.index({ nodeId: 1 });
logSchema.index({ timestamp: -1 });

export const Log = mongoose.model<ILog>('Log', logSchema);
