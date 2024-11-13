import { Router } from "express";

import UserController from "../controllers/UserController.js";
import checkToken from "../../../config/auth/checkToken.js";

const router = new Router();
const USER_PATH = '/api/user';

router.post(`${USER_PATH}/auth`, UserController.getAccessToken);

router.use(checkToken);

//to do: create a flexible endpoint to get users with custom query params
router.get(`${USER_PATH}/email/:email`, UserController.findByEmail);

export default router;