import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserRepository from "../repository/UserRepository.js";
import UserException from "../exception/UserException.js";
import * as httpStatus from "../../../config/constants/httpStatus.js";
import * as secrets from "../../../config/constants/secret.js";

class UserService {

    async getAccessToken(req) {
        try {
            const { email, password } = req.body;
            this.validateAccessTokenSolicitation(email, password);
            console.info("[getAccessToken] Email validated: " + email);

            let user = await UserRepository.findByEmail(email);
            this.validateUserNotFound(user);
            console.info("[getAccessToken] User validated: " + JSON.stringify({id: user.id, name: user.name}));

            await this.validatePassword(password, user.password);
            console.info("[getAccessToken] Password validated" );

            const authUser = {
                id: user.id,
                email: user.email,
                name: user.name
            }

            console.info("[getAccessToken] Creating tokent with jwt sign.");
            const accessToken = jwt.sign(
                { authUser },
                secrets.API_SECRET,
                { expiresIn: "1d" }
            );

            console.info("[getAccessToken] Returning access token.");
            return {
                status: httpStatus.SUCCESS,
                accessToken
            }

        } catch (error) {
            return {
                status: error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message ? error.message : "Couldn't complete operation. Try again later."
            }
        }


    }

    async findByEmail(req) {
        console.info("[findByEmail] Starting find by email");

        try {
            const { email } = req.params;
            this.validateEmail(email);
            console.info("[findByEmail] Email validated: " + email);

            let user = await UserRepository.findByEmail(email);

            this.validateUserNotFound(user);
            this.validateAuthenticatedUser(user, req.authUser);
            console.info("[findByEmail] user validated. Returning user: " + JSON.stringify(user));

            return {
                status: httpStatus.SUCCESS,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        } catch (error) {
            return {
                status: error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message ? error.message : "Couldn't complete operation. Try again later."
            }
        }
    }

    validateAuthenticatedUser(user, authUser) {
        //OBS: in a real system, it would be better to not use messages where someone can discover which emails are from valid users.
        if(!authUser) {
            console.info("[validateAuthenticatedUser] authUser not found.");
            throw new UserException(httpStatus.FORBIDDEN, "No athenticated user.");
        }

        if(user.id !== authUser.id) {
            console.info("[validateAuthenticatedUser] user ids doesn't match.");
            throw new UserException(httpStatus.FORBIDDEN, "Authenticated user does't has permission to request data from other users.");
        }
    }

    validateAccessTokenSolicitation(email, password) {
        this.validateEmail(email);

        if (!password) {
            console.info("[validateAccessTokenSolicitation]Password not informed. Throwing user exception.");
            throw new UserException(httpStatus.BAD_REQUEST, "Password must be informed.");
        }
    }

    validateEmail(email) {
        if (!this.emailRegexCheck(email)) {
            console.info("[validateEmail] Invalid email. Throwing user exception.");
            throw new UserException(httpStatus.BAD_REQUEST, "Invalid email: " + email);
        }
    }

    emailRegexCheck = (email) => {
        const EMAIL_FORMAT_REGEX = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

        return String(email)
            .toLowerCase()
            .match(EMAIL_FORMAT_REGEX);
    };

    validateUserNotFound(user) {
        if (!user) {
            console.info("[validateUserNotFound] User was not found. Throwing user exception.");
            throw new UserException(httpStatus.NOT_FOUND, "User not found.");
        }
    }

    async validatePassword(password, hashPassword) {
        const passwordMatch = await bcrypt.compare(password, hashPassword);

        if (!passwordMatch) {
            console.info("[validatePassword] Password doesn't match. Throwing user error.");
            throw new UserException(httpStatus.UNAUTHORIZED, "Passwords doesn't match.");
        }
    }
}

export default new UserService();