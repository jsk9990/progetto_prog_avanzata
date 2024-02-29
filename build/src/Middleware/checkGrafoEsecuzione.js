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
exports.checkGrafoEsecuzione = void 0;
const Grafo_1 = require("../Model/Grafo");
const Nodi_1 = require("../Model/Nodi");
function checkGrafoEsecuzione(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nome_grafo, nodo_partenza, nodo_arrivo } = req.body;
        // Verifica la struttura del JSON
        if (typeof nome_grafo !== 'string' || typeof nodo_partenza !== 'string' || typeof nodo_arrivo !== 'string') {
            return res.status(400).json({ error: 'Struttura del JSON non valida' });
        }
        try {
            // Verifica la presenza dei nodi nel grafo
            const grafo = yield Grafo_1.Grafo.findOne({ where: { nome_grafo: nome_grafo } });
            if (!grafo) {
                return res.status(404).json({ error: `Non esiste un grafo con nome :    ${nome_grafo} ` });
            }
            const id_grafo = grafo.getDataValue('id_grafo');
            const nodoPartenza = yield Nodi_1.Nodi.findOne({ where: { id_grafo: id_grafo, nodo_nome: nodo_partenza } });
            const nodoArrivo = yield Nodi_1.Nodi.findOne({ where: { id_grafo: id_grafo, nodo_nome: nodo_arrivo } });
            if (!nodoPartenza || !nodoArrivo) {
                return res.status(404).json({ error: 'Nodo di partenza o di arrivo non presente nel grafo' });
            }
            // Se tutto è corretto, continua con il prossimo middleware
            next();
        }
        catch (error) {
            return res.status(500).json({ error: 'Errore del server' });
        }
    });
}
exports.checkGrafoEsecuzione = checkGrafoEsecuzione;
;
