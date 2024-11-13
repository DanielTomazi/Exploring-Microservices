import { Sequelize } from "sequelize";

const sequelize = new Sequelize("auth-db", "admin", "a1b2c3d4", {
    host: process.env.DB_HOST ||"localhost",
    dialect: "postgres",
    quoteIdentifiers: false,
    define: {
        syncOnAssociation: true,
        timestamps: false,
        underscored: true,
        freezeTableName: true
    }
});

sequelize.authenticate()
    .then(() => {
        console.info("[sequelize] Connection has been stablished!");
    })
    .catch((err) => {
        console.info("[sequelize] Unable to stablish database connection.");
        console.error(err.message);
    });

export default sequelize;
