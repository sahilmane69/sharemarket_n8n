import mongoose, { Schema, Document } from 'mongoose';
import { NodeExecutionState } from '../types/workflow.js';

export interface IExecution extends Document {
  _id: mongoose.Types.ObjectId;
  workflowId: mongoose.Types.ObjectId;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  error?: string;
  nodeExecutions: Array<{
    nodeId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    input: Record<string, unknown>;
    output: Record<string, unknown>;
    error?: string;
    startTime?: Date;
    endTime?: Date;
    duration?: number;
  }>;
  finalOutput: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const nodeExecutionSchema = new Schema({
  nodeId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'running', 'completed', 'failed'], required: true },
  input: { type: Schema.Types.Mixed, required: true },
  output: { type: Schema.Types.Mixed, required: true },
  error: String,
  startTime: Date,
  endTime: Date,
  duration: Number,
}, { _id: false });

const executionSchema = new Schema<IExecution>(
  {
    workflowId: { type: Schema.Types.ObjectId, ref: 'Workflow', required: true },
    status: { type: String, enum: ['pending', 'running', 'completed', 'failed'], default: 'pending' },
    startTime: { type: Date, default: () => new Date() },
    endTime: Date,
    duration: Number,
    error: String,
    nodeExecutions: [nodeExecutionSchema],
    finalOutput: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

executionSchema.index({ workflowId: 1 });
executionSchema.index({ createdAt: -1 });

export const Execution = mongoose.model<IExecution>('Execution', executionSchema);
