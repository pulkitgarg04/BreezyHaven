import express from "express";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async(req, res) => {
    try {
        const { username, email, fullname, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use!"
            })
        }

        const user = new User({ username, email, fullName, password });
        await user.save();

        res.status(201).json({
            message: "User registered successfully!"
        })
    } catch(error) {
        res.status(500).json({
            error: error.message
        })
    }
});

router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            accessToken,
            refreshToken
        });
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/token", async(req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token is required!"
        });
    }
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await Usr.findById(payload._id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({
                message: "Invalid refresh token"
            });
        }

        const accessToken = user.generateAccessToken();
        res.status(200).json({ accessToken });
    } catch(error) {
        res.status(403).json({
            message: "Invalid or expired refresh token"
        })
    }
});

export default router;