import mongoose from 'mongoose';

export const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phonenumber: { type: String, required: true },
    tarigo: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: false },
    type: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
