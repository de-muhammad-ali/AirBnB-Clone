const mongoose = require("mongoose");
const Reviews = require("./review");
const User = require('./user')

//Image url
const imageURL = "/images/villa.jpg";

//Schema
const listingSchema = mongoose.Schema({
    title : String,
    description : String,

    image : {
        url: String,
        filename: String
    },

    price : Number,
    location : String,
    country : String,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },

    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Reviews,
    },
    ],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
})


listingSchema.post('findOneAndDelete', async (data) => {
    if(data){
        await Reviews.deleteMany({_id: {$in : data.reviews}})
    }
})


const Listing = mongoose.model("Listing", listingSchema);


module.exports = Listing;