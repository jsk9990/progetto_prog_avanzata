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
exports.updateCredito = exports.updateUtente = exports.deleteUtente = exports.creaUtente = exports.getUtenti = void 0;
const Utente_1 = require("../Model/Utente");
function getUtenti(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const utenti = yield Utente_1.Utente.findAll();
            res.json({ utenti: utenti });
        }
        catch (error) {
            res.send('Errore:  ' + error);
        }
    });
}
exports.getUtenti = getUtenti;
function creaUtente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, credito, privilegi, token } = req.body;
            const utente = yield Utente_1.Utente.create({ email, password, credito, privilegi });
            res.json({ message: 'I dati sono stati inseriti con successo', utente, token });
        }
        catch (error) {
            res.send('Errore:  ' + error);
        }
    });
}
exports.creaUtente = creaUtente;
function deleteUtente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idUtente } = req.body;
            const utente = yield Utente_1.Utente.destroy({ where: { idUtente } });
            res.send('L utente: ' + idUtente + ' è stato eliminato');
        }
        catch (error) {
            res.send('Errore:  ' + error);
        }
    });
}
exports.deleteUtente = deleteUtente;
function updateUtente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.body.idUtente;
            const newData = req.body;
            console.log('id: ' + id);
            console.log(newData);
            const index = yield Utente_1.Utente.findByPk(id);
            index.set(Object.assign({}, newData));
            yield index.save();
            res.send('I dati sono stati aggiornati con successo: \n' + index);
        }
        catch (error) {
            res.status(500).send('Errore:  ' + error);
        }
    });
}
exports.updateUtente = updateUtente;
function updateCredito(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { utente_da_ricaricare, jwtDecode, nuovo_credito } = req.body;
        const utente = yield Utente_1.Utente.findOne({ where: { email: jwtDecode.email, password: jwtDecode.password } });
        const privilegi = utente === null || utente === void 0 ? void 0 : utente.getDataValue('privilegi');
        if (privilegi === true) {
            const index = yield Utente_1.Utente.findOne({ where: { email: utente_da_ricaricare } });
            index.set({ credito: nuovo_credito });
            yield index.save();
            res.status(200).json({ message: 'Il credito è stato aggiornato con successo con successo: \n', index: index });
        }
    });
}
exports.updateCredito = updateCredito;
