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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function checkToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Estrai l'header di autorizzazione
        const authHeader = req.headers['authorization'];
        // Se l'header è presente, dividi il valore in "Bearer" e il token effettivo
        const token = authHeader && authHeader.split(' ')[1];
        // Se il token non è presente, restituisci un errore
        if (token == null) {
            return res.status(401).json({ error: 'Token non fornito' });
        }
        // Verifica il token
        try {
            jsonwebtoken_1.default.verify(token, 'il_tuo_segreto', (err, decoded) => {
                if (err) {
                    // Se c'è un errore nella verifica del token, restituisci un errore
                    return res.status(401).json({ error: 'Token non valido' });
                }
                // Se il token è valido, continua con la prossima funzione middleware
                next();
            });
        }
        catch (error) {
            res.status(500).send('Errore: ' + error);
        }
    });
}
exports.checkToken = checkToken;
