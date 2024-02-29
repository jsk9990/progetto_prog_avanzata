"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = 'il_tuo_segreto'; // Assicurati di sostituire con la tua chiave segreta
const decodeToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token non fornito' });
    }
    const token = authHeader.split(" ")[1];
    try {
        const jwtDecode = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        if (jwtDecode) {
            // Aggiungi il payload decodificato alla richiesta se necessario
            req.body.jwtDecode = jwtDecode;
            next();
        }
        else {
            res.status(401).json({ error: 'Token non valido' });
        }
    }
    catch (error) {
        res.status(401).json({ error: 'Token non valido o scaduto' });
    }
};
exports.decodeToken = decodeToken;
