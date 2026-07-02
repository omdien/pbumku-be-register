import {Sequelize} from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db_hc = new Sequelize('hc', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db_hc;