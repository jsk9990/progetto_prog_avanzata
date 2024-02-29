"use strict";
// Inserire questa funzione in un controller, ad esempio `Controller/DB.ts`
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDbConnection = void 0;
const Singleton_1 = require("../Model/Singleton");
const testDbConnection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sequelizeInstance = Singleton_1.Singleton.getConnection();
    try {
        yield sequelizeInstance.authenticate();
        console.log('Connection to the database has been established successfully.');
        res.status(200).send('Database connection test successful.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        res.status(500).send('Database connection test failed.');
    }
});
exports.testDbConnection = testDbConnection;
