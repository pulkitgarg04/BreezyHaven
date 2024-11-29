import mongoose from "mongoose";

const { Schema } = mongoose;

const hotelSchema = new Schema(
    {
        images: [{
            type: String,
            // required: true
        }
        ],
        name: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        pricePerNight: {
            type: Number,
            required: true,
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Hotel = mongoose.model("Hotel", hotelSchema);