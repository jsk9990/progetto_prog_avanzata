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
exports.checkEmailFormat = exports.checkCredenziali = exports.checkUtente = void 0;
const Utente_1 = require("../Model/Utente");
function checkUtente(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            // Cerca l'utente nel database tramite l'email
            const utente = yield Utente_1.Utente.findOne({ where: { email, password } });
            // Se l'utente esiste, passa al prossimo middleware
            if (!utente) {
                next();
            }
            else {
                res.status(401).json({ error: 'Utente già esistente' });
            }
        }
        catch (error) {
            res.status(500).send('Errore del server: ' + error);
        }
    });
}
exports.checkUtente = checkUtente;
function checkCredenziali(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            // Cerca l'utente nel database tramite l'email e la password fornita
            const utente = yield Utente_1.Utente.findOne({ where: { email, password } });
            // Se le credenziali sono corrette, passa al prossimo middleware
            if (utente) {
                next();
            }
            else {
                // Se le credenziali non sono corrette, restituisci un errore
                res.status(401).json({ error: 'Credenziali non valide' });
            }
        }
        catch (error) {
            // Gestisci eventuali errori di connessione al database o altri errori del server
            res.status(500).send('Errore del server: ' + error);
        }
    });
}
exports.checkCredenziali = checkCredenziali;
function checkEmailFormat(req, res, next) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex per validare il formato email
    const { email } = req.body;
    if (email && emailRegex.test(email)) {
        next(); // Se l'email è valida, passa al prossimo middleware
    }
    else {
        res.status(400).json({ error: 'Formato email non valido' }); // Altrimenti, restituisci un errore
    }
}
exports.checkEmailFormat = checkEmailFormat;
