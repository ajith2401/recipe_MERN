import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';
// import dotenv from "dotenv";

// // Load environment variables from a .env file (this is optional in a production environment)
// dotenv.config();

// // Now, you can access your environment variable
// const jwtSecret = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
        return next(errorHandler(401, "Unauthorized: Access token missing."));
    }

    jwt.verify(accessToken, "1d50c142-cec3-45b5-b741-8701b4f233b0", (error, user) => {
        if (error) {
            return next(errorHandler(403, "Forbidden: Invalid access token."));
        }
        req.user = user;
        next();
    });
};


// test
