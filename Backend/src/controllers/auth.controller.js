const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('../routes/auth.routes');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require("../services/mail.service");


async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const isUserAlreadyExists = await UserModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isUserAlreadyExists) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            username,
            email,
            password: hash
        });



        try {
            await sendWelcomeEmail(user);
        } catch (err) {
            console.error("Welcome email failed:", err.message);
        }



        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET
        )

        res.cookie("token", token);
        return res.status(201).json({
            message: "User registered successfully"
        })





    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: err.message
        });
    }
}

async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;
        const user = await UserModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        // Account blocked
        if (user.status === "blocked") {
            return res.status(403).json({
                message: "Your account has been blocked. Please contact support."
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET
        );

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


async function logoutUser(req, res) {
    res.clearCookie("token");
    return res.status(200).json({
        message: "User logged out successfully"
    });
}

async function getCurrentUser(req, res) {
    try {
        const user = await UserModel.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            user
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
};




