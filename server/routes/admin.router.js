import express from "express";
import { Admin } from "../models/Admin.js";
import { User } from "../models/User.js";
import { Hotel } from "../models/Hotel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const verifyAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Authorization token is required!" });

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const admin = await Admin.findById(payload._id);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({ message: "Access denied!" });
        }
        req.admin = admin;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token!" });
    }
};

router.get("/users", verifyAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/delete-user/:id", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found!" });

        await user.deleteOne();
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/hotels", verifyAdmin, async (req, res) => {
    try {
        const hotels = await Hotel.find().populate("manager", "username email");
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/delete-hotel/:id", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findById(id);
        if (!hotel) return res.status(404).json({ message: "Hotel not found!" });

        await hotel.deleteOne();
        res.status(200).json({ message: "Hotel deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;