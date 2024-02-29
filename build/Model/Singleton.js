"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = void 0;
const sequelize_1 = require("sequelize");
require("dotenv/config");
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
if (!dbName || !dbUser || !dbPassword) {
    throw new Error('Missing database credentials');
}
class Singleton {
    constructor() {
        this.connection = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
            host: 'localhost',
            dialect: 'mysql'
        });
    }
    ;
    static getConnection() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance.connection;
    }
    ;
}
exports.Singleton = Singleton;
