import mongoose from 'mongoose';
import { Schema } from 'mongoose';


export const feedbacks = new Schema({
    title: { type: String, required: true },
    // id: { type: String, required: true },
    message: { type: String, required: true }, 
    phonenumber: { type: String, required: true },
    
}, { timestamps: true });

module.exports = mongoose.model('feedback', feedbacks);
