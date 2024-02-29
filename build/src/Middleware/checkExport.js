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
exports.checkExport = void 0;
const Grafo_1 = require("../Model/Grafo");
function checkExport(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nome_grafo, from, to, stato_richiesta, format } = req.body;
        // Check if nome_grafo is present
        const grafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: nome_grafo } });
        if (!grafo) {
            return res.status(404).json({ error: 'Grafo non trovato / Nome del grafo inserito non valido ' });
        }
        // Check date format and range
        if (isNaN(Date.parse(from)) || isNaN(Date.parse(to)) || new Date(from) > new Date(to)) {
            return res.status(400).json({ error: 'Formato data non valido o range date incorretto.' });
        }
        // Check stato_richiesta
        if (!['accettata', 'rifiutata', 'in pending'].includes(stato_richiesta)) {
            return res.status(400).json({ error: 'Stato richiesta non valido.' });
        }
        // Check format
        if (!['csv', 'xml', 'pdf', 'json'].includes(format)) {
            return res.status(400).json({ error: 'Formato file non valido.' });
        }
        next();
    });
}
exports.checkExport = checkExport;
