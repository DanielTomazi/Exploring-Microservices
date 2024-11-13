import UserService from "../service/UserService.js";

class UserController {
    async getAccessToken(req, res) {
        console.info("\n## Starting getAccessToken ##");

        let accessToken = await UserService.getAccessToken(req);
        return res.status(accessToken.status).json(accessToken);
    }

    async findByEmail(req, res) {
        console.info("\n## Starting findByEmail ##");

        let user = await UserService.findByEmail(req);
        return res.status(user.status).json(user);
    }
}

export default new UserController();