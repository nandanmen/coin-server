import { Schema, model } from 'mongoose';
import { ICategory } from 'types';

export const categorySchema = new Schema({
  name: { type: String, required: true },
  budget: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

categorySchema.index({ createdBy: 1, name: 1 }, { unique: true });

export default model<ICategory>('Category', categorySchema);
