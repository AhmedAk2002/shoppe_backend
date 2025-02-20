
import mongoose from 'mongoose';
import { Schema } from 'mongoose';


export const table = new Schema({
    name : {type:String, required:true},
    email : {type:String, required:true},
},{
    timestamps:true
});


export default mongoose.model('tabledata', table);


