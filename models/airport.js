const mongoose = require("mongoose");

const airportSchema = new mongoose.Schema({
    name: { type:String},
    city: { type:String},
    code: {type: String , unique:true}
});

airportSchema.index({ code: 1 }, { unique: true });
const Airport = mongoose.model("airport", airportSchema);

module.exports={Airport}