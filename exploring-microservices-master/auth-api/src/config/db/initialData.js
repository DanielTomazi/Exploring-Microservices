import bcrypt from "bcrypt";
import User from "../../modules/user/model/User.js";

export async function createInitialData() {
    try {
        await User.sync({ force: true });

        const password = await bcrypt.hash("123456", 10);

        await User.create({
            name: "Fist User!",
            email: "firstuser@gmail.com",
            password: password
        });

        await User.create({
            name: "Second User!",
            email: "seconduser@gmail.com",
            password: password
        });

        console.info("Initial data created!");
    } catch (err) {
        console.info("Error while creating initial data.");
        console.error(err);
    }
};