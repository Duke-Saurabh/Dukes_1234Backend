import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { APIError } from '../utils/APIError.js';
import jwt from 'jsonwebtoken';

import { securityQuestionSchema } from './securityQuestions.modals.js';
// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    userName: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    userPhoto: {
        type: String, // URL from cloudinary
        // required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    securityKey:{
        type:securityQuestionSchema
    },
    friends:[String],
    refreshToken: {
        type: String,
        default: '',
    }
}, { timestamps: true });

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (plainPassword) {
    try {
        return await bcrypt.compare(plainPassword, this.password);
    } catch (err) {
        console.error('Error comparing passwords:', err);
        throw new APIError(404, 'Password does not match.', err);
    }
};

// Define constants for token secrets and lifetimes
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'yourrefreshtokensecrethere';
const REFRESH_TOKEN_LIFE = process.env.REFRESH_TOKEN_LIFE || '7h';
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'youraccesstokensecrethere';
const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE || '1h';

// Function to generate a refresh token
const generateRefreshToken = (payload) => {
    try {
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE });
    } catch (error) {
        throw new APIError(400, 'Error generating refresh token', error);
    }
};

// Function to generate an access token
const generateAccessToken = (payload) => {
    try {
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE });
    } catch (error) {
        throw new APIError(400, 'Error generating access token', error);
    }
};

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the User model and token generation functions
export { User, generateAccessToken, generateRefreshToken, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET };
