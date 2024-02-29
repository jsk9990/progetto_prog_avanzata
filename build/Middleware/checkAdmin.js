"use strict";
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
exports.checkAdmin = void 0;
const Utente_1 = require("../Model/Utente");
function checkAdmin(auth, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { jwtDecode } = req.body;
        try {
            const utente = yield Utente_1.Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
            if (!utente) {
                return res.status(401).json({ error: 'Utente non trovato' });
            }
            if (utente.dataValues.privilegi === false) {
                res.status(401).json({ error: 'Utente non autorizzato' });
            }
            next();
        }
        catch (error) {
            res.status(500).send('Errore: ' + error);
        }
    });
}
exports.checkAdmin = checkAdmin;
