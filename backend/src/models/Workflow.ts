import mongoose, { Schema, Document } from 'mongoose';
import { WorkflowData, NodeConfig, EdgeConfig } from '../types/workflow.js';

export interface IWorkflow extends WorkflowData, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const nodeSchema = new Schema<NodeConfig>({
  id: { type: String, required: true },
  type: { type: String, enum: ['timer', 'api', 'ai', 'logger', 'trade'], required: true },
  label: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  data: { type: Schema.Types.Mixed, required: true },
}, { _id: false });

const edgeSchema = new Schema<EdgeConfig>({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
}, { _id: false });

const workflowSchema = new Schema<IWorkflow>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    nodes: [nodeSchema],
    edges: [edgeSchema],
    status: { type: String, enum: ['draft', 'active', 'archived'], default: 'draft' },
    tags: [String],
  },
  { timestamps: true }
);

export const Workflow = mongoose.model<IWorkflow>('Workflow', workflowSchema);
