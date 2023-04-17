const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
    flightName: {type:String},
    flightId: {type:String},
    fromPlace: {type:String},
    toPlace: {type:String},
    fromAirport:{type:String},
    toAirport:{type:String},
    image:{type:String},
    fromTime:{type:String},
    fromDate:{type:String},
    toTime:{type:String},
    time:{type:String},
    price:{type:String},
    seats:{type:Number,default:60},
    bookings: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        seats: { type: Number, required: true },
        bookedDate: {type:String},
      }]
    
});



const Flight = mongoose.model('Flight', flightSchema);

module.exports={Flight}