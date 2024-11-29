import express from "express";
import { Hotel } from "../models/Hotel.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const verifyManager = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Authorization token is required!" });

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(payload._id);
        if (!user || user.role !== "manager") {
            return res.status(403).json({ message: "Access denied!" });
        }
        req.manager = user;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token!" });
    }
};

router.post("/add-hotel", verifyManager, async (req, res) => {
    try {
        const { name, location, pricePerNight } = req.body;

        const hotel = new Hotel({
            name,
            location,
            pricePerNight,
            manager: req.manager._id,
        });
        await hotel.save();

        res.status(201).json({ message: "Hotel added successfully!", hotel });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/delete-hotel/:id", verifyManager, async (req, res) => {
    try {
        const { id } = req.params;

        const hotel = await Hotel.findOne({ _id: id, manager: req.manager._id });
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found or access denied!" });
        }

        await hotel.deleteOne();
        res.status(200).json({ message: "Hotel deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;