import mongoose from 'mongoose';
import { Schema } from 'mongoose';


export const tripSchema = new Schema({
    phonenumber: { type: String, required: true, minlength: 9 },
    location:{type:String, required: true},
    destnation :{type: String,required : true}
},{
    timestamps:true
});


export default mongoose.model('trips', tripSchema);


