import mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const imageSchema = new Schema({
    image: { type: String, required: true },

}, {
    timestamps: true
});

export default mongoose.model('images', imageSchema);