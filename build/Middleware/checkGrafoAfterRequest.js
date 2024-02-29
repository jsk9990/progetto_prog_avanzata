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
exports.checkDataUpdateAfterRequest = exports.checkFormatUpdateAfterRequest = void 0;
const Grafo_1 = require("../Model/Grafo");
const Richieste_1 = require("../Model/Richieste");
function checkFormatUpdateAfterRequest(req, res, next) {
    const { nome_grafo, id_richieste } = req.body;
    if (typeof nome_grafo !== 'string' || typeof id_richieste !== 'number') {
        return res.status(400).json({ error: 'Formato del JSON non valido. "nome_grafo" deve essere una stringa e "id_richieste" deve essere un numero.' });
    }
    next();
}
exports.checkFormatUpdateAfterRequest = checkFormatUpdateAfterRequest;
function checkDataUpdateAfterRequest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nome_grafo, id_richieste } = req.body;
        const grafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: nome_grafo } });
        if (!grafo) {
            return res.status(404).json({ error: 'Grafo non trovato / Nome del grafo inserito non valido' });
        }
        const richiesta = yield Richieste_1.Richieste.findOne({ where: { id_richieste: id_richieste }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
        if (!richiesta) {
            return res.status(404).json({ error: 'Richiesta non trovata / Id richiesta inserito non valido' });
        }
        next();
    });
}
exports.checkDataUpdateAfterRequest = checkDataUpdateAfterRequest;
