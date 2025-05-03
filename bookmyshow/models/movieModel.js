const mongoose = require('mongoose');

// Define the movie schema with theater and location details
const movieSchema = new mongoose.Schema({
    movieName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    theaterName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date
    },
    language: {
        type: String
    },
    seatsAvailable: {
        type: Number,
        required: true
    },
    image:{
        type:String
    },
    bookings: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            seatsBooked: {
                type: Number
            },
            bookingDate: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
    },
    deletedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
}, { timestamps: true });

const Movie = mongoose.model("Movie", movieSchema)
module.exports = Movie
