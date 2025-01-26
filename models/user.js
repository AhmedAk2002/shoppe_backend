const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export const User = new Schema({
    name: { type: String, required: true },
    phonenumber: { type: String, required: true, minlength: 9 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 4 },
    money: { type: Number, required: true },
    token: { type: String },
    transections: { type: Number, required: true },
    inactive: { type: Number, required: true }, 
    referred: { type: Number, required: true },

}, {
    timestamps: true
});

exports = mongoose.model('user', User);