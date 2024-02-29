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
exports.validateGrafoUpdate = void 0;
const Grafo_1 = require("../Model/Grafo");
const Archi_1 = require("../Model/Archi");
function validateGrafoUpdate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nome_grafo, id_archi, descrizione, peso } = req.body;
        try {
            if (nome_grafo) {
                if (typeof nome_grafo !== 'string') {
                    return res.status(400).json({ errore: 'Il campo "nome_grafo" deve essere una stringa.' });
                }
                const grafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: nome_grafo } });
                if (!grafo) {
                    return res.status(404).json({ errore: 'Grafo non trovato' });
                }
            }
            if (id_archi) {
                if (typeof id_archi !== 'number') {
                    return res.status(400).json({ errore: 'Il campo "id_archi" deve essere un numero.' });
                }
                const archi = yield Archi_1.Archi.findByPk(id_archi);
                if (!archi || archi === undefined) {
                    return res.status(404).json({ errore: 'Arco non trovato o non presente nel grafo selezionato' });
                }
            }
            if (descrizione) {
                if (typeof descrizione !== 'string') {
                    return res.status(400).json({ errore: 'Il campo "descrizione" deve essere una stringa.' });
                }
                if (descrizione === null || descrizione === '') {
                    return res.status(400).json({ errore: 'Il campo "descrizione" non puo essere vuoto.' });
                }
            }
            if (peso) {
                if (typeof peso !== 'number') {
                    return res.status(400).json({ errore: 'Il campo "peso" deve essere un numero.' });
                }
                if (peso === null) {
                    return res.status(400).json({ errore: 'Il campo "peso" non puo essere vuoto.' });
                }
                if (peso < 0) {
                    return res.status(400).json({ errore: 'Il campo "peso" non puo essere negativo.' });
                }
            }
            next();
        }
        catch (error) {
            return res.status(500).send('Errore del server: ' + error);
        }
    });
}
exports.validateGrafoUpdate = validateGrafoUpdate;
