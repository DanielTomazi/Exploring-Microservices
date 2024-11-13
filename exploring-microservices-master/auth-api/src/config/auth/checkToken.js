import jwt from "jsonwebtoken";
import { promisify } from "util";

import * as secrets from "../constants/secret.js";
import * as httpStatus from "../constants/httpStatus.js";
import AuthException from "./AuthException.js";

export default async (req, res, next) => {
    console.info("\n[middleware] Starting token validation.");

    try {
        const { authorization } = req.headers;
        if (!authorization) {
            console.info("[middleware] Token not found in authorization header.");
            throw new AuthException(httpStatus.UNAUTHORIZED, "Access token was not informed.");
        }

        let accessToken = authorization;
        let tokenComponents = accessToken.split(" ");

        if(tokenComponents.length > 1) {
            console.info("[middleware] Spliting token.");
            accessToken = tokenComponents[tokenComponents.length-1];
        }

        console.info("[middleware] Decoding token.");
        const decodedToken = await promisify(jwt.verify)(accessToken, secrets.API_SECRET);

        req.authUser = decodedToken.authUser;

        console.info("[middleware] Token validated.");
        return next();

    } catch (error) {
        console.info("[middleware] Error: " + JSON.stringify(error));
        const status = error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR;

        return res.status(status).json({
            status: status,
            message: error.message ? error.message : "Couldn't complete operation. Try again later."
        })
    }
}