import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

const jwtSecret = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
        return next(errorHandler(401, "Unauthorized: Access token missing."));
    }

    jwt.verify(accessToken, jwtSecret, (error, user) => {
        if (error) {
            return next(errorHandler(403, "Forbidden: Invalid access token."));
        }
        req.user = user;
        next();
    });
};


// test
